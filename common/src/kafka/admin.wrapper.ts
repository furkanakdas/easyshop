import {  Admin, AdminConfig, Kafka,   } from "kafkajs";


export  class AdminWrapper {


  private _admin?: Admin ;

  get admin()  {
    if (!this._admin) {
      throw new Error('Cannot access Kafka admin client before connecting');
    }
    return this._admin;
  }

  set admin(admin:Admin){
    this._admin = admin;
  }

  constructor( ) {}

  initiate(kafka:Kafka,adminConfig?:AdminConfig){

    this.admin = kafka.admin(adminConfig);
  }





}

export const adminWrapper = new AdminWrapper();

