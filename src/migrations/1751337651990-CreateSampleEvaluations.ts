import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

import {
  Evaluation,
  EvaluationCriteria,
  ExternalTreatment,
} from '../repositories/evaluations/entities';
import { Treatment } from '../repositories/treatments/entities';
import { User } from '../repositories/users/entities';

export class CreateSampleEvaluations1751337651990
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const evaluationRepository = queryRunner.manager.getRepository(Evaluation);
    const treatmentRepository = queryRunner.manager.getRepository(Treatment);
    const userRepository = queryRunner.manager.getRepository(User);
    const externalTreatmentRepository =
      queryRunner.manager.getRepository(ExternalTreatment);
    const criteriaRepository =
      queryRunner.manager.getRepository(EvaluationCriteria);

    const [adminUser, operatorUser] = await Promise.all([
      userRepository.findOneBy({ email: 'admin@termolab.com' }),
      userRepository.findOneBy({ email: 'operador@termolab.com' }),
    ]);

    const treatments = await treatmentRepository.find();

    // Crear tratador externo de ejemplo
    const externalTreatment = externalTreatmentRepository.create({
      name: 'Tratador Field X-102',
      type: 'horizontal',
      totalFlow: 800,
      waterFraction: 25,
      apiGravity: 17,
      oilRetentionTime: 75,
    });
    await externalTreatmentRepository.save(externalTreatment);

    // Criterios comunes para evaluaciones
    const commonCriteria = [
      {
        name: 'Retención de petróleo',
        description:
          'Tiempo mínimo requerido: 60 minutos según API-12L sección 4.5',
        requiredValue: 60,
        actualValue: 62.5,
        approved: true,
        complianceMargin: 104.17,
        isCritical: true,
        weight: 30,
        unit: 'minutos',
      },
      // Más criterios...
    ];

    // Crear evaluaciones para tratadores internos
    const internalEvaluations = treatments.map((treatment) => {
      const evaluation = new Evaluation();
      evaluation.evaluationType = 'internal';
      evaluation.treatment = treatment;
      evaluation.evaluatedBy = Math.random() > 0.5 ? adminUser : operatorUser;
      evaluation.evaluationDate = new Date();
      evaluation.approved = Math.random() > 0.2;
      evaluation.comments =
        Math.random() > 0.7 ? 'Requiere monitoreo adicional' : undefined;
      evaluation.score = Math.floor(Math.random() * 30) + 70;
      return evaluation;
    });

    // Crear evaluación para tratador externo
    const externalEvaluation = new Evaluation();
    externalEvaluation.evaluationType = 'external';
    externalEvaluation.externalTreatment = externalTreatment;
    externalEvaluation.evaluatedBy = operatorUser;
    externalEvaluation.evaluationDate = new Date();
    externalEvaluation.approved = true;
    externalEvaluation.comments = 'Cumple con todos los requisitos';
    externalEvaluation.score = 92.5;

    // Guardar evaluaciones
    const savedEvaluations = await evaluationRepository.save([
      ...internalEvaluations,
      externalEvaluation,
    ]);

    // Guardar criterios para cada evaluación
    for (const evaluation of savedEvaluations) {
      const criteria = commonCriteria.map((c) => {
        const newCriteria = new EvaluationCriteria();
        Object.assign(newCriteria, {
          ...c,
          evaluation,
          actualValue: c.actualValue * (0.9 + Math.random() * 0.2),
        });
        return newCriteria;
      });
      await criteriaRepository.save(criteria);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM evaluation_criteria`);
    await queryRunner.query(`DELETE FROM external_treatments`);
    await queryRunner.query(`DELETE FROM evaluations`);
  }
}
