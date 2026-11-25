import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const required = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASS"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing required database environment variables: ${missing.join(", ")}`);
}

const dialect = (process.env.DB_DIALECT || "postgres").toLowerCase();
if (!["postgres", "mysql"].includes(dialect)) {
  throw new Error("DB_DIALECT must be either 'postgres' or 'mysql' for the installed database drivers");
}

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;
if (port !== undefined && (!Number.isInteger(port) || port < 1 || port > 65535)) {
  throw new Error("DB_PORT must be a valid TCP port");
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    ...(port ? { port } : {}),
    dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
