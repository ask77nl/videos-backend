import winston from 'winston';

const logger = new (winston.Logger)();

logger.add(winston.transports.Console, {
  name: 'debug-console',
  level: 'debug',
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false,
});

export default logger;
