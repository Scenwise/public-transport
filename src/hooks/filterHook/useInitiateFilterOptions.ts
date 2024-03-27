import { useEffect, useRef } from 'react';

import { FilterType, ReadyState } from '../../data/data';
import {
    selectPTRoutesFeatureList,
    selectPTStopsFeatureList,
    updateFilters,
    updateInitialFilters,
} from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

// Filters: agency, line number, vehicle type
export const useInitiateFilterOptions = (filterNames: string[], filterKeys: string[]): void => {
    const dispatch = useAppDispatch();
    const ptRouteFeatures = useAppSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useAppSelector(selectPTStopsFeatureList);
    const status = useAppSelector((state) => state.slice.status);

    // const filters = useAppSelector(state => state.slice.filters);
    const initialFilters = {} as Filters;
    // The initial filter
    filterKeys.forEach((filterKey, i) => {
        initialFilters[filterKey] = {
            optionTitle: filterNames[i],
            optionKey: filterKey,
            type: FilterType.checkbox,
            options: [],
            availableOptions: [],
            variants: [],
            value: -1,
        };
    });

    // Ensure re-store the options only if the list is changed, no matter of the rendering
    const prevListRef = useRef(ptRouteFeatures);

    // Dynamically store the options based on the routes
    useEffect(() => {
        if (prevListRef.current !== ptRouteFeatures && status.ptRoute === ReadyState.OPEN) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(initialFilters).forEach(([_filterKey, filter]: [string, Filter]) => {
                const options = getOptions(filter, ptRouteFeatures, ptStopFeatures);
                filter.options = options;
                filter.availableOptions = options;
            });
            dispatch(updateFilters(initialFilters));
            dispatch(updateInitialFilters(initialFilters));

            prevListRef.current = ptRouteFeatures;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);
};
export const getOptions = (
    filter: Filter,
    ptRouteFeatures: PTRouteFeature[],
    ptStopFeatures: PTStopFeature[],
): string[] => {
    let list = [];
    if (filter.optionKey == 'stop') {
        list = ptStopFeatures.map((feature) => feature.properties.stopName);
    } else if (filter.optionKey == 'delay') {
        return [];
    } else {
        list = ptRouteFeatures.map((feature) => feature.properties[filter.optionKey]);
    }

    return list
        .sort()
        .filter((v, i, a) => a.indexOf(v) == i)
        .filter((option) => option !== '' && option !== null); // Remove undefined values
};
