import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product";
import { AttributeDefinition } from "./attribute-definition";


@Entity()
export class ProductAttributeValue {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.attributeValues, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Product;



  @Column({ type: "uuid" })
  attributeDefinitionId!: string;

  @ManyToOne(() => AttributeDefinition)
  @JoinColumn({ name: "attributeDefinitionId" })
  attributeDefinition!: AttributeDefinition;


  @Column('text')
  value!: string; // string olarak saklanır, UI veya servis cast eder
}