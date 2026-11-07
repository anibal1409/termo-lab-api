import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentOptionController } from './treatment-options.controller';
import { TreatmentOptionService } from './treatment-options.service';

describe('TreatmentOptionController', () => {
  let controller: TreatmentOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatmentOptionController],
      providers: [TreatmentOptionService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<TreatmentOptionController>(
      TreatmentOptionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
