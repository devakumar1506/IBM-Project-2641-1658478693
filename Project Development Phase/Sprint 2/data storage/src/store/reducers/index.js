import { combineReducers } from 'redux';
import recordReducer from 'store/reducers/recordReducer';

const rootReducer = combineReducers({
  record: recordReducer,
});

export default rootReducer;
