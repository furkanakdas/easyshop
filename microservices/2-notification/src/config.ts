import dotenv from "dotenv"

dotenv.config()



function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Environment variable ${key} is not defined`);
    return value;
  }
  
export const config = {
    ETHEREAL_USER: getEnvVar('ETHEREAL_USER'),
    ETHEREAL_PASSWORD: getEnvVar('ETHEREAL_PASSWORD'),
    EMAIL: getEnvVar('EMAIL'),
    PASSWORD: getEnvVar('PASSWORD'),

    SCHEMA_REGISTRY_URL: getEnvVar('SCHEMA_REGISTRY_URL'),
    ELASTIC_SEARCH_URL: getEnvVar('ELASTIC_SEARCH_URL'),
    KAFKA_URL: getEnvVar('KAFKA_URL'),

    ELASTIC_USERNAME: getEnvVar('ELASTIC_USERNAME'),
    ELASTIC_PASSWORD: getEnvVar('ELASTIC_PASSWORD'),

};



