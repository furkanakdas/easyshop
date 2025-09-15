import "reflect-metadata";
import { AppDataSource } from "./data-source";


export async function initializeAppDataSource(){
   await  AppDataSource.initialize();
}
