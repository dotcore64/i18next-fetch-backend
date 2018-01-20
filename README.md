# Introduction

[![Greenkeeper badge](https://badges.greenkeeper.io/perrin4869/i18next-fetch-backend.svg?style=flat-square)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/perrin4869/i18next-fetch-backend/master.svg?style=flat-square)](https://travis-ci.org/perrin4869/i18next-fetch-backend)
[![npm version](https://img.shields.io/npm/v/i18next-fetch-backend.svg?style=flat-square)](https://www.npmjs.com/package/i18next-fetch-backend)
[![David](https://img.shields.io/david/perrin4869/i18next-fetch-backend.svg?style=flat-square)](https://david-dm.org/perrin4869/i18next-fetch-backend)

This is a simple i18next backend to be used in the browser. It will load resources from a backend server using the [fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) API.

# Getting started

This backend is most useful when `XMLHttpRequest` is not available, such as with Service Worker contexts. It is also useful when support for older browsers is not a concern, and newer APIs are a priority.
Source can be loaded via [npm](https://www.npmjs.com/package/i18next-fetch-backend).

```
# npm package
$ npm install --save i18next-fetch-backend

# bower
$ bower install --save i18next-fetch-backend
```

Wiring up:

```js
import i18next from 'i18next';
import Fetch from 'i18next-fetch-backend';

i18next
  .use(fetch)
  .init(i18nextOptions);
```

- As with all modules you can either pass the constructor function (class) to the i18next.use or a concrete instance.

## Backend Options

The same options supported by [i18next-xhr-backend](https://github.com/i18next/i18next-xhr-backend) are supported here, except for those used by `XMLHttpRequest`. Instead, you can provide an `init` option that will be provided to `fetch`, documented [here](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters).

```js
{
  // path where resources get loaded from, or a function
  // returning a path:
  // function(lngs, namespaces) { return customPath; }
  // the returned path will interpolate lng, ns if provided like giving a static path
  loadPath: '/locales/{{lng}}/{{ns}}.json',

  // path to post missing resources
  addPath: 'locales/add/{{lng}}/{{ns}}',

  // parse data after it has been fetched
  // in example use https://www.npmjs.com/package/json5
  // here it removes the letter a from the json (bad idea)
  parse: function(data) { return data.replace(/a/g, ''); },

  // init option for fetch, for example
  init: {
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'default',
  },

  // define a custom fetch function
  ajax: function (url, options, callback) {},
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

# IE \<= 10 Support

Because of an [issue](https://github.com/babel/babel/issues/116) in how IE used to handle inheritance of static properties, the following is necessary in order to support the old browsers:

```js
import i18next from 'i18next';
import FetchBackend from 'i18next-fetch-backend';

FetchBackend.type = 'backend';

i18next
  .use(FetchBackend)
  .init(/* ... */);
```
