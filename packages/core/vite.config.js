import { defineConfig } from 'vite';
import zoraDev from '@cofn/test-lib/vite';

export default defineConfig({
  plugins: [zoraDev()],
});
