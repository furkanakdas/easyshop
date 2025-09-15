import { Currency, } from "@faeasyshop/common";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";

import { Order } from "./order";
import { Product } from "./product";




@Entity()
export abstract class OrderProduct {


    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    orderId!: string;

    @ManyToOne(() => Order, (order) => order.orderProducts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "orderId" })
    order!: Order

    @Column({ type: "uuid" })
    productId!: string;


    @OneToOne(() => Product, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "productId" })
    product!: Product | null;


    @Column()
    productName!: string;

    @Column("numeric", { precision: 10, scale: 2 })
    price!: number;


    @Column({ type: "enum", enum: Currency })
    currency!: Currency;

    @Column({ type: "int" })
    quantity!: number

    @Column({ type: "uuid" })
    sellerId!: string;


    @Column({ type: "text", nullable: true })
    description!: string | null;
}


