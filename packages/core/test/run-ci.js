import { createServer } from 'vite';
import { firefox, chromium, webkit } from 'playwright';

const PORT = 3001;

(async () => {
  let server,
    browsers = [];
  const browserList = [firefox, chromium, webkit];
  try {
    server = await createServer({
      server: {
        port: PORT,
      },
    });
    await server.listen();

    browsers = await Promise.all(
      browserList.map((browserApp) => {
        return browserApp.launch({ headless: true });
      }),
    );

    await Promise.all(
      browsers.map((browser) => {
        console.log(browser._name);
        return new Promise((resolve, reject) => {
          browser
            .newPage()
            .then((page) => {
              page.on('websocket', (webSocket) => {
                webSocket.on('framesent', ({ payload }) => {
                  const asJson = JSON.parse(payload);
                  if (asJson?.data?.type === 'STREAM_ENDED') {
                    resolve();
                  }
                });
              });

              return page.goto(`http://localhost:${PORT}/test/test-suite.html`);
            })
            .catch(reject);
        });
      }),
    );
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await Promise.all(browsers.map((browser) => browser.close()));
    if (server) {
      await server.close();
    }
  }
})();
