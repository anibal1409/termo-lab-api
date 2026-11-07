import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

import {
  BadRequestException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import { COMMAND_REGEX } from './control';

const COMMAND_TIMEOUT_MS = 2000; // DS18B20 tarda ~750 ms
const PING_INTERVAL_MS = 2000; // debe ser menor que WATCHDOG_MS del firmware (5s)
const RECONNECT_MS = 3000;
const BOOT_WAIT_MS = 4000; // respaldo si no llega "READY" (el Uno se reinicia al abrir el puerto)

export interface ConnectionHandlers {
  /** Línea "EVT <pin> <valor>" enviada espontáneamente por el Arduino. */
  onEvent: (pin: string, value: number) => void;
  /** Se llama tras abrir (o reabrir) el puerto, para reconfigurar pines. */
  onReady: () => Promise<void>;
}

/** Una conexión serie con un Arduino. Un objeto por dispositivo. */
export class SerialConnection {
  private readonly logger: Logger;
  private port?: SerialPort;
  private queue: Promise<unknown> = Promise.resolve();
  private pending?: (line: string) => void;
  private pingTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;
  private bootTimer?: NodeJS.Timeout;
  private resolveOpen?: () => void;
  private closed = false;

  constructor(
    readonly path: string,
    readonly baudRate: number,
    private readonly handlers: ConnectionHandlers,
  ) {
    this.logger = new Logger(`Serial ${path}`);
  }

  get connected() {
    return !!this.port?.isOpen;
  }

  async open() {
    await this.openPort();
  }

  async close() {
    this.closed = true;
    clearInterval(this.pingTimer);
    clearTimeout(this.reconnectTimer);
    clearTimeout(this.bootTimer);
    this.pingTimer = undefined;
    if (this.port?.isOpen) {
      await new Promise<void>((r) => this.port!.close(() => r()));
    }
    this.port = undefined;
  }

  /** Envía un comando y devuelve la respuesta. Serializado: uno a la vez. */
  send(command: string): Promise<string> {
    const cmd = command.trim();
    if (!COMMAND_REGEX.test(cmd)) {
      return Promise.reject(
        new BadRequestException(`Comando inválido: ${cmd}`),
      );
    }
    const run = () => this.write(cmd);
    const result = this.queue.then(run, run);
    this.queue = result.catch(() => undefined);
    return result;
  }

  private openPort() {
    return new Promise<void>((resolve, reject) => {
      const port = new SerialPort({
        path: this.path,
        baudRate: this.baudRate,
        autoOpen: false,
      });
      port
        .pipe(new ReadlineParser({ delimiter: '\n' }))
        .on('data', (l: string) => this.onLine(l.trim()));
      port.on('close', () => this.onClose());
      port.on('error', (e) => this.logger.error(e.message));
      port.open((err) => {
        if (err) return reject(err);
        this.port = port;
        this.logger.log(`Conectado @ ${this.baudRate}`);
        this.resolveOpen = resolve;
        // Normalmente llega "READY" al reiniciarse la placa; si no, configura igual.
        this.bootTimer = setTimeout(() => this.configure(), BOOT_WAIT_MS);
      });
    });
  }

  /** Arranca el PING y (re)envía la configuración de pines. Se llama en cada READY. */
  private async configure() {
    clearTimeout(this.bootTimer);
    if (!this.pingTimer) {
      this.pingTimer = setInterval(
        () => this.send('PING').catch(() => undefined),
        PING_INTERVAL_MS,
      );
    }
    try {
      await this.handlers.onReady();
      this.logger.log('Pines configurados');
    } catch (e) {
      this.logger.error(`Configuración: ${(e as Error).message}`);
    } finally {
      this.resolveOpen?.();
      this.resolveOpen = undefined;
    }
  }

  private onClose() {
    clearInterval(this.pingTimer);
    clearTimeout(this.bootTimer);
    this.pingTimer = undefined;
    this.port = undefined;
    if (this.closed) return;
    this.logger.warn('Puerto cerrado, reintentando...');
    this.reconnectTimer = setTimeout(
      () => this.openPort().catch(() => this.onClose()),
      RECONNECT_MS,
    );
  }

  private onLine(line: string) {
    if (!line) return;
    // La placa arrancó (o se reinició): pierde los modos de pin, hay que reconfigurar.
    if (line === 'READY') {
      this.configure();
      return;
    }
    const m = /^EVT (\S+) (-?\d+)$/.exec(line);
    if (m) return this.handlers.onEvent(m[1], +m[2]);
    const cb = this.pending;
    this.pending = undefined;
    cb?.(line);
  }

  private write(cmd: string) {
    return new Promise<string>((resolve, reject) => {
      if (!this.port?.isOpen) {
        return reject(new ServiceUnavailableException('Arduino no conectado'));
      }
      const timer = setTimeout(() => {
        this.pending = undefined;
        reject(new ServiceUnavailableException(`Sin respuesta a "${cmd}"`));
      }, COMMAND_TIMEOUT_MS);
      this.pending = (line) => {
        clearTimeout(timer);
        if (line.startsWith('ERR')) reject(new BadRequestException(line));
        else resolve(line);
      };
      this.port.write(cmd + '\n');
    });
  }
}
