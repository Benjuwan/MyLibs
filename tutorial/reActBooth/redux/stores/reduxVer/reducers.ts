import type { Reducer } from 'redux';
import { CounterActions as Action } from './actions';
import type { CounterAction } from './actions';

export interface CounterState {
  count: number;
}
export const initialState: CounterState = { count: 0 };

// Reducer 純粋関数でオブジェクトを返す
export const counterReducer: Reducer<CounterState, CounterAction> = (
  state = initialState,
  action
) => {
  if (action.type === Action.DECREMENT) {
    return {
      ...state,
      count: state.count < 1 ? 0 : state.count - 1,
    };
  } 
  
  else if (action.type === Action.INCREMENT) {
    return {
      ...state,
      count: state.count + 1,
    };
  } 
  
  else if (action.type === Action.ADD) {
    return {
      ...state,
      count: state.count + (action.amount ?? 0),
    };
  } 
  
  else {
    const _: never = action.type;
    return state;
  }
};
