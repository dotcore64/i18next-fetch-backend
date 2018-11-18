const defaults = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  addPath: '/locales/add/{{lng}}/{{ns}}',
  multiSeparator: '+',
  allowMultiLoading: false,
  parse: JSON.parse,
  fetch,
  requestOptions: {},
};

const arrify = val => (Array.isArray(val) ? val : [val]);

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
    return typeof this.options.loadPath === 'function' ? this.options.loadPath(languages, namespaces) : this.options.loadPath;
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
          let retry = false; // status codes 4xx
          if (status >= 500 && status < 600) retry = true;

          return callback(`failed loading ${url}`, retry);
        }

        return response.text();
      })
      .then((data) => {
        try {
          return callback(null, parse(data, url));
        } catch (e) {
          return callback(`failed parsing ${url} to json`, false);
        }
      });
  }

  create(languages, namespace, key, fallbackValue) {
    const payload = {
      [key]: fallbackValue || '',
    };

    arrify(languages).forEach((lng) => {
      const { addPath, requestOptions } = this.options;
      const url = this.services.interpolator.interpolate(addPath, { lng, ns: namespace });

      try {
        this.options.fetch(url, {
          method: 'POST',
          body: JSON.stringify(payload),
          ...requestOptions,
        });
      } catch (ex) {
        console.error(ex);
      }
    });
  }
}

export default Backend;
