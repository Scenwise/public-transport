import { useEffect } from 'react';

import {
    selectPTRoutesFeatureList,
    updateFilteredRoutes,
    updateSelectedRoute,
    updateSelectedStop,
} from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

export const useUpdateRoutesWithFilter = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.slice.filters);
    const routes = useAppSelector(selectPTRoutesFeatureList);
    const stops = useAppSelector((state) => state.slice.ptStops);
    const selectedPTRouteID = useAppSelector((state) => state.slice.selectedRoute);

    // If the filter is changed, we need to update the routes.
    useEffect(() => {
        const filteredRoutes = routes.filter((route) => {
            let isRouteKept = true;
            Object.entries(filters).forEach(([key, filter]) => {
                if (key == 'stop') {
                    isRouteKept =
                        isRouteKept &&
                        checkCheckboxFilterList(
                            filter,
                            route.properties.stops_ids.map((id) => stops[id].properties.stopName),
                        );
                } else {
                    isRouteKept = isRouteKept && checkCheckboxFilter(filter, route.properties[key]);
                }
            });
            return isRouteKept;
        });

        // If the selected route is not in the filtered routes, remove the selected route and stop.
        if (!filteredRoutes.map((route) => '' + route.properties.shape_id).includes(selectedPTRouteID)) {
            // Remove the selected route and stop when the filter is changed.
            dispatch(updateSelectedRoute(''));
            dispatch(updateSelectedStop(''));
        }

        dispatch(updateFilteredRoutes(filteredRoutes));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, routes]);
};

/**
 * If the filter is a checkbox or subCheckbox type, determine if a value/property of an route should be filtered
 * @param filter The filter to apply
 * @param value The value to be checked if it is included after the filter is applied
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkCheckboxFilter = (filter: Filter, value: string): boolean => {
    return filter.variants.includes(value) || !filter.variants.length;
};

const checkCheckboxFilterList = (filter: Filter, valueList: string[]): boolean => {
    return !filter.variants.length || valueList.some((value) => filter.variants.includes(value));
};
