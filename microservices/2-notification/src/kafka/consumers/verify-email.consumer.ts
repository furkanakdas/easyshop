import {  ConsumerManager, Topics, VerifyEmailEvent, loggerWrapper, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import  nodemailer from 'nodemailer';
import ejs from 'ejs';
import { config } from "../../config";
import path from'path';
import { transporter } from "../../nodemailer-transporter";



export class VerifyEmailConsumer extends ConsumerManager<VerifyEmailEvent> {



    topic: Topics.VERIFY_EMAIL = Topics.VERIFY_EMAIL;

    async processEvent(value: { receiverEmail: string; verifyLink: string; }, event: KafkaMessage) {

        console.log("consumed value:",value);

    
          const html = await ejs.renderFile(
            path.join(__dirname, '..',"..","templates", 'verify-email.ejs'),
            { ...value }
          );

        
          await transporter.sendMail({
            from: `"EasyShop" <${config.EMAIL}>`,
            to:value.receiverEmail,
            subject: 'Please verify your email',
            html
          });
          
          loggerWrapper.info("v send to",value.receiverEmail)
          
          
    } 



}




