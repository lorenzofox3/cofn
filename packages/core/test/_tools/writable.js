export const createSocketSink = (ws) =>
  new WritableStream({
    start() {
      ws.send('zora', { type: 'STREAM_STARTED' });
    },
    write(chunk) {
      ws.send('zora', chunk);
    },
    close() {
      ws.send('zora', { type: 'STREAM_ENDED' });
    },
  });

export { createHTMLReporter } from './html-reporter/repoter.js';
