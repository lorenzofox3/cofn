import { createHarness } from 'zora/es';
const createReporter = (messageStream) => {
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

const { test, skip, only, report: _report } = createHarness();
const report = () => _report({ reporter: createReporter });

export { test, skip, only, report };
