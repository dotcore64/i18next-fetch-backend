declare module "i18next-fetch-backend" {
    type FailureCallback = (errorMessage: string, retry: boolean) => void;
    type SuccessCallback = (_: null, data: any) => any;
    export default class Backend {
        constructor(services: any, options: any);
        type: 'backend';
        static type: 'backend';

        init(services: any, options: any): void;
        getLoadPath(languages: string, namespaces: string): string;
        read(language: string, namespace: string, callback: Function): void;
        readMulti(languages: string[], namespaces: string[], callback: Function): void;
        loadUrl(url: string, callback: SuccessCallback | FailureCallback): void;
        create(languages: string[], namespace: string, key: string, fallbackValue: string): void;
    }
}