import { Currency } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, } from "typeorm";
import { Cart } from "./cart";




@Entity()
export abstract class CartProduct {

  @PrimaryGeneratedColumn("uuid")
  id!: string;



  @Column({ type: "uuid" })
  cartId!: string;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cartId" })
  cart!: Cart


  @Column({ type: "uuid" })
  productId!: string;

  @Column()
  productName!: string;

  @Column("numeric", { precision: 10, scale: 2 })
  price!: number;


  @Column({ type: "uuid" })
  sellerId!: string;

  @Column({ type: "enum", enum: Currency })
  currency!: Currency;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "int" })
  quantity!: number

  @CreateDateColumn()
  createdAt!: Date;



}

