import { Model } from '@domain/entities';
import { isRecord } from './shared';

/**
 * TODO(model-cache): ModelDTO is DEAD CODE on purpose — it has no consumer yet.
 *
 * What it is: the persistence/translation layer for `Model` data coming from a
 * provider's `/models` endpoint. It was created to keep the project faithful to
 * contracts (infrastructure agnostic): the wire response is already translated
 * by `getModelResponseDTO` + `LlamaCppBaseGateway.parseModelsResponse`, and this
 * DTO is the (future??) storage side of the same entity?
 *
 * Why it was NOT implemented yet:
 * - `Model` is GATEWAY-DERIVED data, constantly stale. The project targets local
 *   inference, where the user swaps GGUFs/quantizations to test speed and
 *   quality — easily 300+ tests. The cache can only be a display snapshot,
 *   never a source of truth for model selection.
 * - Current preference: hit `/models` live on app setup, not from cache.
 * - Nothing reads Models from storage today; `ModelRepository`/`IModelRepository`
 *   do not exist. Persisting without a consumer just recreates dead code.
 *
 * Plan when it ships (design already worked through):
 * - Identity: composite `${connectionId}:${providerModelId}` (Model.id is
 *   provider-generated and can collide across connections; `loadModels` merges
 *   several connections, so the key must be globally unique, (model_id probably)).
 * - Refresh policy: live write-through per connection at setup only (no TTL /
 *   no runtime staleness). UI reads the snapshot from storage (0 HTTP).
 * - Invalidation: cascade on `eraseConnection` (orphaned models by connectionId)(yay migration).
 *   `editConnection` is left to the next setup refresh (accepted stale window).
 * - Scope: `MODEL_STORAGE_NAMESPACE`, `IModelRepository` + `ModelRepository`
 *   (copy of the 13 existing patterns — trivial), container registration, and the
 *   REAL cost: rewiring `application/ui/assistantScreen/loadModels.ts` to
 *   read-snapshot + refresh-on-setup + offline fallback, plus the cascade in
 *   `eraseConnectionUseCase`. ~4 days??? the risk is concentrated in loadModels.ts.
 *
 */
export class ModelDTO {
    constructor (
        readonly id: string,
        readonly name: string,
        readonly connectionId: string,
        readonly nCtx: number,
        readonly ownedBy: string
    ) { }

    static fromStorage (data: unknown): ModelDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.connectionId !== 'string' ||
            typeof data.ownedBy !== 'string' ||
            typeof data.nCtx !== 'number'
        ) {
            return null;
        }

        return new ModelDTO(
            data.id,
            data.name,
            data.connectionId,
            data.nCtx,
            data.ownedBy
        );
    }

    toEntity (): Model {
        return {
            id: this.id,
            name: this.name,
            connectionId: this.connectionId,
            nCtx: this.nCtx,
            ownedBy: this.ownedBy
        };
    }
}
