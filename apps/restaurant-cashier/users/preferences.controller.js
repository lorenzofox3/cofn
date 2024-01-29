import { preferencesEvents } from './preferences.service.js';

export const createPreferencesController =
  ({ preferencesService }) =>
  (comp) =>
    function* ({ $signal, $host, ...rest }) {
      const { render } = $host;
      $host.render = (args = {}) => {
        render({
          ...args,
          ...preferencesService.getState(),
        });
      };

      preferencesService.on(
        preferencesEvents.PREFERENCES_CHANGED,
        () => {
          $host.render();
        },
        {
          signal: $signal,
        },
      );

      yield* comp({
        $signal,
        $host,
        preferencesService,
        ...rest,
      });
    };
