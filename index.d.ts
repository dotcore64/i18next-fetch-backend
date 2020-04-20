import { BackendModule, Services, ReadCallback } from 'i18next';

export interface FetchOptions {
  loadPath: string,
  addPath: string,
  multiSeparator: string,
  allowMultiLoading: boolean,
  fetch: typeof fetch,
  parse: typeof JSON.parse,
  stringify: typeof JSON.stringify,
  requestOptions: any,
}

export default class I18nextFetchBackend implements BackendModule<FetchOptions> {
  type: 'backend';
  init(services: Services, backendOptions: FetchOptions, i18nextOptions: InitOptions): void;
  read(language: string, namespace: string, callback: ReadCallback): void;
  create(languages: string[], namespace: string, key: string, fallbackValue: string): void;
  readMulti(languages: string[], namespaces: string[], callback: ReadCallback): void;
}
