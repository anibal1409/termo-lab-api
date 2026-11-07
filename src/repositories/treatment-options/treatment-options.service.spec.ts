import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentOptionService } from './treatment-options.service';

describe('TreatmentOptionService', () => {
  let service: TreatmentOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreatmentOptionService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<TreatmentOptionService>(TreatmentOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
