import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AttributeDefinition } from "./attribute-definition";
import { Product } from "./product";



@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({unique:true})
  name!: string;


  @Column({ type: "uuid", nullable: true })
  parentId!: string | null;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent!: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  @OneToMany(() => AttributeDefinition, (attrDef) => attrDef.category)
  attributeDefinitions!: AttributeDefinition[];

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

}