import { BadRequestError, CurrentUser } from "@faeasyshop/common";
import { cartProductRepository, cartRepository, orderRepository, productRepository } from "../../orm/repositories";
import { SystemConflictError } from "../errors/system-conflict.error";
import { Cart } from "../../orm/entity/cart";
import { In } from "typeorm";






export async function removeProductFromCart(cartId:string,cartProductId: string) {

    const cart = await cartRepository.findOne({ where: { id: cartId } });

    if (!cart) {
        throw new BadRequestError({ message: "cart does not exist" });
    }

    const deleteCartProduct = await cartProductRepository.findOne({
        where: {
            cartId: cart.id,
            id: cartProductId
        }
    });

    if (!deleteCartProduct) {
        throw new BadRequestError({ message: "Product you want to remove from cart does not exist on cart" })
    }

    await cartProductRepository.remove(deleteCartProduct)
    console.log("cart product with  name ",deleteCartProduct.productName," deleted");
    

}



export async function compareProductsWithCartProducts(cart: Cart) {



    const cartProducts = await cartProductRepository.find({ where: { cartId: cart.id } });
    if (cartProducts.length == 0) {
        throw new BadRequestError({ message: "You must select product first" })
    }

    const productIds = cartProducts.map(cartProduct => cartProduct.productId);

    const products = await productRepository.find({ where: { id: In(productIds) } });

    for (const cartProduct of cartProducts) {

        const product = products.find(p => p.id == cartProduct.productId);

        if (!product) {
            throw new SystemConflictError({
                message: `${cartProduct.productName} with id ${cartProduct.productId}
                is removed from system after you add to the cart`
            })
        }

        if (product.price != cartProduct.price) {

            await removeProductFromCart(cart.id, cartProduct.id);


            throw new SystemConflictError({
                message: `price of ${cartProduct.productName} has changed.This product removed from cart`
            })
        }

        //Ürün isim değişikliği için de benzer işlem yapılabilir

    }


    return cartProducts;
}



