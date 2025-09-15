
import { EntityManager } from 'typeorm';
import { AppDataSource } from '../../orm/data-source';

export async function runInTransaction<T>(
  callback: (manager: EntityManager) => Promise<T>
): Promise<T> {
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback(queryRunner.manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}


// import { runInTransaction } from './transaction';
// import { User } from './entity/User';

// await runInTransaction(async (manager) => {
//   const user = manager.create(User, { name: 'Furkan' });
//   await manager.save(user);

//   // başka işlemler...
// });