import { Column, Entity, PrimaryColumn, } from "typeorm";



export interface Address {
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    city: string,
    district: string,
    neighbourhood: string,
    detailedAddress: string,
    title: string,
}

@Entity()
export class BuyerProfile {

    @PrimaryColumn({ type: "uuid" })
    userId!: string;

    @Column({ type: "jsonb" })
    addresses!: Address[]




}

