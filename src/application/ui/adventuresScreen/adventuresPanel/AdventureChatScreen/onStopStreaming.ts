import { OnStopStreamingParams } from './constants';

export function onStopStreaming ({ refs: { isAborted, stream, abort }, setIsStreaming }: OnStopStreamingParams) {
    isAborted.current = true;
    abort.current?.();
    stream.current?.return(undefined);
    abort.current = null;
    setIsStreaming(false);
}
