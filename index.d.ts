import { BackendModule, Services, ReadCallback, MultiReadCallback, InitOptions } from 'i18next';

export interface FetchOptions {
  loadPath: string,
  addPath: string,
  multiSeparator: string,
  allowMultiLoading: boolean,
  fetch: typeof fetch,
  parse: typeof JSON.parse,
  stringify: typeof JSON.stringify,
  requestOptions: RequestInit,
}
export class BackendError extends Error { }
export default class Backend implements BackendModule<FetchOptions> {
  type: 'backend';
  static type: 'backend';
  constructor(services: Services, options: FetchOptions);
  init(services: Services, backendOptions: FetchOptions, i18nextOptions: InitOptions): void;
  create(languages: string[], namespace: string, key: string, fallbackValue: string): void;
  /**
   * @throws {BackendError} - If the fetch fails or the parsing the response to json fails.
   */
  read(language: string, namespace: string, callback: ReadCallback): void;
  /**
   * @throws {BackendError} - If the fetch fails or the parsing the response to json fails.
   */
  readMulti(languages: string[], namespaces: string[], callback: MultiReadCallback): void;
}
