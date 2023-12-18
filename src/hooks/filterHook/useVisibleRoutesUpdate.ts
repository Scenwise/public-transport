import { useEffect } from 'react';

import { initialState, updateVisibleRouteState } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

/**
 * Filter a list of routes by visible ids.
 *
 * @param filterOn - Whether or not the filter is on
 * @param visibleIds - The ids of the alerts that are visible
 * @param routes - The routes to filter
 *
 * @returns The filtered alerts
 */
export const filterRoutesByVisibleIds = (
    filterOn: boolean,
    visibleIds: string[],
    routes: PTRouteProperties[],
): PTRouteProperties[] => {
    if (!filterOn) return routes;
    return routes.filter(({ shape_id }) => visibleIds.includes('' + shape_id));
};

/**
 * Get the visible routes from the current ma screen.
 * @param map - The mapbox map
 * @param visibleFiltering - The visible filtering state {if this option is active, ids of the visible routes}
 */
export const getVisibleRoutes = (map: mapboxgl.Map | null, visibleFiltering: VisibleFiltering): VisibleFiltering => {
    if (map && visibleFiltering.isOn && (map.getLayer('ptRoutes') as mapboxgl.SymbolLayer)) {
        const features = map.queryRenderedFeatures(undefined, {
            layers: ['ptRoutes'],
            validate: false,
        });

        return { isOn: visibleFiltering.isOn, ids: features.map((x) => '' + x.properties?.shape_id) };
    } else {
        return initialState.visibleRoutes;
    }
};

/**
 * If the switch is toggled on, update the visible routes
 * @param map - The mapbox map
 */
export const useVisibleRoutesUpdate = (map: mapboxgl.Map | null) => {
    const visibleRoutes = useAppSelector((state) => state.slice.visibleRoutes);
    const dispatch = useAppDispatch();

    useEffect((): void => {
        if (map) {
            const updatedVisibleFiltering = getVisibleRoutes(map, visibleRoutes);
            dispatch(updateVisibleRouteState(updatedVisibleFiltering));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleRoutes.isOn]);
};
