import { Currency } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { SellerProfile } from "./seller-profile";
import { Reservation } from "./reservation";




@Entity()
export abstract class Product {

  @PrimaryColumn({type:"uuid"})
  id!: string;

  @Column()
  name!: string;

  @Column({type:"text",nullable:true})
  description!: string | null;

  @Column("numeric", { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "enum", enum: Currency })
  currency!: Currency;

  @Column({ type: "varchar" })
  stripePriceId!: string;

  @Column({ type: "varchar" })
  stripeProductId!: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;


  @Column({ type: "uuid" })
  sellerId!: string;

  @ManyToOne(()=>SellerProfile,{onDelete:"CASCADE"})
  @JoinColumn({name:"sellerId"})
  seller!:SellerProfile

  @Column({type:"int"})
  quantity!: number;






  // @Column({type:"uuid",nullable:true})
  // reservationId!:string


  @OneToOne(() => Reservation,reservation=>reservation.product,{cascade:true})
  // @JoinColumn({name:"reservationId"})
  reservation!: Reservation;


}






