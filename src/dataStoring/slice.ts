import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import deepcopy from 'deepcopy';

import { ReadyState } from '../data/data';
import getGtfsTable from '../methods/apiRequests/apiFunction';
import { RootState } from '../store';

export const fetchGtfsGeoJSON = (tableName: string) =>
    createAsyncThunk(tableName, async () => await getGtfsTable(tableName));
export interface State {
    ptRoutes: FeatureRecord<PTRouteFeature>; // A map of the public transport routes, the keys are the route ids
    selectedRoute: string; // The id of te selected route
    ptStops: FeatureRecord<PTStopFeature>; // A map of stop ids to the stops
    selectedStop: string; // The id of te selected stop
    filters: Filters; // The filters applied to the public transport routes
    initialFilters: Filters; // Keep the initial filters with the filled with options
    filteredRoutes: PTRouteFeature[]; // Keep the filtered routes
    visibleRoutes: VisibleFiltering; // State of the visible filtering
    status: Status;
    mapStyle: string; // The id of the current map style
    routeOffset: number;
    clickableLayers: string[];
    stopCodeToRouteMap: Record<string, number>; // Map each stop code to its corresponding route id for route-vehicle matching
}

export const initialState: State = {
    ptRoutes: {} as FeatureRecord<PTRouteFeature>,
    selectedRoute: '',
    ptStops: {} as FeatureRecord<PTStopFeature>,
    selectedStop: '',
    filters: {} as Filters,
    initialFilters: {},
    filteredRoutes: [] as PTRouteFeature[],
    visibleRoutes: {
        isOn: false,
        ids: [],
    },
    status: {
        ptRoute: ReadyState.UNINSTANTIATED,
        ptStop: ReadyState.UNINSTANTIATED,
    },
    routeOffset: 2,
    mapStyle: 'light-v11',
    clickableLayers: [],
    stopCodeToRouteMap: {} as Record<string, number>,
};

const slice = createSlice({
    name: 'slice',
    initialState: initialState,
    reducers: {
        updatePTRoutes(state: State, action: PayloadAction<FeatureRecord<PTRouteFeature>>) {
            state.ptRoutes = action.payload;
        },
        updatePTRoute(state: State, action: PayloadAction<PTRouteFeature>) {
            state.ptRoutes[action.payload.properties.shape_id] = action.payload;
        },
        updateFilters(state: State, action: PayloadAction<Filters>) {
            state.filters = deepcopy(action.payload);
        },
        updateInitialFilters(state: State, action: PayloadAction<Filters>) {
            state.initialFilters = deepcopy(action.payload);
        },
        updateFilter(state: State, action: PayloadAction<Filter>) {
            state.filters[action.payload.optionKey] = deepcopy(action.payload);
        },
        updateFilteredRoutes(state: State, action: PayloadAction<PTRouteFeature[]>) {
            state.filteredRoutes = action.payload;
        },
        updateVisibleRouteState(state: State, action: PayloadAction<VisibleFiltering>) {
            state.visibleRoutes = deepcopy(action.payload);
        },
        updateSelectedRoute(state: State, action: PayloadAction<string>) {
            state.selectedRoute = action.payload;
        },
        updatePTStops(state: State, action: PayloadAction<FeatureRecord<PTStopFeature>>) {
            state.ptStops = action.payload;
        },
        updateSelectedStop(state: State, action: PayloadAction<string>) {
            state.selectedStop = action.payload;
        },
        updateStatus(state: State, action: PayloadAction<Status>) {
            state.status = action.payload;
        },
        updateRouteOffset(state: State, action: PayloadAction<number>) {
            state.routeOffset = action.payload;
        },
        updateMapStyle(state: State, action: PayloadAction<string>) {
            state.mapStyle = action.payload;
        },
        updateClickableLayers(state: State, action: PayloadAction<string[]>) {
            state.clickableLayers = action.payload;
        },
        updateStopCodeToRouteMap(state: State, action: PayloadAction<Record<string, number>>) {
            state.stopCodeToRouteMap = action.payload;
        },
    },
});

export const {
    updatePTRoutes,
    updatePTRoute,
    updateFilters,
    updateInitialFilters,
    updateFilter,
    updateFilteredRoutes,
    updateVisibleRouteState,
    updateSelectedRoute,
    updatePTStops,
    updateSelectedStop,
    updateStatus,
    updateRouteOffset,
    updateMapStyle,
    updateClickableLayers,
    updateStopCodeToRouteMap,
} = slice.actions;

// Memoized selector for array of features
export const selectPTRoutesFeatureList = createSelector(
    (state: RootState) => state.slice.ptRoutes,
    (features) => Object.values(features),
);

export const selectPTStopsFeatureList = createSelector(
    (state: RootState) => state.slice.ptStops,
    (features) => Object.values(features),
);

export const selectFilterList = createSelector(
    (state: RootState) => state.slice.filters,
    (features) => Object.values(features),
);

export { slice };
