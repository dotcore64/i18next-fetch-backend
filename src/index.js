const defaults = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  addPath: '/locales/add/{{lng}}/{{ns}}',
  multiSeparator: '+',
  allowMultiLoading: false,
  parse: JSON.parse,
  stringify: JSON.stringify,
  fetch,
  requestOptions: {},
};

const arrify = val => (Array.isArray(val) ? val : [val]);
const normalize = (funcOrVal, ...args) => (typeof funcOrVal === 'function' ? funcOrVal(...args) : funcOrVal);

class BackendError extends Error {
  retry = null;

  constructor(message, retry = false) {
    super(message);

    this.retry = retry;
  }
}

class Backend {
  constructor(services, options) {
    this.init(services, options);
  }

  type = 'backend'

  static type = 'backend'

  init(services, options = {}) {
    this.services = services;

    this.options = {
      ...defaults,
      ...this.options,
      ...options,
    };
  }

  getLoadPath(languages, namespaces) {
    return normalize(this.options.loadPath, languages, namespaces);
  }

  read(language, namespace, callback) {
    const loadPath = this.getLoadPath(language, namespace);
    const url = this.services.interpolator.interpolate(loadPath, { lng: language, ns: namespace });

    this.loadUrl(url, callback);
  }

  readMulti(languages, namespaces, callback) {
    const loadPath = this.getLoadPath(languages, namespaces);
    const { multiSeparator } = this.options;

    const url = this.services.interpolator.interpolate(loadPath, {
      lng: languages.join(multiSeparator),
      ns: namespaces.join(multiSeparator),
    });

    this.loadUrl(url, callback);
  }

  loadUrl(url, callback) {
    const { fetch, requestOptions, parse } = this.options;

    fetch(url, requestOptions)
      .then((response) => {
        const { ok, status } = response;

        if (!ok) {
          const retry = status >= 500 && status < 600; // don't retry for 4xx codes

          throw new BackendError(`failed loading ${url}`, retry);
        }

        return response.text();
      }, () => {
        throw new BackendError(`failed loading ${url}`);
      })
      .then((data) => {
        try {
          return callback(null, parse(data, url));
        } catch (e) {
          throw new BackendError(`failed parsing ${url} to json`, false);
        }
      })
      .catch((e) => {
        if (e instanceof BackendError) {
          callback(e.message, e.retry);
        }
      });
  }

  create(languages, namespace, key, fallbackValue) {
    const payload = {
      [key]: fallbackValue || '',
    };

    arrify(languages).forEach((lng) => {
      const {
        addPath,
        requestOptions,
        fetch,
        stringify,
      } = this.options;

      const url = this.services.interpolator.interpolate(addPath, { lng, ns: namespace });

      try {
        fetch(url, {
          method: 'POST',
          body: stringify(payload),
          ...requestOptions,
        });
      } catch (ex) {
        console.error(ex);
      }
    });
  }
}

export default Backend;
