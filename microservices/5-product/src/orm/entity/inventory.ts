import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./product";
;

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;


  @Column({ type: "uuid" })
  productId!: string;

  @OneToOne(() => Product, (product) => product.inventory, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column({ type: "int", default: 0 })
  quantity!: number;


}