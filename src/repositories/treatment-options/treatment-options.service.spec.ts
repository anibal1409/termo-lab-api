import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentOptionsService } from './treatment-options.service';

describe('TreatmentOptionsService', () => {
  let service: TreatmentOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreatmentOptionsService],
    }).compile();

    service = module.get<TreatmentOptionsService>(TreatmentOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
