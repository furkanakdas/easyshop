import {  ConsumerManager, ForgotPasswordEvent, Topics, VerifyEmailEvent, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import  nodemailer from 'nodemailer';
import ejs from 'ejs';
import { config } from "../../config";
import path from'path';
import { transporter } from "../../nodemailer-transporter";



export class ForgotPasswordConsumer extends ConsumerManager<ForgotPasswordEvent> {


    topic: Topics.FORGOT_PASSWORD = Topics.FORGOT_PASSWORD;

    async processEvent(value: { receiverEmail: string; resetLink: string; }, event: KafkaMessage) {

        console.log("consumed value:",value);

    
          const html = await ejs.renderFile(
            path.join(__dirname, '..',"..","templates", 'forgot-password.ejs'),
            { ...value }
          );
        
          await transporter.sendMail({
            from: `"EasyShop" <${config.EMAIL}>`,
            to:value.receiverEmail,
            subject: 'Reset Password',
            html
          });
          console.log("email send to",value.receiverEmail);
          
    }


}




