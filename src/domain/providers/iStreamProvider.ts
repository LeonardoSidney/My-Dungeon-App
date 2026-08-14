export namespace StreamProvider {
    export type params = {
        url: string;
        method?: 'POST' | 'GET';
        headers?: Record<string, string>;
        body?: Record<string, unknown>;
    };
}

export namespace IStreamProvider {
    export type StreamResult = {
        stream: AsyncIterable<string>;
        abort: () => void;
    };
}

export interface IStreamProvider {
    stream(params: StreamProvider.params): IStreamProvider.StreamResult;
}
