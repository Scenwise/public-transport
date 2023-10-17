import { combineReducers } from 'redux';

import currentDisplayGeoDataPTLinesReducer from './displayGeoDataPTLinesReducer';
import filterReducer from './filterReducer';
import filterSetReducer from './filterSetReducer';
import currentGeoDataPTLinesReducer from './geoDataPTLinesReducer';
import currentMapReducer from './mapReducer';
import offsetReducer from './offsetReducer';
import selectedRouteReducer from './selectedRouteReducer';
import stopsReducer from './stopsReducer';

const rootReducer = combineReducers({
    currentGeoDataPTLinesReducer: currentGeoDataPTLinesReducer,
    currentMapReducer: currentMapReducer,
    currentDisplayGeoDataPTLinesReducer: currentDisplayGeoDataPTLinesReducer,
    stopsReducer: stopsReducer,
    filterSetReducer: filterSetReducer,
    selectedRouteReducer: selectedRouteReducer,
    offsetReducer: offsetReducer,
    filterReducer: filterReducer,
});

export default rootReducer;
