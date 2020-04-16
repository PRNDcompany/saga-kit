import { fork } from 'redux-saga/effects';
import { AsyncActions } from './createAsyncActions';

export function createAsyncSaga(...args: Array<AsyncActions>) {
  return args.map(asyncAction => fork(asyncAction.sagaCreator));
}
