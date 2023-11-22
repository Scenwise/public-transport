import { ReadyState, RouteType } from '../../data/data';
import getGtfsTable from './apiFunction';

/**
 * Fetch the routes data and store the routes as a record(map) with the key of the shape id.
 * @param setPTRoutes Function to set the routes record
 * @param setPTStops Function to set the stops record
 * @param setStatus Function to set the routes and stops loading status
 */
export const addPublicTransportData = async (
    setPTRoutes: (ptRoutes: FeatureRecord<PTRouteFeature>) => void,
    setPTStops: (ptStops: FeatureRecord<PTStopFeature>) => void,
    setStatus: (status: Status) => void,
): Promise<Status> => {
    return new Promise(() => {
        let ptRouteStatus = ReadyState.CONNECTING;
        let ptStopStatus = ReadyState.CONNECTING;
        setStatus({
            ptRoute: ptRouteStatus,
            ptStop: ptStopStatus,
        });

        const ptRoutesData = getGtfsTable('gtfs_shapes_agency_vehicle_type_number_stops_info_corrected');
        const ptStopsData = getGtfsTable('gtfs_stop_shape_ids_geom');

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

                        ptRoutesRes.features.forEach((feature) => {
                            const id = '' + feature.id; //the id is shape_id which is a number
                            const ptRoutesProperties = {
                                origin: feature.properties?.origin,
                                route_id: feature.properties?.route_id,
                                shape_id: feature.properties?.shape_id,
                                agency_id: feature.properties?.agency_id,
                                destination: feature.properties?.destinatio,
                                line_number: feature.properties?.line_numbe,
                                route_name: feature.properties?.route_name,
                                vehicle_type: feature.properties?.vehicle_ty,
                                route_type: getRouteTypeString(feature.properties?.route_type),
                                route_color: feature.properties?.route_color
                                    ? '#' + feature.properties?.route_color
                                    : null,
                            } as PTRouteProperties;
                            ptRoutes[id] = {
                                geometry: {
                                    type: 'LineString',
                                    coordinates: (feature.geometry as GeoJSON.MultiLineString).coordinates[0],
                                },
                                properties: ptRoutesProperties,
                            } as PTRouteFeature;
                        });

                        // Initialize the stops data
                        const ptStops = {} as FeatureRecord<PTStopFeature>;

                        ptStopsRes.features.forEach((feature) => {
                            const id = '' + feature.id; //This id is shape_id which is a number

                            // The stop properties to be put on the table
                            const stopProperties = JSON.parse(JSON.stringify(feature.properties));
                            const stopIds: string[] = stopProperties.stops_ids;
                            const stopNames: string[] = stopProperties.stop_names;
                            const stopGeometries = JSON.parse(JSON.stringify(feature.geometry)).coordinates;

                            const stops: PTStopFeature[] = stopIds.map((stopId, index) => ({
                                id: stopId,
                                type: 'Feature',
                                geometry: { type: 'Point', coordinates: stopGeometries[index] },
                                properties: {
                                    stopId: stopId,
                                    stopName: stopNames[index],
                                },
                            }));

                            const sortedStops: PTStopFeature[] = removeDuplicateStops(
                                sortStops(ptRoutes[id], stopGeometries, stops),
                            );

                            // Add the stop ids to the route
                            ptRoutes[id].properties.stops_ids = sortedStops.map((stop) => stop.properties.stopId);

                            // Store each individual stops into the general stop map.
                            sortedStops.forEach((stop: PTStopFeature) => {
                                ptStops[stop.properties.stopId] = stop;
                            });
                        });

                        setPTStops(ptStops);
                        setPTRoutes(ptRoutes);
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

const getRouteTypeString = (value: number): string => {
    const routeTypeString = Object.keys(RouteType).find((key) => RouteType[key as keyof typeof RouteType] === value);

    return routeTypeString ? routeTypeString : '';
};

// Function to sort stops
const sortStops = (ptRoute: PTRouteFeature, stopGeometries: number[][], stops: PTStopFeature[]): PTStopFeature[] => {
    const sortedStops: PTStopFeature[] = new Array(stopGeometries.length).fill(null);

    // For finding the indices of the stop coordinates from the route coordinates
    // (the decimal need to be limited in order to match up)
    const routeCoordinates = ptRoute.geometry.coordinates.map((coordinate) => limitDecimalPlaces(coordinate));
    const limitDecimalStopGeometries = stopGeometries.map((coordinate: number[]) => limitDecimalPlaces(coordinate));

    // The places of the coordinates of the stops in the route
    // Each entry of the coordinateIndices: [The place of the coordinate of a stop in the route, The original index of the stop]
    const coordinateIndices = limitDecimalStopGeometries.map((stopCoordinate: number[], index: number) => [
        routeCoordinates.findIndex((routeCoordinate) => arraysMatch(stopCoordinate, routeCoordinate)),
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

// Function to limit decimal places to four
const limitDecimalPlaces = (coordinates: number[]): number[] => {
    return [Number(coordinates[0].toFixed(3)), Number(coordinates[1].toFixed(3))];
};

// Function to compare arrays by values
const arraysMatch = (arr1: number[], arr2: number[]): boolean => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
};
