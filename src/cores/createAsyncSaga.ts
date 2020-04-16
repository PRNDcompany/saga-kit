import { fork } from 'redux-saga/effects';
import { Action } from 'typesafe-actions';
import { AsyncActions } from './createAsyncActions';

// function isAsyncAction(action: AsyncActions | Action<any>): action is AsyncActions {
//   return !!action['sagaCreator'];
// }

export function createAsyncSaga(...args: Array<AsyncActions>) {
  return args.map(asyncAction => fork(asyncAction.sagaCreator));
}

// export function createAsyncSagaMap(actions: { [key: string]: Array<AsyncActions | Action<any>> }) {
//   const forks = [];
//
//   for (const key in actions) {
//     const action = actions[key];
//
//     if (isAsyncAction(action)) {
//       forks.push(fork(action.sagaCreator));
//     }
//   }
//
//   return forks;
// }
