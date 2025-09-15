import { DataSource } from "typeorm";
import { Order } from "./entity/order";
import { OrderProduct } from "./entity/order-product";
import { Review } from "./entity/review";
import { config } from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.REVIEW_POSTGRES_HOST,
  port: Number(config.REVIEW_POSTGRES_PORT),
  username: config.REVIEW_POSTGRES_USERNAME,
  password: config.REVIEW_POSTGRES_PASSWORD,
  database: config.REVIEW_POSTGRES_NAME,
  synchronize: true,
  logging: false,
  entities: [Review,Order,OrderProduct],
});

