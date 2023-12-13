import { createHarness } from 'zora/es';
import { createReporter } from './readable.js';

const { test, skip, only, report: _report } = createHarness();
const report = () => _report({ reporter: createReporter });

export { test, skip, only, report };
