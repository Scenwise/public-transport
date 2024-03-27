import deepcopy from 'deepcopy';

import { ReadyState, RouteType, vehicleTypes, wheelchairBoarding } from '../../data/data';
import { findClosestPointIndex } from '../../util';
import { getGtfsTable } from './apiFunction';

/**
 * Fetch the routes data and store the routes as a record(map) with the key of the shape id.
 * @param setPTRoutes Function to set the routes record
 * @param setPTStops Function to set the stops record
 * @param setStopToRouteMap Function to set the map of stop codes/route id's
 * @param setStatus Function to set the routes and stops loading status
 */
export const addPublicTransportData = async (
    setPTRoutes: (ptRoutes: FeatureRecord<PTRouteFeature>) => void,
    setPTStops: (ptStops: FeatureRecord<PTStopFeature>) => void,
    setStopToRouteMap: (stopToRouteMap: Record<string, number>) => void,
    setStatus: (status: Status) => void,
): Promise<Status> => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    return new Promise(() => {
        let ptRouteStatus = ReadyState.CONNECTING;
        let ptStopStatus = ReadyState.CONNECTING;
        setStatus({
            ptRoute: ptRouteStatus,
            ptStop: ptStopStatus,
        });

        const ptRoutesData = getGtfsTable('gtfs_shapes_agency_vehicle_type_number_stops_info_corrected');
        const ptStopsData = getGtfsTable('stops_sequence_info_along_shape');

        // Update the status of the data loading
        if (!ptRoutesData) ptRouteStatus = ReadyState.CLOSED;
        if (!ptStopsData) ptStopStatus = ReadyState.CLOSED;

        // Handle the response of the ptRoutes
        ptRoutesData
            .then((ptRoutesRes) => {
                ptStopsData
                    .then((ptStopsRes) => {
                        // Initialize the routes data
                        const ptRoutes = {} as FeatureRecord<PTRouteFeature>;

                        const ptStopsResIds = ptStopsRes.features.map((feature) => feature.id + '');

                        ptRoutesRes.features.forEach((feature) => {
                            const id = '' + feature.id; //the id is shape_id which is a number
                            // TODO: TO be removed after the graph service fixed the problem that ptRoutesRes and ptStopsRes does not have the equal amount of data
                            // Currently shape ids are not consistent in stop table and route table.
                            const routeType = getRouteTypeString(feature.properties?.route_type);
                            if (ptStopsResIds.includes(id)) {
                                const ptRoutesProperties = {
                                    origin: feature.properties?.origin,
                                    route_id: feature.properties?.route_id,
                                    shape_id: feature.properties?.shape_id,
                                    agency_id: feature.properties?.agency_id,
                                    destination: feature.properties?.destinatio,
                                    line_number: feature.properties?.line_numbe,
                                    route_name: feature.properties?.route_name,
                                    vehicle_type: feature.properties?.vehicle_ty,
                                    route_type: routeType,
                                    vehicle_ids: [] as string[],
                                    route_color: getRouteColor(routeType),
                                } as PTRouteProperties;
                                ptRoutes[id] = {
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: (feature.geometry as GeoJSON.MultiLineString).coordinates[0],
                                    },
                                    properties: ptRoutesProperties,
                                } as PTRouteFeature;
                            }
                        });

                        // Initialize the stops data
                        const ptStops = {} as FeatureRecord<PTStopFeature>;
                        // Initialize the stops-routes map
                        const stopToRouteMap = {} as Record<string, number>;

                        ptStopsRes.features.forEach((feature) => {
                            const id = '' + feature.id; //This id is shape_id which is a number

                            // TODO: TO be removed after the graph service fixed the problem that ptRoutesRes and ptStopsRes does not have the equal amount of data
                            // Currently shape ids are not consistent in stop table and route table.
                            if (ptRoutes[id]) {
                                // The stop properties to be put on the table
                                const stopProperties = JSON.parse(JSON.stringify(feature.properties));
                                const stopIds: string[] = stopProperties.stops_ids;
                                const stopGeometries = JSON.parse(JSON.stringify(feature.geometry)).coordinates;

                                const stops: PTStopFeature[] = [];
                                // Number of the stops that do not have any information, need to be skipped when assigning the geometry
                                let nullStopNum = 0;

                                stopIds.forEach((stopId, index) => {
                                    // Some stops do not have any information, just skip it
                                    if (!stopId) {
                                        nullStopNum++;
                                        return null;
                                    }
                                    stops.push({
                                        id: stopId + '',
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: stopGeometries[index - nullStopNum]
                                                ? stopGeometries[index - nullStopNum]
                                                : [],
                                        },
                                        properties: {
                                            stopId: stopId + '',
                                            routes: [],
                                            stopName: stopProperties.stop_names[index],
                                            stopsCode: stopProperties.stops_code[index],
                                            platformCode: stopProperties.platform_code[index],
                                            wheelchairBoarding: getWheelchairBoarding(
                                                stopProperties.wheelchair_boarding[index],
                                            ),
                                            arrivalTime: 'Loading',
                                            departureTime: 'Loading',
                                        },
                                    });
                                });

                                const sortedStops: PTStopFeature[] = removeDuplicateStops(
                                    sortStops(ptRoutes[id], stopGeometries, stops),
                                );

                                // Add the stop ids to the route
                                ptRoutes[id].properties.stops_ids = sortedStops.map((stop) => stop.properties.stopId);

                                // Store each individual stops into the general stop map. Store the route id for each stop code.
                                sortedStops.forEach((stop: PTStopFeature) => {
                                    const length = ptStops[stop.properties.stopId]?.geometry?.coordinates?.length;
                                    // If the stop does not contain in the list of the existing stop in the list does not be assigned with a geometry
                                    // Add the stop
                                    if (!length || length == 0) {
                                        ptStops[stop.properties.stopId] = stop;
                                    }

                                    stopToRouteMap[stop.properties.stopsCode] = ptRoutes[id].properties.shape_id;
                                });
                            }
                        });

                        setPTStops(addLineNumberToStops(ptRoutes, ptStops));
                        setPTRoutes(ptRoutes);
                        setStopToRouteMap(stopToRouteMap);
                        ptRouteStatus = ReadyState.OPEN;
                        ptStopStatus = ReadyState.OPEN;
                        setStatus({
                            ptRoute: ptRouteStatus,
                            ptStop: ptStopStatus,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        ptStopStatus = ReadyState.CLOSED;
                    });
            })
            .catch((err) => {
                console.error(err);
                ptRouteStatus = ReadyState.CLOSED;
            });
    });
};

/**
 * For each stop, add route line lists that contains the stop to the field 'routes'
 * @param routes all the routes
 * @param stops all the stops
 * return the stops with added route line lists
 */
const addLineNumberToStops = (
    routes: FeatureRecord<PTRouteFeature>,
    stops: FeatureRecord<PTStopFeature>,
): FeatureRecord<PTStopFeature> => {
    const res = deepcopy(stops);
    Object.values(routes).forEach((route) => {
        route.properties.stops_ids.forEach((stopId) => {
            res[stopId].properties.routes.push(route.properties.line_number);
        });
    });
    // Remove duplicate routes in a stop
    Object.values(res).forEach((stop) => {
        stop.properties.routes = stop.properties.routes.sort().filter((v, i, a) => a.indexOf(v) == i);
    });
    return res;
};

const getRouteTypeString = (value: number): string => {
    const routeTypeString = Object.keys(RouteType).find((key) => RouteType[key as keyof typeof RouteType] === value);

    return routeTypeString ? routeTypeString : 'Other';
};

const getRouteColor = (type: string): string => {
    if (type === '') {
        type = 'Other';
    }
    const value = vehicleTypes.get(type);
    return value === undefined ? 'black' : value.color;
};

const getWheelchairBoarding = (value: number): string => {
    return wheelchairBoarding[value ? value : 0];
};

// Function to sort stops
const sortStops = (ptRoute: PTRouteFeature, stopGeometries: number[][], stops: PTStopFeature[]): PTStopFeature[] => {
    const sortedStops: PTStopFeature[] = new Array(stopGeometries.length).fill(null);

    // For finding the indices of the stop coordinates from the route coordinates
    const routeCoordinates = ptRoute.geometry.coordinates;

    // The places of the coordinates of the stops in the route
    // Each entry of the coordinateIndices: [The place of the coordinate of a stop in the route, The original index of the stop]
    const coordinateIndices = stopGeometries.map((stopCoordinate: number[], index: number) => [
        findClosestPointIndex(stopCoordinate, routeCoordinates),
        index,
    ]);

    // Sort the function with the correct indices order
    coordinateIndices
        .sort((a: number[], b: number[]) => a[0] - b[0])
        .forEach((coordinateIndex: number[], index: number) => {
            sortedStops[index] = stops[coordinateIndex[1]];
        });

    return sortedStops;
};

// After sorting, it is found that some cases there are duplicate stops next to each other, remove one of them.
const removeDuplicateStops = (sortedStops: PTStopFeature[]): PTStopFeature[] => {
    return sortedStops.reduce((processedStops: PTStopFeature[], stop: PTStopFeature, index: number) => {
        if (index === sortedStops.length - 1 || stop.properties.stopId !== sortedStops[index + 1].properties.stopId) {
            return [...processedStops, stop];
        }
        return processedStops;
    }, []);
};
