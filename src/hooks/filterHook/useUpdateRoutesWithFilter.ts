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
    const selectedPTRouteID = useAppSelector((state) => state.slice.selectedRoute);

    // If the filter is changed, we need to update the routes.
    useEffect(() => {
        const filteredRoutes = routes.filter((route) => {
            let isRouteKept = true;
            Object.entries(filters).forEach(([key, filter]) => {
                const value = route.properties[key];
                isRouteKept = isRouteKept && checkCheckboxFilter(filter, value);
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
 * If the filter is a checkbox or subCheckbox type, determine if a value/property of an alert should be filtered
 * @param filter The filter to apply
 * @param value The value to be checked if it is included after the filter is applied
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkCheckboxFilter = (filter: Filter, value: string): boolean => {
    return filter.variants.includes(value) || !filter.variants.length;
};
