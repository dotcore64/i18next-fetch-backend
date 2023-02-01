import { createServer } from 'node:http';
import { join } from 'node:path';

import { dirname } from 'dirname-filename-esm';
import finalhandler from 'finalhandler';
import serveStatic from 'serve-static';
import { createInstance } from 'i18next';
import { expect } from 'chai';

// https://github.com/import-js/eslint-plugin-import/issues/1649
// eslint-disable-next-line import/no-unresolved
import FetchBackend from 'i18next-fetch-backend';

const serve = serveStatic(join(dirname(import.meta), 'locales'));
const server = createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

describe('i18next-fetch-backend', () => {
  before(() => {
    server.listen(3000);
  });

  after(() => {
    server.close();
  });

  it('should load english translation namespace', (cb) => {
    const i18next = createInstance();

    i18next.use(FetchBackend).init(
      {
        fallbackLng: 'en',
        ns: 'translation',
        backend: {
          loadPath: 'http://localhost:3000/{{lng}}/{{ns}}.json',
        },
      },
      () => {
        const t = i18next.getFixedT('en', 'translation');
        expect(t('mykey')).to.equal('mytranslation');

        cb();
      },
    );
  });

  it('should fail to load non existent language translation', (cb) => {
    const i18next = createInstance();

    i18next.use(FetchBackend).init(
      {
        fallbackLng: 'de',
        ns: 'translation',
        backend: {
          loadPath: 'http://localhost:3000/{{lng}}/{{ns}}.json',
        },
      },
      (err) => {
        expect(err).to.deep.equal([
          'failed loading http://localhost:3000/de/translation.json',
        ]);

        cb();
      },
    );
  });

  it('should fail to load non existent namespace translation', (cb) => {
    const i18next = createInstance();

    i18next.use(FetchBackend).init(
      {
        fallbackLng: 'en',
        ns: 'mynamespace',
        backend: {
          loadPath: 'http://localhost:3000/{{lng}}/{{ns}}.json',
        },
      },
      (err) => {
        expect(err).to.deep.equal([
          'failed loading http://localhost:3000/en/mynamespace.json',
        ]);
        cb();
      },
    );
  });

  it("should fail if the requested domain doesn't exist", (cb) => {
    const i18next = createInstance();

    i18next.use(FetchBackend).init(
      {
        fallbackLng: 'en',
        ns: 'mynamespace',
        backend: {
          loadPath: 'http://bad-localhost:3000/{{lng}}/{{ns}}.json',
        },
      },
      (err) => {
        expect(err).to.deep.equal([
          'failed loading http://bad-localhost:3000/en/mynamespace.json',
        ]);

        cb();
      },
    );
  });

  it('should call the callback with an error if the fetch fails.', (cb) => {
    const i18next = createInstance();

    i18next
      .use(FetchBackend)
      .init({
        fallbackLng: 'en',
        ns: 'translation',
        backend: {
          loadPath: 'http://localhost:3000/{{lng}}/{{ns}}.json',
          // mock fetch with a function that returns a rejection of cancelled request
          fetch: () => Promise.reject(new TypeError('cancelled')),
        },
      }, (err) => {
        expect(err).to.deep.equal(['failed loading http://localhost:3000/en/translation.json']);

        cb();
      });
  });
});
