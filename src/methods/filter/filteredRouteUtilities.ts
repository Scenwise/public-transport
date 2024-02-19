export const checkFilteredRoutePerVehicle = (
    route: PTRouteFeature,
    filters: Filters,
    stops: FeatureRecord<PTStopFeature>,
    vehiclePunctuality: number,
): boolean => {
    let isRouteKept = true;
    Object.entries(filters).forEach(([key, filter]) => {
        if (key == 'stop') {
            isRouteKept =
                isRouteKept &&
                checkCheckboxFilterList(
                    filter,
                    route.properties.stops_ids.map((id) => stops[id].properties.stopName),
                );
        } else if (key == 'delay' && filter.value != -1) {
            isRouteKept = isRouteKept && vehiclePunctuality >= filter.value * 60;
        } else {
            isRouteKept = isRouteKept && checkCheckboxFilter(filter, route.properties[key]);
        }
    });
    return isRouteKept;
};

export const checkFilteredRoute = (
    route: PTRouteFeature,
    filters: Filters,
    stops: FeatureRecord<PTStopFeature>,
    vehicleMarkers: Map<string, VehicleRoutePair>,
): boolean => {
    let isRouteKept = true;
    Object.entries(filters).forEach(([key, filter]) => {
        if (key == 'stop') {
            isRouteKept =
                isRouteKept &&
                checkCheckboxFilterList(
                    filter,
                    route.properties.stops_ids.map((id) => stops[id].properties.stopName),
                );
        } else if (key == 'delay' && filter.value != -1) {
            // We only filter based on delay if the value of the filter is not initial value
            isRouteKept =
                isRouteKept && checkVehicleDelayPerRoute(filter, route.properties.vehicle_ids, vehicleMarkers);
        } else {
            isRouteKept = isRouteKept && checkCheckboxFilter(filter, route.properties[key]);
        }
    });
    return isRouteKept;
};

/**
 * If the filter is a checkbox or subCheckbox type, determine if a value/property of an route should be filtered
 * @param filter The filter to apply
 * @param value The value to be checked if it is included after the filter is applied
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkCheckboxFilter = (filter: Filter, value: string): boolean => {
    return filter.variants.includes(value) || !filter.variants.length;
};

const checkCheckboxFilterList = (filter: Filter, valueList: string[]): boolean => {
    return !filter.variants.length || valueList.some((value) => filter.variants.includes(value));
};

const checkVehicleDelayPerRoute = (
    filter: Filter,
    vehicleIds: string[],
    vehicleMarkers: Map<string, VehicleRoutePair>,
): boolean => {
    for (const vehicle of vehicleIds) {
        const vehiclePunctuality = vehicleMarkers.get(vehicle)?.vehicle.properties.punctuality;
        // If we find one vehicle with corresponding delay, return true since we want to keep the route
        if (vehiclePunctuality !== undefined && vehiclePunctuality >= filter.value * 60) {
            return true;
        }
    }
    // If all vehicles are below the delay threshold, do not keep the route
    return false;
};
