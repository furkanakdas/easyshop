import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category";
import { AttributeDefinitionTypes } from "../enums/attribute-definition-types.enum";




@Entity()
export class AttributeDefinition {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string; // "Depolama", "Renk" gibi

  @Column({ type: 'enum', enum: AttributeDefinitionTypes })
  type!: AttributeDefinitionTypes;

  @Column({ type: 'jsonb', nullable: true })
  enumOptions!: string[] | null; // type enum ise değerleri tutar

  @Column({ type: "uuid" })
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.attributeDefinitions, {onDelete:"CASCADE"})
  @JoinColumn({ name: "categoryId" })
  category!: Category;

  @Column()
  required!:boolean;

  @Column({ type:"varchar",nullable:true })
  unit!:string | null
}
