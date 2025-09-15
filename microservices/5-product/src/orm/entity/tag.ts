import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from "typeorm";
import { Product } from "./product";
import { UserRole } from "@faeasyshop/common";


@Entity()
export class Tag {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products!: Product[];

  @Column({type: "enum",enum: UserRole,default: UserRole.SYSTEM})
  controlledBy!: UserRole;
  
}