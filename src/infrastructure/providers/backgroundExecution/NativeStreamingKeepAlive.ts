import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    start (): Promise<void>;
    stop (): Promise<void>;
}

export default TurboModuleRegistry.get<Spec>('NativeStreamingKeepAlive');
