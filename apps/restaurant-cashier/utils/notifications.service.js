import { createEventEmitter } from './events.service.js';

export const notificationsEvents = {
  messagePublished: 'message-published',
};

const levelList = ['info', 'warn', 'error'];
export const createNotificationsService = () => {
  const emitter = createEventEmitter();
  const publish = ({ payload, level }) =>
    emitter.emit({
      type: notificationsEvents.messagePublished,
      detail: {
        level,
        payload,
      },
    });

  const createPublisher = (level) => (payload) =>
    publish({
      payload,
      level,
    });

  return Object.assign(
    emitter,
    Object.fromEntries(
      levelList.map((level) => [level, createPublisher(level)]),
    ),
  );
};

export const notificationsService = createNotificationsService();
