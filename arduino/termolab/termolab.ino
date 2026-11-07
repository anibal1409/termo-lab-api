// TermoLab - firmware genérico controlado por serie (Arduino Uno/Nano CH340).
// Protocolo: una línea por comando, respuesta "OK", "PONG", "VAL ..." o "ERR ...".
//   PING                       -> PONG
//   MODE <pin> IN|OUT|PULLUP
//   WRITE <pin> 0|1            salida digital
//   PWM <pin> 0-255            pines ~ (3,5,6,9,10,11)
//   SERVO <pin> 0-180
//   READ <pin>                 A0-A5 -> "VAL A0 0-1023", Dn -> "VAL 7 0/1"
//   WATCH <pin> 0|1            avisa "EVT <pin> <v>" cuando cambia una entrada digital
//   TC <cs> <sck> <so>         termopar MAX6675            -> "VAL 23.75"
//   DS <pin> <index>           DS18B20 (OneWire)           -> "VAL 23.75"
//   PT <cs> <di> <do> <clk> <hilos 2|3|4>  PT100 MAX31865  -> "VAL 23.75"
// Seguridad: sin comandos durante WATCHDOG_MS, todas las salidas pasan a LOW.
//
// Requiere la librería "Servo" (incluida en el IDE; con arduino-cli: lib install Servo).
// Librerías opcionales (Gestor de librerías del IDE). Si no están instaladas,
// el comando correspondiente responde "ERR no lib" y el resto funciona igual:
//   DS18B20 -> "OneWire" + "DallasTemperature"
//   PT100   -> "Adafruit MAX31865"

#include <Servo.h>

#if __has_include(<OneWire.h>) && __has_include(<DallasTemperature.h>)
#include <OneWire.h>
#include <DallasTemperature.h>
#define HAS_DS18B20 1
#endif

#if __has_include(<Adafruit_MAX31865.h>)
#include <Adafruit_MAX31865.h>
#define HAS_MAX31865 1
#endif

const unsigned long WATCHDOG_MS = 5000;  // calibrar: mayor que el PING del backend (2s)
const float PT_RREF = 430.0;             // calibrar: resistencia de referencia del módulo MAX31865
const float PT_RNOMINAL = 100.0;         // PT100
const byte SERVO_SLOTS = 6;
const byte NPINS = 20;  // D0-D13 + A0-A5 (14-19)
const byte MAX_TOK = 7;

Servo servos[SERVO_SLOTS];
byte servoPin[SERVO_SLOTS];
bool isOutput[NPINS];
bool watched[NPINS];
int lastValue[NPINS];
unsigned long lastCmd = 0;
bool tripped = false;
String line;

int parsePin(const String &s) {
  if (s.length() == 0) return -1;
  char c = toupper(s[0]);
  int p = c == 'A' ? 14 + s.substring(1).toInt()
        : c == 'D' ? s.substring(1).toInt()
        : s.toInt();
  // 0 y 1 son RX/TX del USB: no se tocan
  return (p < 2 || p >= NPINS) ? -1 : p;
}

void allOff() {
  for (byte i = 0; i < SERVO_SLOTS; i++)
    if (servoPin[i]) { servos[i].detach(); servoPin[i] = 0; }
  for (byte p = 2; p < NPINS; p++)
    if (isOutput[p]) digitalWrite(p, LOW);
}

Servo *servoFor(byte pin) {
  for (byte i = 0; i < SERVO_SLOTS; i++) if (servoPin[i] == pin) return &servos[i];
  for (byte i = 0; i < SERVO_SLOTS; i++)
    if (!servoPin[i]) { servoPin[i] = pin; servos[i].attach(pin); return &servos[i]; }
  return nullptr;
}

// MAX6675 por software (sin librería). Necesita >=220 ms entre lecturas.
float readMax6675(byte cs, byte sck, byte so) {
  pinMode(cs, OUTPUT); pinMode(sck, OUTPUT); pinMode(so, INPUT);
  digitalWrite(cs, LOW);
  delayMicroseconds(10);
  uint16_t v = 0;
  for (int8_t i = 15; i >= 0; i--) {
    digitalWrite(sck, HIGH);
    delayMicroseconds(10);
    if (digitalRead(so)) v |= (1 << i);
    digitalWrite(sck, LOW);
    delayMicroseconds(10);
  }
  digitalWrite(cs, HIGH);
  if (v & 0x4) return NAN;  // termopar abierto
  return (v >> 3) * 0.25;
}

void printVal(float v) {
  if (isnan(v)) { Serial.println("ERR sensor"); return; }
  Serial.print("VAL "); Serial.println(v, 2);
}

void handle(String cmd) {
  cmd.trim();
  if (cmd.length() == 0) return;
  cmd.toUpperCase();

  String t[MAX_TOK];
  byte n = 0;
  int start = 0;
  while (n < MAX_TOK && start < (int)cmd.length()) {
    int sp = cmd.indexOf(' ', start);
    if (sp < 0) sp = cmd.length();
    if (sp > start) t[n++] = cmd.substring(start, sp);
    start = sp + 1;
  }
  String op = t[0];

  lastCmd = millis();
  tripped = false;

  if (op == "PING") { Serial.println("PONG"); return; }

  int pin = parsePin(t[1]);
  if (pin < 0) { Serial.println("ERR pin"); return; }
  long v = t[2].toInt();

  if (op == "MODE") {
    if (t[2] == "OUT") { pinMode(pin, OUTPUT); isOutput[pin] = true; }
    else if (t[2] == "IN") { pinMode(pin, INPUT); isOutput[pin] = false; }
    else if (t[2] == "PULLUP") { pinMode(pin, INPUT_PULLUP); isOutput[pin] = false; }
    else { Serial.println("ERR mode"); return; }
    Serial.println("OK");
  } else if (op == "WRITE") {
    if (!isOutput[pin]) { Serial.println("ERR not output"); return; }
    digitalWrite(pin, v ? HIGH : LOW);
    Serial.println("OK");
  } else if (op == "PWM") {
    if (!isOutput[pin]) { Serial.println("ERR not output"); return; }
    if (digitalPinToTimer(pin) == NOT_ON_TIMER) { Serial.println("ERR no pwm"); return; }
    analogWrite(pin, constrain(v, 0, 255));
    Serial.println("OK");
  } else if (op == "SERVO") {
    Servo *sv = servoFor(pin);
    if (!sv) { Serial.println("ERR no servo slot"); return; }
    isOutput[pin] = true;
    sv->write(constrain(v, 0, 180));
    Serial.println("OK");
  } else if (op == "READ") {
    int val = pin >= 14 ? analogRead(pin) : digitalRead(pin);
    Serial.print("VAL "); Serial.print(t[1]); Serial.print(' '); Serial.println(val);
  } else if (op == "WATCH") {
    watched[pin] = v != 0;
    lastValue[pin] = digitalRead(pin);
    Serial.println("OK");
  } else if (op == "TC") {
    int sck = parsePin(t[2]), so = parsePin(t[3]);
    if (sck < 0 || so < 0) { Serial.println("ERR pin"); return; }
    printVal(readMax6675(pin, sck, so));
  } else if (op == "DS") {
#ifdef HAS_DS18B20
    OneWire ow(pin);
    DallasTemperature dt(&ow);
    dt.begin();
    dt.requestTemperatures();  // ~750 ms a 12 bits
    float c = dt.getTempCByIndex(v);
    printVal(c == DEVICE_DISCONNECTED_C ? NAN : c);
#else
    Serial.println("ERR no lib");
#endif
  } else if (op == "PT") {
#ifdef HAS_MAX31865
    int di = parsePin(t[2]), dout = parsePin(t[3]), clk = parsePin(t[4]);
    if (di < 0 || dout < 0 || clk < 0) { Serial.println("ERR pin"); return; }
    long wires = t[5].toInt();
    Adafruit_MAX31865 pt(pin, di, dout, clk);
    pt.begin(wires == 2 ? MAX31865_2WIRE : wires == 4 ? MAX31865_4WIRE : MAX31865_3WIRE);
    float c = pt.temperature(PT_RNOMINAL, PT_RREF);
    bool fault = pt.readFault();
    pt.clearFault();
    printVal(fault ? NAN : c);
#else
    Serial.println("ERR no lib");
#endif
  } else {
    Serial.println("ERR cmd");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("READY");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') { handle(line); line = ""; }
    else if (c != '\r' && line.length() < 40) line += c;
  }

  if (!tripped && lastCmd && millis() - lastCmd > WATCHDOG_MS) {
    allOff();
    tripped = true;
    Serial.println("EVT WATCHDOG 1");
  }

  for (byte p = 2; p < NPINS; p++) {
    if (!watched[p]) continue;
    int v = digitalRead(p);
    if (v != lastValue[p]) {
      lastValue[p] = v;
      Serial.print("EVT "); Serial.print(p); Serial.print(' '); Serial.println(v);
    }
  }
}
