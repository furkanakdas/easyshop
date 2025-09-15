import {  ConsumerManager, Topics, VerifyEmailEvent, VerifyOtpEvent, loggerWrapper, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import  nodemailer from 'nodemailer';
import ejs from 'ejs';
import { config } from "../../config";
import path from'path';
import { transporter } from "../../nodemailer-transporter";



export class VerifyOtpConsumer extends ConsumerManager<VerifyOtpEvent> {



    topic: Topics.VERIFY_OTP = Topics.VERIFY_OTP;

    async processEvent(value: { receiverEmail: string; verifyLink: string; }, event: KafkaMessage) {

        console.log("consumed value:",value);

    
          const html = await ejs.renderFile(
            path.join(__dirname, '..',"..","templates", 'verify-otp.ejs'),
            { ...value }
          );

        
          await transporter.sendMail({
            from: `"EasyShop" <${config.EMAIL}>`,
            to:value.receiverEmail,
            subject: 'Please verify your otp',
            html
          });

          loggerWrapper.info("otp send to",value.receiverEmail)
          
    } 



}




