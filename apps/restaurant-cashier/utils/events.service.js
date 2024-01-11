export const createEventEmitter = () => {
  const service = new EventTarget();
  return {
    on(...args) {
      service.addEventListener(...args);
    },
    off(...args) {
      service.removeEventListener(...args);
    },
    emit(event) {
      service.dispatchEvent(
        new CustomEvent(event.type, {
          detail: event.detail,
        }),
      );
    },
  };
};
