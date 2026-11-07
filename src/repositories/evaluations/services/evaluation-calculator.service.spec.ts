import { Test, TestingModule } from '@nestjs/testing';

import { EvaluationCalculatorService } from './evaluation-calculator.service';

describe('EvaluationCalculatorService', () => {
  let service: EvaluationCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationCalculatorService],
    }).compile();

    service = module.get<EvaluationCalculatorService>(
      EvaluationCalculatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('aprueba min/max/range correctamente', () => {
    expect(service.isCriteriaApproved(70, 60, 'min')).toBe(true);
    expect(service.isCriteriaApproved(50, 60, 'min')).toBe(false);
    expect(service.isCriteriaApproved(40, 50, 'max')).toBe(true);
    expect(service.isCriteriaApproved(60, 50, 'max')).toBe(false);
    expect(service.isCriteriaApproved(75, 60, 'range', 90)).toBe(true);
    expect(service.isCriteriaApproved(95, 60, 'range', 90)).toBe(false);
  });

  it('resuelve operador desde maxValue', () => {
    expect(
      service.resolveComparisonOperator({ requiredValue: 60, maxValue: 90 }),
    ).toBe('range');
    expect(
      service.resolveComparisonOperator({ requiredValue: 50, maxValue: 50 }),
    ).toBe('max');
    expect(service.resolveComparisonOperator({ requiredValue: 60 })).toBe(
      'min',
    );
    expect(
      service.resolveComparisonOperator({
        comparisonOperator: 'max',
        requiredValue: 10,
        maxValue: 20,
      }),
    ).toBe('max');
  });

  it('rechaza si hay fallas críticas', () => {
    const result = service.calculateEvaluationResult([
      {
        approved: false,
        complianceMargin: 50,
        isCritical: true,
        weight: 1,
      },
      {
        approved: true,
        complianceMargin: 100,
        isCritical: false,
        weight: 1,
      },
    ]);
    expect(result.approved).toBe(false);
    expect(result.criticalFailures).toBe(1);
  });
});
