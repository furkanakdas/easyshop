import { CompanyType, Currency, SellerProfileStatus } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";




@Entity()
export  class SellerProfile {

  @PrimaryColumn({type:"uuid"})
  userId!: string;

  @Column()
  email!: string;

  @Column()
  stripeAccountId!:string;

  @Column()
  createdAt!: Date;

  @Column({ type: "enum", enum: SellerProfileStatus })
  status!: SellerProfileStatus;

  @Column()
  businessName!:string
  
  @Column({type:"varchar",nullable:true})
  businessDescription!:string|null


  @Column({ type: "enum", enum: CompanyType })
  companyType!: CompanyType;

}
