import { Column, CreateDateColumn, Entity,  PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";

import { SellerGroup } from "../../server/controllers/order/create-payment-intent.controller";




@Entity()
export abstract class OutboxStripeTransfers {


    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    paymentIntentId!: string;

    @Column({ type: "jsonb" })
    sellerGroups!: SellerGroup[]

    @Column({default:false})
    processed!: boolean;

    @Column({type:"jsonb",default:[]})
    processedTransfers!: {sellerStripeAccountId:string}[];
    
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}






