import * as turf from '@turf/turf';
import RBush from 'rbush';

const findMatchingRoutes = (vehicle: PTVechileProperties, routeTree: React.MutableRefObject<RBush<PTRouteIndex>>) => {
    // Find corresponding road
    const vehiclePoint = turf.point([vehicle.longitude, vehicle.latitude]);

    // Query the spatial index to find intersecting route bounding boxes
    let intersectingBB = routeTree.current.search({
        minX: vehicle.longitude,
        minY: vehicle.latitude,
        maxX: vehicle.longitude,
        maxY: vehicle.latitude,
    });

    // Find actual roads the vehicle point intersects
    intersectingBB = intersectingBB
        .filter((bbox: PTRouteIndex) => !turf.booleanDisjoint(turf.buffer(vehiclePoint, 0.005), bbox.route.geometry)) // Use a buffer of 5 meters radius
        .filter((route: PTRouteIndex) => route.route.properties.agency_id === vehicle.dataOwnerCode);
    return intersectingBB;
};
export default findMatchingRoutes;
