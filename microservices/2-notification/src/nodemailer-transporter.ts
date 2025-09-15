import { config } from "./config";
import  nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: config.ETHEREAL_USER,
        pass: config.ETHEREAL_PASSWORD
    }
}); 