import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './src/index.js',
  plugins: [nodeResolve(), terser()],
  output: {
    file: './dist/cofn.js',
    format: 'es',
  },
};
