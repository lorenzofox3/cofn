import { withView } from '@cofn/view';
import { compose } from '../utils/functions.js';

// todo draw that somewhere else (a prop utils ? or part of the framework)
const reactiveProps = (props) => (comp) =>
  function* ({ $host, ...rest }) {
    let pendingUpdate = false;
    const properties = {};
    const { render } = $host;

    $host.render = (update = {}) =>
      render({
        ...properties,
        ...update,
      });

    Object.defineProperties(
      $host,
      Object.fromEntries(
        props.map((propName) => {
          properties[propName] = $host[propName];
          return [
            propName,
            {
              enumerable: true,
              get() {
                return properties[propName];
              },
              set(value) {
                properties[propName] = value;
                pendingUpdate = true;
                window.queueMicrotask(() => {
                  pendingUpdate = false;
                  $host.render();
                });
              },
            },
          ];
        }),
      ),
    );

    yield* comp({ $host, ...rest });
  };

const compositionPipeline = compose([reactiveProps(['product']), withView]);

export const ProductListItemComponent = compositionPipeline(
  ({ html }) =>
    ({ product = {} }) =>
      html`<article class="product-card">
        <header>
          <h2 class="text-ellipsis">${product.title}</h2>
          <button class="danger">
            <ui-icon name="x"></ui-icon> <span>remove</span>
          </button>
        </header>
        <div class="image-container"></div>
        <p class="description">${product.description}</p>
        <div>
          <a class="sku" href="/">#${product.sku}</a>
          <span class="price">
            <span>${product.price?.amountInCents}</span>
            <span>${product.price?.currency}</span>
          </span>
        </div>
      </article>`,
);
