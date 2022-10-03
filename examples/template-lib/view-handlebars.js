import { compile } from 'handlebars';

const toHtml = compile(`
{{#if user}}
    <p>
        welcome <span>{{user.name}}</span>. It is <time>{{user.timestamp}}</time>.
        <button>Refresh</button>
    </p>
{{else}}
    <p>Loading...</p>
{{/if}}
`);

export const template = ({ userResource, fetchUser }) => ({
  html: toHtml({ user: userResource?.data }),
  onclick: fetchUser,
});

export const render = ({ template, el }) => {
  el.innerHTML = template.html;
  el.querySelector('button')?.addEventListener('click', template.onclick);
};
