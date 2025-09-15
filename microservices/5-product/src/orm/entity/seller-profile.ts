import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AttributeDefinition } from "./attribute-definition";
import { Product } from "./product";



@Entity()
export class SellerProfile {
    
  @PrimaryColumn({type:"uuid"})
  userId!: string;

  @Column({unique:true})
  stripeAccountId!: string;

}