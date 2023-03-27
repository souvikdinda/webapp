import {createLogger, format, transports} from 'winston';
const {combine, timestamp, printf, colorize} = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${level}] [${timestamp}] ${message}`;
});

export const devLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(
            timestamp({format: 'YYYY-MM-DD HH:MM:SS.sss'}),
            myFormat,
            colorize()
        ),
        transports: [
            new transports.Console()
        ]
    });
};