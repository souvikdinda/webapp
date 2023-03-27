import {createLogger, format, transports} from 'winston';
const {combine, timestamp, json} = format;

export const productionLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(
          timestamp({format: 'YYYY-MM-DD HH:MM:SS.sss'}),
          json(),
        ),
        transports: [
          new transports.File({filename: './logs/webapp.log'}),
        ],
        exitOnError: false,
        handleExceptions: true,
    });
};