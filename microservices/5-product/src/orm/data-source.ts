import { DataSource } from "typeorm";
import { Product } from "./entity/product";
import { Category } from "./entity/category";
import { AttributeDefinition } from "./entity/attribute-definition";
import { ProductAttributeValue } from "./entity/product-attribute-value";
import { Inventory } from "./entity/inventory";
import { Tag } from "./entity/tag";
import { SellerProfile } from "./entity/seller-profile";
import { OutboxEvent } from "./entity/outbox-event";
import { config } from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.PRODUCT_POSTGRES_HOST,
  port: Number(config.PRODUCT_POSTGRES_PORT),
  username: config.PRODUCT_POSTGRES_USERNAME,
  password: config.PRODUCT_POSTGRES_PASSWORD,
  database: config.PRODUCT_POSTGRES_NAME,
  synchronize: true,
  logging: false,
  entities: [Product,Category,AttributeDefinition,ProductAttributeValue,Inventory,Tag,SellerProfile,OutboxEvent],
});

