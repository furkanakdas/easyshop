import { AppDataSource } from './data-source'; // veri kaynağını import et
import { BuyerProfile } from './entity/buyer-profile';
import { Cart } from './entity/cart';
import { CartProduct } from './entity/cart-product';
import { Order } from './entity/order';
import { OrderProduct } from './entity/order-product';
import { OutboxEvent } from './entity/outbox-event';
import { OutboxStripeTransfers } from './entity/outbox-stripe-transfers';
import { Product } from './entity/product';
import { Reservation } from './entity/reservation';
import { SellerProfile } from './entity/seller-profile';



 export const productRepository = AppDataSource.getRepository(Product);

 export const sellerProfileRepository = AppDataSource.getRepository(SellerProfile);

 export const cartRepository = AppDataSource.getRepository(Cart);


 export const cartProductRepository = AppDataSource.getRepository(CartProduct);

 export const buyerProfileRepository = AppDataSource.getRepository(BuyerProfile);



 export const orderRepository = AppDataSource.getRepository(Order);
 export const orderProductRepository = AppDataSource.getRepository(OrderProduct);

 export const reservationRepository = AppDataSource.getRepository(Reservation);

 export const outboxStripeTransfersRepository = AppDataSource.getRepository(OutboxStripeTransfers);
 export const outboxEventRepository = AppDataSource.getRepository(OutboxEvent);



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