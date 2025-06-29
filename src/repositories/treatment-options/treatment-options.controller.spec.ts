import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentOptionsController } from './treatment-options.controller';
import { TreatmentOptionsService } from './treatment-options.service';

describe('TreatmentOptionsController', () => {
  let controller: TreatmentOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatmentOptionsController],
      providers: [TreatmentOptionsService],
    }).compile();

    controller = module.get<TreatmentOptionsController>(TreatmentOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
