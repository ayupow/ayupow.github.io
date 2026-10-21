#!/usr/bin/env node
// Render the existing Markdown/YAML using the same bundled parsers as before.
// No npm install is needed. Run: node scripts/sync-content.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const marked = require(path.join(root, 'static/js/marked.min.js'));
const yaml = require(path.join(root, 'static/js/js-yaml.min.js'));
marked.use({ mangle: false, headerIds: false });
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
let html = read('index.html');
for (const name of ['home', 'publications', 'ongoing', 'activities', 'awards']) {
    const start = `<!-- content:${name}:start -->`;
    const end = `<!-- content:${name}:end -->`;
    const rendered = marked.parse(read(`contents/${name}.md`));
    const contents = `${start}\n${rendered}\n${end}`;
    if (html.includes(start)) {
        const from = html.indexOf(start), to = html.indexOf(end, from);
        if (to < 0) throw new Error(`Missing end marker for ${name}`);
        html = html.slice(0, from) + contents + html.slice(to + end.length);
    } else {
        const empty = new RegExp(`(<div id="${name}-md"[^>]*>)(</div>)`);
        if (!empty.test(html)) throw new Error(`Missing empty section or markers: ${name}`);
        html = html.replace(empty, (_, open, close) => open + contents + close);
    }
}
const values = yaml.load(read('contents/config.yml'));
for (const [id, value] of Object.entries(values || {})) {
    const element = new RegExp(`(<([a-z][a-z0-9]*)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`, 'i');
    html = html.replace(element, (_, open, tag, close) => open + String(value) + close);
}
html = html.replace(/aria-busy="true"/g, 'aria-busy="false"');
// Static external links remain safe even before client-side enhancement.
html = html.replace(/<a\b([^>]*\bhref="https?:\/\/[^>]+)>/gi, (tag, attributes) => {
    if (!/\btarget=/.test(attributes)) attributes += ' target="_blank"';
    if (!/\brel=/.test(attributes)) attributes += ' rel="noopener noreferrer"';
    return '<a' + attributes + '>';
});
if (process.argv.includes('--check')) {
    if (html !== read('index.html')) {
        console.error('index.html is out of date. Run: node scripts/sync-content.cjs');
        process.exitCode = 1;
    } else console.log('index.html matches all content sources.');
} else {
    fs.writeFileSync(path.join(root, 'index.html'), html);
    console.log('Updated index.html from contents/*.md and config.yml.');
}
