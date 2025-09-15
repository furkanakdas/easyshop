import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { nullable } from "zod";
import { Currency } from "../enums/currency.enum";
import { Category } from "./category";
import { ProductAttributeValue } from "./product-attribute-value";
import { Inventory } from "./inventory";
import { Tag } from "./tag";




@Entity()
export abstract class Product {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column("numeric", {
    precision: 10, scale: 2
  })
  price!: number;

  @Column({ type: "enum", enum: Currency })
  currency!: Currency;


  @Column({ type: "varchar" })
  stripePriceId!: string;

  @Column({ type: "varchar" })
  stripeProductId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


  @Column({ type: "uuid" })
  sellerId!: string;


  @OneToOne(() => Inventory, (inventory) => inventory.product, { cascade: true })
  inventory!: Inventory;


  @Column({ type: "uuid" })
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category!: Category;

  @OneToMany(() => ProductAttributeValue, (val) => val.product, { cascade: true })
  attributeValues!: ProductAttributeValue[];


  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable()
  tags!: Tag[];


}



