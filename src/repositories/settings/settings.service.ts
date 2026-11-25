import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  AppSettingsDto,
  AppSettingsResponseDto,
  DEFAULT_SETTINGS,
  UpdateAppSettingsDto,
} from './settings.dto';
import { AppSettings } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AppSettings)
    private readonly repo: Repository<AppSettings>,
  ) {}

  /** Settings efectivos: defaults de fábrica + lo guardado (campos nuevos toman su default). */
  async get(): Promise<AppSettingsResponseDto> {
    const row = await this.repo.findOne({ where: { id: 1 } });
    return {
      ...DEFAULT_SETTINGS,
      ...(row?.data ?? {}),
      version: row?.version ?? 0,
      updatedAt: row?.updatedAt ?? new Date(0),
      updatedById: row?.updatedById,
    };
  }

  async update(
    dto: UpdateAppSettingsDto,
    userId: number,
  ): Promise<AppSettingsResponseDto> {
    const row = await this.repo.findOne({ where: { id: 1 } });
    return this.save({ ...DEFAULT_SETTINGS, ...row?.data, ...dto }, userId);
  }

  reset(userId: number): Promise<AppSettingsResponseDto> {
    return this.save({ ...DEFAULT_SETTINGS }, userId);
  }

  private async save(
    data: AppSettingsDto,
    userId: number,
  ): Promise<AppSettingsResponseDto> {
    const row =
      (await this.repo.findOne({ where: { id: 1 } })) ??
      this.repo.create({ id: 1 });
    row.data = data;
    row.updatedById = userId;
    await this.repo.save(row);
    return this.get();
  }
}
