import rootReducer from '../reducers/combineReducers';
import {configureStore} from '@reduxjs/toolkit'

console.log("1");
const store = configureStore({reducer: rootReducer});
export type RootStore = ReturnType<typeof rootReducer>;

export default store;