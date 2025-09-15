import Stripe from 'stripe';
import { config } from '../config';



export const stripe = new Stripe(config.STRIPE_TEST_SECRET_KEY);