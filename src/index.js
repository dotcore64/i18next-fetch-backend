import XHRBackend from 'i18next-xhr-backend';

function ajax(url, { init = {} } = {}, cb) {
  fetch(url, init)
    .then((res) => {
      if (res.ok) {
        return res.text()
          .then((json) => {
            cb(json, res);
          });
      }

      return cb('', res);
    });
}

export default class FetchBackend extends XHRBackend {
  constructor(services, opts = {}) {
    const options = Object.assign({ ajax }, opts);

    super(services, options);
  }
}
