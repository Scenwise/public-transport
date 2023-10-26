import { ReadyState } from '../data/data';
import getGtfsTable from './apiFunction';

/**
 * Fetch the routes data and store the routes as a record(map) with the key of the shape id.
 * @param setPTRoutes Function to set the routes record
 */
export const addPTRoutes = async (
    setPTRoutes: (ptRoutes: FeatureRecord<PTRouteFeature>) => void,
    ptRoutesWithStops: FeatureRecord<PTRouteFeature>,
): Promise<ReadyState> => {
    return new Promise((resolve) => {
        const ptRoutesData = getGtfsTable('gtfs_shapes_agency_vehicle_type_number_stops_info');

        // Update the status of the data loading
        if (!ptRoutesData) resolve(ReadyState.CLOSED);

        // Handle the response of the ptRoutes
        ptRoutesData
            .then((ptRoutesRes) => {
                const ptRoutes = {} as FeatureRecord<PTRouteFeature>;

                ptRoutesRes.features.forEach((feature) => {
                    const id = '' + feature.id; //the id is shape_id which is a number
                    const ptRouteFeature = JSON.parse(JSON.stringify(feature));
                    ptRouteFeature.stops_ids = ptRoutesWithStops[id].properties.stops_ids;
                    ptRoutes[id] = ptRouteFeature as PTRouteFeature;
                });

                setPTRoutes(ptRoutes);
                resolve(ReadyState.OPEN);
            })
            .catch((err) => {
                console.error(err);
                resolve(ReadyState.CLOSED);
            });
    });
};

/**
 * Fetch the routes data and store the routes as a record(map) with the key of the shape id.
 * @param setPTRoutes Function to set the routes record
 */
export const addPublicTransportData = async (
    setPTRoutes: (ptRoutes: FeatureRecord<PTRouteFeature>) => void,
    setPTStops: (ptStops: FeatureRecord<PTStopFeature>) => void,
    setStatus: (status: Status) => void,
): Promise<Status> => {
    return new Promise((_) => {
        let ptRouteStatus = ReadyState.CONNECTING;
        let ptStopStatus = ReadyState.CONNECTING;
        setStatus({
            ptRoute: ptRouteStatus,
            ptStop: ptStopStatus,
        });

        const ptRoutesData = getGtfsTable('gtfs_shapes_agency_vehicle_type_number_stops_info');
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
                            ptRoutes[id] = feature as PTRouteFeature;
                        });

                        // Initialize the stops data
                        const ptStops = {} as FeatureRecord<PTStopFeature>;

                        ptStopsRes.features.forEach((feature) => {
                            const id = '' + feature.id; //the id is shape_id which is a number

                            const stopProperties = JSON.parse(JSON.stringify(feature.properties));
                            const stopIds = stopProperties.stops_ids;
                            const stopNames = stopProperties.stop_names;
                            const stopGeometries = JSON.parse(JSON.stringify(feature.geometry)).coordinates;

                            // Add the stop ids to the route
                            ptRoutes[id].properties.stops_ids = stopIds;

                            stopIds.forEach((id: string, index: number) => {
                                const stopFeature = {
                                    id: id,
                                    type: 'Feature',
                                    geometry: { type: 'Point', coordinates: stopGeometries[index] },
                                    properties: {
                                        stopId: id,
                                        stopName: stopNames[index],
                                    },
                                };
                                ptStops[id] = stopFeature as PTStopFeature;
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
/**
 * Fetch the stops data and store the stops as a record(map) with the key of the stop id.
 * There will be a list of stops ids stored in each route properties and the stop information can be found in this stop record
 * @param setPTStops Function to set the stops record
 */
export const addPTStops = async (
    setPTStops: (ptStops: FeatureRecord<PTStopFeature>) => void,
    setPTRoutes: (ptStops: FeatureRecord<PTRouteFeature>) => void,
): Promise<ReadyState> => {
    return new Promise((resolve) => {
        const ptStopsData = getGtfsTable('gtfs_stop_shape_ids_geom');
        if (!ptStopsData) resolve(ReadyState.CLOSED);

        ptStopsData
            .then((ptStopsRes) => {
                const ptRoutes = {} as FeatureRecord<PTRouteFeature>;
                // TODO: when routes are loaded, put this into the routes
                // ptRoutesRes.features.forEach((feature) => {
                //     const id = "" + feature.id //the id is shape_id which is a number
                //     ptRoutes[id] = feature as PTRouteFeature
                // })

                const ptStops = {} as FeatureRecord<PTStopFeature>;

                console.log(ptStopsRes.features);

                ptStopsRes.features.forEach((feature) => {
                    const id = '' + feature.id; //the id is shape_id which is a number

                    const stopProperties = JSON.parse(JSON.stringify(feature.properties));
                    const stopIds = stopProperties.stops_ids;
                    const stopNames = stopProperties.stop_names;
                    const stopGeometries = JSON.parse(JSON.stringify(feature.geometry)).coordinates;
                    // console.log({properties: {stops_ids: stopIds} as PTRouteProperties} as PTRouteFeature)

                    // Add the stop ids to the route
                    ptRoutes[id] = {
                        ...ptRoutes[id],
                        properties: { stops_ids: stopIds } as PTRouteProperties,
                    } as PTRouteFeature;

                    stopIds.forEach((id: string, index: number) => {
                        const stopFeature = {
                            id: id,
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: stopGeometries[index] },
                            properties: {
                                stopId: id,
                                stopName: stopNames[index],
                            },
                        };
                        ptStops[id] = stopFeature as PTStopFeature;
                    });
                });
                setPTStops(ptStops);
                setPTRoutes(ptRoutes);
                resolve(ReadyState.OPEN);
            })
            .catch((err) => {
                console.error(err);
                resolve(ReadyState.CLOSED);
            });
    });
};
