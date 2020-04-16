import { createSuffixTypes } from './createAsyncActions';
import { Reducer, ReducerMeta } from 'redux-actions';

interface ListenerMap<State, Payload, Meta> {
  onSuccess?: ReducerMeta<State, Payload, Meta>;
  onFailure?: ReducerMeta<State, Payload, Meta>;
  onCanceled?: ReducerMeta<State, Payload, Meta>;
  onRequest?: ReducerMeta<State, Payload, Meta>;
}

export function createAsyncReducerMap<State, Payload = any, Meta = any>(
  type: string,
  listenerMap: ListenerMap<State, Payload, Meta>
): { [key: string]: Reducer<State, Payload> } {
  const types = createSuffixTypes(type);

  return {
    [types.request]: listenerMap.onRequest,
    [types.cancel]: listenerMap.onCanceled,
    [types.success]: listenerMap.onSuccess,
    [types.failure]: listenerMap.onFailure
  } as any;
}
