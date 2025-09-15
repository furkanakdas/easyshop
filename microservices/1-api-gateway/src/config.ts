import dotenv from "dotenv"

dotenv.config()



function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not defined`);
  return value;
}

export const config = {
  JWT_GATEWAY_PRIVATE_TOKEN_BASE64: getEnvVar("JWT_GATEWAY_PRIVATE_TOKEN_BASE64"),

  NODE_ENV: getEnvVar("NODE_ENV"),
  CLIENT_URL: getEnvVar("CLIENT_URL"),
  JWT_CLIENT_PUBLIC_TOKEN_BASE64: getEnvVar("JWT_CLIENT_PUBLIC_TOKEN_BASE64"),
  JWT_GATEWAY_PUBLIC_TOKEN_BASE64: getEnvVar("JWT_GATEWAY_PUBLIC_TOKEN_BASE64"),
  BASE_PATH: getEnvVar("BASE_PATH"),
  AUTH_BASE_URL: getEnvVar("AUTH_BASE_URL"),
  USER_BASE_URL: getEnvVar("USER_BASE_URL"),
  PRODUCT_BASE_URL: getEnvVar("PRODUCT_BASE_URL"),
  SEARCH_BASE_URL: getEnvVar("SEARCH_BASE_URL"),
  ORDER_BASE_URL: getEnvVar("ORDER_BASE_URL"),
  REVIEW_BASE_URL: getEnvVar("REVIEW_BASE_URL"),


  REDIS_CONNECTION_URL: getEnvVar("REDIS_CONNECTION_URL"),
  SCHEMA_REGISTRY_URL: getEnvVar("SCHEMA_REGISTRY_URL"),
  ELASTIC_SEARCH_URL: getEnvVar("ELASTIC_SEARCH_URL"),
  KAFKA_URL: getEnvVar("KAFKA_URL"),
  
  ELASTIC_USERNAME: getEnvVar("ELASTIC_USERNAME"),
  ELASTIC_PASSWORD: getEnvVar("ELASTIC_PASSWORD"),


};



