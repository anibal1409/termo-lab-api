import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

import {
  EvaluationTemplate,
  EvaluationTemplateCriteria,
} from '../repositories/evaluations/entities';

export class CreateEvaluationTemplates1751337696278
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const templateRepository =
      queryRunner.manager.getRepository(EvaluationTemplate);
    const criteriaRepository = queryRunner.manager.getRepository(
      EvaluationTemplateCriteria,
    );

    // Plantilla para tratadores verticales
    const verticalTemplate = templateRepository.create({
      name: 'Evaluación API-12L para tratadores verticales',
      description:
        'Plantilla estándar según norma API-12L para tratadores verticales',
      version: '1.0.0',
      applicableTo: 'vertical',
      isActive: true,
    });

    // Plantilla para tratadores horizontales
    const horizontalTemplate = templateRepository.create({
      name: 'Evaluación API-12L para tratadores horizontales',
      description:
        'Plantilla estándar según norma API-12L para tratadores horizontales',
      version: '1.0.0',
      applicableTo: 'horizontal',
      isActive: true,
    });

    const savedTemplates = await templateRepository.save([
      verticalTemplate,
      horizontalTemplate,
    ]);

    // Criterios comunes
    const commonCriteria = [
      {
        name: 'Retención de petróleo',
        description:
          'Tiempo mínimo requerido: 60 minutos según API-12L sección 4.5',
        minValue: 60,
        unit: 'minutos',
        isCritical: true,
        weight: 30,
      },
      // Más criterios...
    ];

    // Asignar criterios a plantillas
    for (const template of savedTemplates) {
      const criteria = commonCriteria.map((c) => ({
        ...c,
        template,
        maxValue: template.applicableTo === 'vertical' ? 120 : 150, // Valores máximos diferentes
      }));
      await criteriaRepository.save(criteria);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM evaluation_template_criteria`);
    await queryRunner.query(`DELETE FROM evaluation_templates`);
  }
}
