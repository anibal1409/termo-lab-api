import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Registro de auditoría. Solo inserción: un trigger en BD bloquea UPDATE/DELETE
 * (migración AuditLogs). Sin FK a users para sobrevivir borrados y restauraciones.
 */
@Entity('audit_logs')
@Index(['at'])
@Index(['userId', 'at'])
@Index(['resource', 'at'])
export class AuditLog {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  at: Date;

  @ApiPropertyOptional()
  @Column({ type: 'integer', nullable: true })
  userId?: number | null;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  userEmail?: string | null;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', length: 20, nullable: true })
  userRole?: string | null;

  @ApiProperty({
    example: 'UPDATE',
    description:
      'CREATE | UPDATE | DELETE | READ | LOGIN | LOGIN_FAILED | LOGOUT | …',
  })
  @Column({ type: 'varchar', length: 40 })
  action: string;

  @ApiProperty({ example: 'trials' })
  @Column({ type: 'varchar', length: 60 })
  resource: string;

  @ApiPropertyOptional({ example: '7' })
  @Column({ type: 'varchar', length: 120, nullable: true })
  resourceId?: string | null;

  @ApiProperty({ example: 'PATCH' })
  @Column({ type: 'varchar', length: 10 })
  method: string;

  @ApiProperty({ example: '/api/trials/7' })
  @Column({ type: 'varchar', length: 500 })
  path: string;

  @ApiProperty()
  @Column({ type: 'smallint' })
  statusCode: number;

  @ApiProperty()
  @Column({ type: 'boolean' })
  success: boolean;

  @ApiProperty()
  @Column({ type: 'integer' })
  durationMs: number;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', length: 64, nullable: true })
  ip?: string | null;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string | null;

  @ApiPropertyOptional({
    description:
      'Cuerpo de la petición saneado (secretos enmascarados, truncado)',
  })
  @Column({ type: 'jsonb', nullable: true })
  details?: unknown;
}
