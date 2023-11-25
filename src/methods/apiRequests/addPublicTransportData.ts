import { MultiLineString } from '@turf/turf';

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
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .then((ptStopsRes) => {
                        // Initialize the routes data
                        const ptRoutes = {} as FeatureRecord<PTRouteFeature>;

                        if (ptRoutesRes.features === undefined)
                            throw new Error('The data failed to fetch: ' + ptRoutesRes);
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
                                geometry: feature.geometry as MultiLineString,
                                properties: ptRoutesProperties,
                            } as PTRouteFeature;
                        });

                        // Initialize the stops data
                        const ptStops = {} as FeatureRecord<PTStopFeature>;
                        // if (ptStopsRes.features === undefined)
                        //     throw new Error('The data failed to fetch: ' + ptStopsRes);
                        // ptStopsRes.features.forEach((feature) => {
                        //     const id = '' + feature.id; //the id is shape_id which is a number

                        //     const stopProperties = JSON.parse(JSON.stringify(feature.properties));
                        //     const stopIds = stopProperties.stops_ids;
                        //     const stopNames = stopProperties.stop_names;
                        //     const stopGeometries = JSON.parse(JSON.stringify(feature.geometry)).coordinates;

                        //     // Add the stop ids to the route
                        //     ptRoutes[id].properties.stops_ids = stopIds;

                        //     stopIds.forEach((id: string, index: number) => {
                        //         const stopFeature = {
                        //             id: id,
                        //             type: 'Feature',
                        //             geometry: { type: 'Point', coordinates: stopGeometries[index] },
                        //             properties: {
                        //                 stopId: id,
                        //                 stopName: stopNames[index],
                        //             },
                        //         };
                        //         ptStops[id] = stopFeature as PTStopFeature;
                        //     });
                        // });

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
