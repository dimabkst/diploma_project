import { createLogger, format, transports } from 'winston';
import { inspect } from 'util';
import { sanitizeAndCapitalizeFirstLetters } from './string';

const { NODE_ENV, npm_package_name } = process.env;

const production = NODE_ENV !== 'development';

const logger = createLogger({
  exitOnError: false,
  transports: [
    new transports.Console({
      format: format.combine(
        format.label({ label: npm_package_name, message: false }),
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        format.printf((data) => {
          // eslint-disable-next-line prefer-const
          let { label, timestamp, level, message } = data;

          const header = `[${label}] ${sanitizeAndCapitalizeFirstLetters(level)}  ${timestamp}: `;

          if (typeof message === 'object') {
            message = inspect(message, { depth: null, colors: true });
          }

          return header + message;
        }),
        production ? format.uncolorize() : format.colorize()
      ),
    }),
  ],
});

logger.error = (data) => {
  if (data instanceof Error) {
    return logger.log({ level: 'error', message: data.stack || data.toString() });
  } else {
    return logger.log({ level: 'error', message: data });
  }
};

export default logger;
