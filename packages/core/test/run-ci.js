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
      browsers.map(async (browser) => {
        const page = await browser.newPage();
        return page.goto(`http://localhost:${PORT}/test/test-suite.html`);
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
