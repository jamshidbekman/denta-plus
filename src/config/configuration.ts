export const configuration = () => {
  return {
    PORT: process.env.PORT,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    JWT_KEY: process.env.JWT_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  };
};
