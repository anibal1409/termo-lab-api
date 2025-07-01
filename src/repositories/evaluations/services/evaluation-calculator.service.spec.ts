import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCalculatorService } from './evaluation-calculator.service';

describe('EvaluationCalculatorService', () => {
  let service: EvaluationCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationCalculatorService],
    }).compile();

    service = module.get<EvaluationCalculatorService>(EvaluationCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
