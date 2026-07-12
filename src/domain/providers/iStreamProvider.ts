export interface IStreamProvider {
    stream(params: StreamProvider.params): AsyncIterable<string>;
}

export namespace StreamProvider {
    export type params = {
        url: string;
        method?: 'POST' | 'GET';
        headers?: Record<string, string>;
        body?: Record<string, unknown>;
    };
}
