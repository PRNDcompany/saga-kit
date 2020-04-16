import { all, call, put, takeEvery } from 'redux-saga/effects';
import { action } from 'typesafe-actions';
import axios from 'axios';

type AsyncCreator = (...args: any[]) => Promise<any>;

const suffixNames: Array<string> = ['cancel', 'initial', 'request', 'success', 'failure'];

export interface AsyncActions extends Function {
  sagaCreator: () => IterableIterator<any>;
}

export function createSuffixTypes(type: string) {
  return {
    cancel: `${type}/${suffixNames[0]}`,
    initial: `${type}/${suffixNames[1]}`,
    request: `${type}/${suffixNames[2]}`,
    success: `${type}/${suffixNames[3]}`,
    failure: `${type}/${suffixNames[4]}`
  };
}

export function createAsyncActions(type: string, asyncCreator: AsyncCreator): AsyncActions {
  const types = createSuffixTypes(type);

  function actionCreator(...args: Array<any>) {
    return action(types.initial, args);
  }

  function* iterator(...args: any) {
    yield put(action(types.request));

    const asyncCreatorArguments = args.map(({ payload }: { payload: any }) => payload);
    const callArguments: Array<any> = [];

    asyncCreatorArguments.map((argument: any) => {
      callArguments.push(...argument);
    });

    try {
      const payload = yield call(asyncCreator, ...callArguments);
      yield put(action(types.success, payload, callArguments));
    } catch (e) {
      if (axios.isCancel(e)) {
        yield put(action(types.cancel, e, callArguments));
      } else {
        yield put(action(types.failure, e, callArguments));
      }
    }
  }

  function* sagaCreator() {
    yield all([takeEvery(types.initial, iterator)]);
  }

  actionCreator.sagaCreator = sagaCreator;

  return actionCreator;
}
