import { Currency, OrderStatus } from "@faeasyshop/common";
import { Column,  Entity, JoinColumn,  ManyToOne, PrimaryColumn,  } from "typeorm";
import { Order } from "./order";

@Entity()
export abstract class OrderProduct {


    @PrimaryColumn({type:"uuid"})
    id!: string;

    @Column({ type: "uuid" })
    orderId!: string;

    @ManyToOne(() => Order, (order) => order.orderProducts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "orderId" })
    order!: Order

    @Column()
    productId!: string;

    @Column({type:"uuid"})
    sellerId!:string

}






