import { ReviewRate, ReviewTargetType } from "@faeasyshop/common";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,  UpdateDateColumn } from "typeorm";





@Entity()
export abstract class Review {


  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({type:"uuid"})
  buyerId!: string;

  @Column({type:"uuid"})
  targetId!:string

  @Column({type:"uuid"})
  targetSnapshotId!:string

  @Column({type:"enum",enum:ReviewTargetType})
  targetType!:ReviewTargetType
  
  @Column({type:"enum",enum:ReviewRate})
  rating!:ReviewRate

  @Column({type:"varchar",nullable:true})
  comment!:string|null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


}






