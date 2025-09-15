import { Currency } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { SellerProfile } from "./seller-profile";
import { Reservation } from "./reservation";




@Entity()
export abstract class OutboxEvent {

  @PrimaryColumn({type:"uuid"})
  id!: string;

  @Column()
  aggregateId!: string;

  @Column()
  topic!: string;

  @Column({type:"jsonb"})
  value!: any;

  @CreateDateColumn()
  occuredAt!: Date;

  @Column()
  processed!: boolean;

}








