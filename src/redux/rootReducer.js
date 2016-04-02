import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import auth from './modules/auth';
import question from './modules/question';

export default combineReducers({
  auth,
  question,
  routing
});
