import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { AppSettingsDto } from './settings.dto';

/** Fila única (id = 1) con los settings institucionales. */
@Entity('app_settings')
export class AppSettings {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ type: 'jsonb' })
  data: AppSettingsDto;

  @VersionColumn()
  version: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'integer', nullable: true })
  updatedById?: number;
}
