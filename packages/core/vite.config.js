import { defineConfig } from 'vite';
import { ReadableStream } from 'node:stream/web';
import { createDiffReporter } from 'zora-reporters';

const createStream = ({ ws, client: _client }) => {
  let listener;
  return new ReadableStream({
    start(controller) {
      listener = (data, client) => {
        if (client === _client) {
          if (data.type === 'STREAM_ENDED') {
            controller.close();
            ws.off('zora', listener);
          } else {
            controller.enqueue(data);
          }
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
    const socketStreams = new WeakMap();

    server.ws.on('zora', async ({ type }, client) => {
      if (type === 'STREAM_STARTED') {
        const readableStream = createStream({ ws: server.ws, client });
        await report(readableStream);
      }
    });
  },
});

export default defineConfig({
  plugins: [plugin()],
});
