import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deepcopy from 'deepcopy';

import getGtfsTable from '../components/MapBoxContainer/functions/dataRequest';
import { ReadyState } from '../types/data';

export const fetchGtfsGeoJSON = (tableName: string) =>
    createAsyncThunk(tableName, async () => await getGtfsTable(tableName));
export interface State {
    ptSegments: FeatureRecord<PTSegmentFeature>; // A map of the public transport routes, the keys are the route ids
    filters: Filters; // The filters applied to the public transport routes
    selectedRoute: number; // The id of te selected route
    ptStops: FeatureRecord<PTStopFeature>; // A map of stop ids to the stops
    status: Status;
}

export const initialState: State = {
    ptSegments: {} as FeatureRecord<PTSegmentFeature>,
    filters: {} as Filters,
    selectedRoute: -1,
    ptStops: {} as FeatureRecord<PTStopFeature>,
    status: {
        ptSegment: ReadyState.UNINSTANTIATED,
        ptStop: ReadyState.UNINSTANTIATED,
    },
};

const slice = createSlice({
    name: 'slice',
    initialState: initialState,
    reducers: {
        updatePTSegments(state: State, action: PayloadAction<FeatureRecord<PTSegmentFeature>>) {
            state.ptSegments = action.payload;
        },
        updateFilters(state: State, action: PayloadAction<Filters>) {
            state.filters = deepcopy(action.payload);
        },
        updateSelectedRoute(state: State, action: PayloadAction<number>) {
            state.selectedRoute = action.payload;
        },
        updateStops(state: State, action: PayloadAction<FeatureRecord<PTStopFeature>>) {
            state.ptStops = action.payload;
        },
    },
});

export const { updatePTSegments, updateFilters, updateSelectedRoute, updateStops } = slice.actions;

// Memoized selector for array of features
// export const selectLoopFeatureList = createSelector(
//     (state: RootState) => state.loopModality.features,
//     (features) => Object.values(features),
// );

export { slice };
