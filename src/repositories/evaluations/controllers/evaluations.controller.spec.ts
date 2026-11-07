import { Test, TestingModule } from '@nestjs/testing';

import { EvaluationsService } from '../services/evaluations.service';
import { EvaluationsController } from './evaluations.controller';

describe('EvaluationsController', () => {
  let controller: EvaluationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationsController],
      providers: [EvaluationsService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<EvaluationsController>(EvaluationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
