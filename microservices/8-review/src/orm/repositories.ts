import { AppDataSource } from './data-source'; // veri kaynağını import et
import { Order } from './entity/order';
import { OrderProduct } from './entity/order-product';
import { Review } from './entity/review';





 export const reviewRepository = AppDataSource.getRepository(Review);

 export const orderRepository = AppDataSource.getRepository(Order);
 export const orderProductRepository = AppDataSource.getRepository(OrderProduct);






export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query('SELECT 1'); // Basit ve hızlı bir sorgu
    await queryRunner.release();
    return true;
  } catch (err) {
    return false;
  }
}



class HelperRepository{


}


export  const helperRepository = new HelperRepository()