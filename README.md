
# Nunjucks Code Highlight

[![Slack Status][slack-image]][slack-url]
[![NPM version][npm-image]][npm-url]
[![MIT License][license-image]][license-url]

An extension for [Nunjucks][nunjucks] that adds support for [Highlight.js][highlightjs] `code` blocks.  Built into [CrocodileJS][crocodile-url]!

<img src="https://cdn.rawgit.com/niftylettuce/nunjucks-highlight.js/master/media/screenshot.png" width="600" height="74" />


## Install

```bash
npm install --save nunjucks-highlight.js
```


## Usage

Register the extension with nunjucks:

```js
import NunjucksCodeHighlight from 'nunjucks-highlight.js';
import hljs from 'highlight.js';

const highlight = new NunjucksCodeHighlight(nunjucks, hljs);
const env = nunjucks.configure('views', {});
env.addExtension('NunjucksCodeHighlight', highlight);
```

Add code blocks to your templates:

```nunjucks
{% code %}
(function () {
  console.log('hello world');
}());
{% endcode %}
```

Output:

```html
(<span class="hljs-name">function</span>() {
  console.log(<span class="hljs-name">'hello</span> world')<span class="hljs-comment">;</span>
}())<span class="hljs-comment">;</span>
```


## License

[MIT][license]


[nunjucks]: https://github.com/mozilla/nunjucks
[highlightjs]: https://github.com/isagalaev/highlight.js/
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[npm-image]: https://img.shields.io/npm/v/nunjucks-highlight.js.svg
[npm-url]: https://npmjs.org/package/nunjucks-highlight.js
[crocodile-url]: https://crocodilejs.com
[slack-image]: http://slack.crocodilejs.com/badge.svg
[slack-url]: http://slack.crocodilejs.com
