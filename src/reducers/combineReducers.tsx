import { combineReducers } from 'redux';

import filterReducer from './filterReducer';
import filterSetReducer from './filterSetReducer';
import currentGeoDataPTLinesReducer from './geoDataPTLinesReducer';
import offsetReducer from './offsetReducer';
import selectedRouteReducer from './selectedRouteReducer';
import stopsReducer from './stopsReducer';

const rootReducer = combineReducers({
    currentGeoDataPTLinesReducer: currentGeoDataPTLinesReducer,
    stopsReducer: stopsReducer,
    filterSetReducer: filterSetReducer,
    selectedRouteReducer: selectedRouteReducer,
    offsetReducer: offsetReducer,
    filterReducer: filterReducer,
});

export default rootReducer;
