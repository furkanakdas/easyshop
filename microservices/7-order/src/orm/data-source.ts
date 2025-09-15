import { DataSource } from "typeorm";
import { Product } from "./entity/product";
import { SellerProfile } from "./entity/seller-profile";
import { CartProduct } from "./entity/cart-product";
import { Cart } from "./entity/cart";
import { BuyerProfile } from "./entity/buyer-profile";
import { Order } from "./entity/order";
import { OrderProduct } from "./entity/order-product";
import { Reservation } from "./entity/reservation";
import { OutboxStripeTransfers } from "./entity/outbox-stripe-transfers";
import { loggerWrapper } from "@faeasyshop/common";
import { OutboxEvent } from "./entity/outbox-event";
import { config } from "../config";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.ORDER_POSTGRES_HOST,
  port: Number(config.ORDER_POSTGRES_PORT),
  username: config.ORDER_POSTGRES_USERNAME,
  password: config.ORDER_POSTGRES_PASSWORD,
  database: config.ORDER_POSTGRES_NAME,
  synchronize: true,
  logging: false,
  entities: [
    Product,SellerProfile,Cart,CartProduct,
    BuyerProfile,Order,OrderProduct,Reservation,
    OutboxStripeTransfers,OutboxEvent
  ],
});


export async function isDbConnected(){

  try {
    await AppDataSource.query('SELECT 1');
    loggerWrapper.info("Database is reachable")
    return true;
  } catch (error) {
    loggerWrapper.error(error);
    return false;
  }

}

