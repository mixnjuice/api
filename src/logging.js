import { Container, format, transports } from 'winston';

const { combine, label, prettyPrint, printf, timestamp } = format;

const loggers = {};
const container = new Container();

const formatter = data =>
  `${data.timestamp} [${data.level}][${data.label}] ${data.message}`;

const createLogger = (category, categoryLabel) => {
  container.add(category, {
    transports: [
      new transports.Console({
        format: combine(
          label({ label: categoryLabel }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          prettyPrint(),
          printf(formatter)
        )
      })
    ]
  });

  return container.get(category);
};

export default (category, categoryLabel = category) => {
  if (!loggers[category]) {
    loggers[category] = createLogger(category, categoryLabel);
  }

  return loggers[category];
};
