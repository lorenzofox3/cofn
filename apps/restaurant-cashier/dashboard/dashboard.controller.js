import { http } from '../utils/http.js';
import { compose } from '../utils/functions.js';

export const withChartData = (comp) => {
  return function* ({ $host, $signal, ...rest }) {
    http($host.dataset.url, { signal: $signal }).then($host.render);
    yield* comp({ $host, $signal, ...rest });
  };
};
