import {combineReducers} from 'redux';
import currentGeoDataPTLinesReducer from './geoDataPTLinesReducer';
import currentMapReducer from './mapReducer';
import currentDisplayGeoDataPTLinesReducer from './displayGeoDataPTLinesReducer';
import stopsReducer from './stopsReducer';
import filterSetReducer from './filterSetReducer';
import selectedRouteReducer from './selectedRouteReducer';
import offsetReducer from './offsetReducer';
import filterReducer from './filterReducer';

const rootReducer = combineReducers({
    currentGeoDataPTLinesReducer: currentGeoDataPTLinesReducer,
    currentMapReducer: currentMapReducer,
    currentDisplayGeoDataPTLinesReducer: currentDisplayGeoDataPTLinesReducer,
    stopsReducer: stopsReducer,
    filterSetReducer: filterSetReducer,
    selectedRouteReducer: selectedRouteReducer,
    offsetReducer: offsetReducer,
    filterReducer: filterReducer
})

export default rootReducer;