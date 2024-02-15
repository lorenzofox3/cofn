import { createElement, createTextNode } from '../utils/dom.js';
import { notificationsEvents } from '../utils/notifications.service.js';

const template = createElement('template');
template.innerHTML = `<style>
:host {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--_offest , 1em);
  font: inherit;
}

ui-icon{
  width: 1rem;
  height: 1rem;
}

p {
  margin: 0;
}

</style>
<ui-icon name="exclamation-octagon"></ui-icon><p><slot></slot></p>
`;

const connectToNotifications = (comp) =>
  function* ({ notificationsService, $signal, $host, ...rest }) {
    notificationsService.on(
      notificationsEvents.messagePublished,
      ({ detail }) => {
        if (detail.level === 'error') {
          $host.render({ notification: detail.payload });
        }
      },
      { signal: $signal },
    );

    yield* comp({
      $host,
      $signal,
      ...rest,
    });
  };
export const UIAlert = connectToNotifications(function* ({
  $host,
  $root,
  $signal: signal,
}) {
  const duration = $host.hasAttribute('duration')
    ? Number($host.getAttribute('duration'))
    : 4_000;
  const dismiss = () => $host.replaceChildren();

  $root.appendChild(template.content.cloneNode(true));
  $host.addEventListener('click', dismiss);
  $host.setAttribute('role', 'alert');

  while (true) {
    const { notification } = yield;
    if (!$host.hasChildNodes() && notification?.message) {
      $host.replaceChildren(createTextNode(notification.message));
      setTimeout(dismiss, duration, { signal });
    }
  }
});
