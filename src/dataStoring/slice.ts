import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import deepcopy from 'deepcopy';

import getGtfsTable from '../apiRequests/apiFunction';
import { ReadyState } from '../data/data';
import { RootState } from '../store';

export const fetchGtfsGeoJSON = (tableName: string) =>
    createAsyncThunk(tableName, async () => await getGtfsTable(tableName));
export interface State {
    ptRoutes: FeatureRecord<PTRouteFeature>; // A map of the public transport routes, the keys are the route ids
    filters: Filters; // The filters applied to the public transport routes
    selectedRoute: string; // The id of te selected route
    ptStops: FeatureRecord<PTStopFeature>; // A map of stop ids to the stops
    status: Status;
    map?: mapboxgl.Map;
}

export const initialState: State = {
    ptRoutes: {} as FeatureRecord<PTRouteFeature>,
    filters: {} as Filters,
    selectedRoute: '',
    ptStops: {} as FeatureRecord<PTStopFeature>,
    status: {
        ptRoute: ReadyState.UNINSTANTIATED,
        ptStop: ReadyState.UNINSTANTIATED,
    },
};

const slice = createSlice({
    name: 'slice',
    initialState: initialState,
    reducers: {
        updatePTRoutes(state: State, action: PayloadAction<FeatureRecord<PTRouteFeature>>) {
            state.ptRoutes = action.payload;
        },
        updateFilters(state: State, action: PayloadAction<Filters>) {
            state.filters = deepcopy(action.payload);
        },
        updateSelectedRoute(state: State, action: PayloadAction<string>) {
            state.selectedRoute = action.payload;
        },
        updatePTStops(state: State, action: PayloadAction<FeatureRecord<PTStopFeature>>) {
            state.ptStops = action.payload;
        },
        updateStatus(state: State, action: PayloadAction<Status>) {
            state.status = action.payload;
        },
        updateMap(state: State, action: PayloadAction<mapboxgl.Map>) {
            state.map = action.payload;
        },
    },
});

export const { updateMap, updatePTRoutes, updateFilters, updateSelectedRoute, updatePTStops, updateStatus } =
    slice.actions;

// Memoized selector for array of features
export const selectPTRoutesFeatureList = createSelector(
    (state: RootState) => state.slice.ptRoutes,
    (features) => Object.values(features),
);

export const selectPTStopsFeatureList = createSelector(
    (state: RootState) => state.slice.ptStops,
    (features) => Object.values(features),
);
export { slice };
