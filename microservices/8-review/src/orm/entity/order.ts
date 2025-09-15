import { Currency, OrderStatus } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { OrderProduct } from "./order-product";



@Entity()
export abstract class Order {


  @PrimaryColumn({type:"uuid"})
  id!:string;


  @Column()
  buyerId!: string;


  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order , {cascade:true})
  orderProducts!: OrderProduct[];


  @Column({type:"enum",enum:OrderStatus,default:OrderStatus.CREATED})
  status!: OrderStatus;


  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;


}






