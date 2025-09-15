import { EntityManager } from "typeorm";
import { OrderProduct } from "../../orm/entity/order-product";
import { Product } from "../../orm/entity/product";
import { SellerGroup } from "../controllers/order/create-payment-intent.controller";
import { SystemConflictError } from "../errors/system-conflict.error";





export function createSellerGroups(orderProducts: OrderProduct[]) {


    const groups: Record<string, SellerGroup> = {};


    for (const orderProduct of orderProducts) {

        if (!orderProduct.product) {
            throw new SystemConflictError({ message: `${orderProduct.productName} does not exist on system` })
        }


        const group = groups[orderProduct.product.seller.userId] || {
            sellerStripeAccountId: orderProduct.product.seller.stripeAccountId,
            currency: orderProduct.currency,
            orderProducts: [],
            amount: 0
        };


        group.orderProducts.push({
            stripePriceId: orderProduct.product.stripePriceId,
            stripeProductId: orderProduct.product.stripeProductId,
            quantity: orderProduct.quantity,
            price: orderProduct.price
        });



        group.amount += orderProduct.price * orderProduct.quantity * 100;


        groups[orderProduct.product.seller.userId] = group;



    }

    const grouped = Object.values(groups);

    return grouped;

}


export function compareProductsWithOrderProducts(products: Product[], orderProducts: SellerGroup["orderProducts"]) {

    for (const orderProduct of orderProducts) {

        const product = products.find(p => p.stripeProductId == orderProduct.stripeProductId);

        if (!product) {
            throw new Error("This product removed from system")
        }

        if (product.price != orderProduct.price) {
            throw new SystemConflictError({ message: `product's price named ${product.name} has changed` })
        }

    }

}


export async function reservateProduct(products: Product[], orderProducts: SellerGroup["orderProducts"], manager: EntityManager) {

    for (const orderProduct of orderProducts) {

        const product = products.find(p => p.stripeProductId == orderProduct.stripeProductId);

        if (!product) {
            throw new Error("This product removed from system")
        }

        if (orderProduct.quantity + product.reservation.reserved > product.quantity) {
            throw new Error(`inventory is insufficiant for ${product.name}`)
        }

        product.reservation.reserved += orderProduct.quantity;

        await manager.save(product);
    }

}


export async function reduceQuantityAndReservation(products: Product[], orderProducts: SellerGroup["orderProducts"], manager: EntityManager) {

    for (const orderProduct of orderProducts) {

        const product = products.find(p => p.stripeProductId == orderProduct.stripeProductId);

        if (!product) {
            continue;
        }

        product.reservation.reserved -= orderProduct.quantity;
        product.quantity -= orderProduct.quantity;

        await manager.save(product);
    }

    console.log("quantity and reservations decremented");

}