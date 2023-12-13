export const createReporter = (messageStream) => {
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await messageStream.next();
      if (done) {
        controller.close();
        return;
      }
      return controller.enqueue(value);
    },
  });
};
