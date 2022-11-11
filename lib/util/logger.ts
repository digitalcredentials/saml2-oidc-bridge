import winston, { format } from "winston";

const logger = winston.createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf((msg) => {
      return `${msg.timestamp} [${msg.level}] ${msg.message}`;
    })
  ),
  transports: [new winston.transports.Console({ level: "http" })],
});

export default logger;
