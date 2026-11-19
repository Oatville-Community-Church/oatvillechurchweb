/**
 * Block templating for the church HTML pages.
 *
 *   {{#each list.path}} ... {{/each}}      repeat for each array item (nestable)
 *   {{#if path}} ... {{else}} ... {{/if}}  render when the value is non-empty
 *   {{#unless path}} ... {{/unless}}       render when the value is empty
 *
 * Inside an {{#each}} block:
 *   {{this}}  {{this.field}}               the current item / one of its fields
 *   {{plain this.field}}                   same, with curly quotes made straight (for JSON-LD copies)
 *   {{@index}}                             0-based position
 *   {{#if @first}} / {{#if @last}} / {{#unless @last}}   position tests (e.g. commas in JSON-LD)
 *   {{#each this.items}}                   loop over a list inside the current item
 *
 * Paths that don't start with "this." are looked up from the site data root.
 * Items with "draft: true" render only in local dev so unreviewed content never ships.
 * Placeholders that aren't handled here are left for the global {{placeholder}} pass.
 */

function getValue(obj, keyPath) {
  return keyPath.trim().split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

const TOKEN_RE = /\{\{(#each|#if|#unless) ([^}\s]+)\}\}|\{\{(\/each|\/if|\/unless|else)\}\}/g;

function parse(source) {
  const root = { type: 'root', body: [] };
  const stack = [{ node: root, target: root.body }];
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  const top = () => stack[stack.length - 1];
  const text = (s) => { if (s) top().target.push({ type: 'text', value: s }); };

  while ((m = TOKEN_RE.exec(source))) {
    text(source.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1]) {
      const node = { type: m[1].slice(1), path: m[2], body: [], otherwise: [], start: m.index };
      top().target.push(node);
      stack.push({ node, target: node.body });
    } else if (m[3] === 'else') {
      const t = top();
      if (t.node === root || t.node.type === 'each') throw new Error('{{else}} is only allowed inside {{#if}} or {{#unless}}');
      t.target = t.node.otherwise;
    } else {
      const t = stack.pop();
      if (t.node === root || t.node.type !== m[3].slice(1)) {
        throw new Error(`Unexpected {{${m[3]}}} - blocks must close in the order they were opened`);
      }
      t.node.raw = source.slice(t.node.start, last);
    }
  }
  text(source.slice(last));
  if (stack.length > 1) throw new Error(`Block {{#${stack[stack.length - 1].node.type} ${stack[stack.length - 1].node.path}}} is never closed`);
  return root.body;
}

function resolve(path, scope, data) {
  if (path === '@first') return scope.first === true;
  if (path === '@last') return scope.last === true;
  if (path === '@index') return scope.index;
  if (path === 'this') return scope.item;
  if (path.startsWith('this.')) return scope.item === undefined ? undefined : getValue(scope.item, path.slice(5));
  return getValue(data, path);
}

function truthy(v) {
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'string') return v.trim() !== '';
  return Boolean(v);
}

const plain = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

function renderText(value, scope) {
  if (scope.item === undefined) return value;
  return value.replace(/\{\{(plain )?(this(?:\.[\w.-]+)?|@index)\}\}/g, (m, filter, p) => {
    const v = resolve(p, scope, null);
    const s = v !== undefined && v !== null ? String(v) : '';
    return filter ? plain(s) : s;
  });
}

function render(nodes, scope, data, isLocal) {
  let out = '';
  for (const node of nodes) {
    if (node.type === 'text') {
      out += renderText(node.value, scope);
    } else if (node.type === 'each') {
      const list = resolve(node.path, scope, data);
      if (!Array.isArray(list)) { out += node.raw; continue; }
      const items = list.filter(item => isLocal || !(item && item.draft));
      items.forEach((item, index) => {
        out += render(node.body, { item, index, first: index === 0, last: index === items.length - 1 }, data, isLocal);
      });
    } else {
      const show = truthy(resolve(node.path, scope, data)) === (node.type === 'if');
      out += render(show ? node.body : node.otherwise, scope, data, isLocal);
    }
  }
  return out;
}

function expandBlocks(html, data, isLocal) {
  if (!/\{\{(#each|#if|#unless) /.test(html)) return html;
  return render(parse(html), {}, data, isLocal);
}

module.exports = { expandBlocks, parse, getValue };
