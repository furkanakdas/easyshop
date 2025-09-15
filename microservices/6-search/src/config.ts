import dotenv from "dotenv"

dotenv.config()



function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Environment variable ${key} is not defined`);
    return value;
  }
  
export const config = {
  NODE_ENV:getEnvVar("NODE_ENV"),

  JWT_CLIENT_PUBLIC_TOKEN:Buffer.from(getEnvVar("JWT_CLIENT_PUBLIC_TOKEN_BASE64"), "base64").toString("utf-8"),
  JWT_GATEWAY_PUBLIC_TOKEN:Buffer.from(getEnvVar("JWT_GATEWAY_PUBLIC_TOKEN_BASE64"), "base64").toString("utf-8"),

  CLIENT_URL:getEnvVar("CLIENT_URL"),
  API_GATEWAY_BASE_URL:getEnvVar("API_GATEWAY_BASE_URL"),
  AUTH_BASE_URL:getEnvVar("AUTH_BASE_URL"),



  SCHEMA_REGISTRY_URL:getEnvVar("SCHEMA_REGISTRY_URL"),
  ELASTIC_SEARCH_URL:getEnvVar("ELASTIC_SEARCH_URL"),
  KAFKA_URL:getEnvVar("KAFKA_URL"),
  ELASTIC_USERNAME:getEnvVar("ELASTIC_USERNAME"),
  ELASTIC_PASSWORD:getEnvVar("ELASTIC_PASSWORD"),



};

