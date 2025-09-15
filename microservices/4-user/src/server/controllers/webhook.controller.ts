import { Request, Response } from "express";

import { prisma } from "../clients/database.client";

import { GenericError, loggerWrapper, producerWrapper, Topics, UserRole } from "@faeasyshop/common";
import { } from "../schemas/create-seller-profile.schema";
import { stripe } from "../clients/stripe.client";
import { config } from "../../config";
import crypto from 'crypto'
import Stripe from "stripe";
import { UserRoleUpdatedProducer } from "../../kafka/producers/user-role-updated.producer";
import { createSellerProfileEventValue } from "../event-value-creaters/seller-profile.event-creater";
import { SellerProfileUpdatedProducer } from "../../kafka/producers/seller-profile-updated.producer";

export async function webhookController(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = config.STRIPE_WH_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err);
    throw new GenericError({ httpStatus: 400, message: err.message });
  }

  console.log("Arrived web hook event", event);

  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account;

    if (account.charges_enabled && account.details_submitted) {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { stripeAccountId: account.id },
      });

      if (!sellerProfile) {
        throw new Error("No seller Profile found");
      }

      const user = await prisma.user.findUnique({ where: { id: sellerProfile.userId } });
      if (!user) {
        throw new Error("No user found");
      }


      if (sellerProfile.status !== 'APPROVED') {

        const updatedSellerProfile = await prisma.sellerProfile.update({
          where: { stripeAccountId: account.id },
          data: { status: 'APPROVED' },
        });


        const userRoleUpdatedProducer = new UserRoleUpdatedProducer();
        await userRoleUpdatedProducer.send({ role: UserRole.SELLER, id: user.id })


        const sellerProfileUpdatedProducer = new SellerProfileUpdatedProducer();
        const eventValue = await createSellerProfileEventValue(undefined,updatedSellerProfile.userId);
        await sellerProfileUpdatedProducer.send(eventValue);


        const userRoleUpdatedEventOutbox = await prisma.outboxEvent.create({
          data: {
            aggregateId: updatedSellerProfile.userId,
            topic: Topics.USER_ROLE_UPDATED,
            value: { role: UserRole.SELLER, id: user.id },
            processed:true
          }
        })

        const sellerProfileUpdatedEventOutbox = await prisma.outboxEvent.create({
          data: {
            aggregateId: updatedSellerProfile.userId,
            topic: Topics.SELLER_PROFILE_UPDATED,
            value: eventValue,
            processed:true

          }
        })


        loggerWrapper.info(`Seller hesabi aktif oldu: ${account.id}`);
      } else {
        loggerWrapper.info(`Seller zaten aktifti veya bulunamadi: ${account.id}`);
      }
    }
  }

  res.status(200).json({ received: true });
}


