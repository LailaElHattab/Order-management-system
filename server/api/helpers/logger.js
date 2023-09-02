
const { createLogger, format, transports } = require('winston');

const { combine, timestamp, prettyPrint, colorize, errors,  } = format;


const logger = createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp(),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
});  


module.exports = logger;