import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";

import { Product } from "./product";




@Entity()
export abstract class Reservation {


  @PrimaryGeneratedColumn("uuid")
  id!:string;


  @Column({default:0})
  reserved!:number


  @Column({type:"uuid"})
  productId!:string


  @OneToOne(() => Product,product=>product.reservation,{onDelete:"CASCADE"})
  @JoinColumn({name:"productId"})
  product!: Product;

}






