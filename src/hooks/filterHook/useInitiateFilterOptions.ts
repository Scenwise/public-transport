import { useEffect, useRef } from 'react';

import { FilterType } from '../../data/data';
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
        };
    });

    // Ensure re-store the options only if the list is changed, no matter of the rendering
    const prevListRef = useRef(ptRouteFeatures);

    // Dynamically store the options based on the routes
    useEffect(() => {
        if (prevListRef.current !== ptRouteFeatures) {
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
    }, [ptRouteFeatures]);
};
export const getOptions = (
    filter: Filter,
    ptRouteFeatures: PTRouteFeature[],
    ptStopFeatures: PTStopFeature[],
): string[] => {
    if (filter.optionKey == 'stop') {
        return ptStopFeatures.map((feature) => feature.properties.stopName).sort();
    }

    return ptRouteFeatures
        .map((feature) => feature.properties[filter.optionKey])
        .filter((v, i, a) => a.indexOf(v) == i) // Only get the unique values
        .filter((option) => option !== '' && option !== null) // Remove undefined values
        .sort();
};
