import { Currency, OrderStatus } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { CartProduct } from "./cart-product";
import { OrderProduct } from "./order-product";
import { Address } from "./buyer-profile";
import { Cart } from "./cart";




@Entity()
export abstract class Order {


  @PrimaryGeneratedColumn("uuid")
  id!:string;


  @Column()
  buyerId!: string;


  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order , {cascade:true})
  orderProducts!: OrderProduct[];


  @Column({type:"enum",enum:OrderStatus,default:OrderStatus.CREATED})
  status!: OrderStatus;

  @Column({type:"varchar",unique:true,nullable:true})
  paymentIntentId!:string|null;


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


  @Column({type:"jsonb"})
  address!:Address


  @OneToOne(() => Cart, cart => cart.order, { nullable: true })
  cart!: Cart | null;

}






