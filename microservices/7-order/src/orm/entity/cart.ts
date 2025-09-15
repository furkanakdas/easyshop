import { Currency } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { CartProduct } from "./cart-product";
import { Order } from "./order";




@Entity()
export abstract class Cart {


  @PrimaryGeneratedColumn("uuid")
  id!:string;



  @Column({unique:true})
  buyerId!: string;


  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart , {cascade:true})
  cartProducts!: CartProduct[];


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;



  @Column({type:"uuid",nullable:true})
  orderId!:string|null


  @OneToOne(() => Order, order => order.cart, { nullable: true , cascade:true, onDelete:"SET NULL" })
  @JoinColumn({name:"orderId"})
  order!: Order | null;


}






