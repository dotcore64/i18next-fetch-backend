# Introduction

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]
[![Dependency Status][dependency-status-badge]][dependency-status]
[![devDependency Status][dev-dependency-status-badge]][dev-dependency-status]

This is a simple i18next backend to be used in the browser. It will load resources from a backend server using the [fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) API.

# Getting started

This backend is most useful when `XMLHttpRequest` is not available, such as with Service Worker contexts. It is also useful when support for older browsers is not a concern, and newer APIs are a priority.
Source can be loaded via [npm](https://www.npmjs.com/package/i18next-fetch-backend).

```
# npm package
$ npm install --save i18next-fetch-backend
```

Wiring up:

```js
import i18next from 'i18next';
import Fetch from 'i18next-fetch-backend';

i18next
  .use(Fetch)
  .init(i18nextOptions);
```

- As with all modules you can either pass the constructor function (class) to the i18next.use or a concrete instance.

## Backend Options

```js
{
  // path where resources get loaded from, or a function
  // returning a path:
  // function(lngs, namespaces) { return customPath; }
  // the returned path will interpolate lng, ns if provided like giving a static path
  loadPath: '/locales/{{lng}}/{{ns}}.json',

  // parse data after it has been fetched
  // in example use https://www.npmjs.com/package/json5
  // here it removes the letter a from the json (bad idea)
  parse: function(data) { return data.replace(/a/g, ''); },

  // path to post missing resources
  addPath: 'locales/add/{{lng}}/{{ns}}',

  // define how to stringify the data when adding missing resources
  stringify: JSON.stringify,

  // your backend server supports multiloading
  // /locales/resources.json?lng=de+en&ns=ns1+ns2
  allowMultiLoading: false, // set loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}' to adapt to multiLoading

  multiSeparator: '+',

  // init option for fetch, for example
  requestOptions: {
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'default',
  },

  // define a custom fetch function
  fetch: function (url, options, callback) {},
}
```

Options can be passed in:

**preferred** - by setting options.backend in i18next.init:

```js
import i18next from 'i18next';
import Fetch from 'i18next-fetch-backend';

i18next
  .use(Fetch)
  .init({
    backend: options
  });
```

on construction:

```js
  import Fetch from 'i18next-fetch-backend';
  const fetch = new Fetch(null, options);
```

via calling init:

```js
  import Fetch from 'i18next-fetch-backend';
  const fetch = new Fetch();
  fetch.init(options);
```

## Service Worker example

```js
import i18next from 'i18next';
import Fetch from 'i18next-fetch-backend';

let t = null;

self.addEventListener('activate', (event) => {
  event.waitUntil(new Promise((resolve, reject) => {
    i18next
      .use(Fetch)
      .init({
        fallbackLng: ['ja', 'en', 'zh'],
        preload: ['ja', 'en', 'zh'],
        ns: 'translation',
        defaultNS: 'translation',
        keySeparator: false, // Allow usage of dots in keys
        nsSeparator: false,
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      }, (err, _t) => {
        if (err) {
          reject(err);
          return;
        }

        t = _t;
        resolve();
      });
  }));
});
```

[build-badge]: https://img.shields.io/travis/perrin4869/i18next-fetch-backend/master.svg?style=flat-square
[build]: https://travis-ci.org/perrin4869/i18next-fetch-backend

[npm-badge]: https://img.shields.io/npm/v/i18next-fetch-backend.svg?style=flat-square
[npm]: https://www.npmjs.org/package/i18next-fetch-backend

[coveralls-badge]: https://img.shields.io/coveralls/perrin4869/i18next-fetch-backend/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/perrin4869/i18next-fetch-backend

[dependency-status-badge]: https://david-dm.org/perrin4869/i18next-fetch-backend.svg?style=flat-square
[dependency-status]: https://david-dm.org/perrin4869/i18next-fetch-backend

[dev-dependency-status-badge]: https://david-dm.org/perrin4869/i18next-fetch-backend/dev-status.svg?style=flat-square
[dev-dependency-status]: https://david-dm.org/perrin4869/i18next-fetch-backend#info=devDependencies
