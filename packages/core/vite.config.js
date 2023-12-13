import { defineConfig } from 'vite';
import { ReadableStream } from 'node:stream/web';
import { createDiffReporter } from 'zora-reporters';

const createStream = (ws) => {
  let listener;
  return new ReadableStream({
    start(controller) {
      listener = (data, client) => {
        if (data.type === 'STREAM_ENDED') {
          controller.close();
          ws.off('zora', listener);
        } else {
          controller.enqueue(data);
        }
      };

      ws.on('zora', listener);
    },
  });
};
const plugin = () => ({
  name: 'zora-dev',
  async configureServer(server) {
    const report = createDiffReporter();

    server.ws.on('zora', async ({ type }) => {
      if (type === 'STREAM_STARTED') {
        const readableStream = createStream(server.ws);
        await report(readableStream);
      }
    });
  },
});

export default defineConfig({
  plugins: [plugin()],
});
