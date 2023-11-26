import * as turf from '@turf/turf';
import RBush from 'rbush';

const findMatchingRoute = (vehicle: PTVechileProperties, routeTree: RBush<PTRouteIndex>): PTRouteIndex | null => {
    // Find corresponding road
    const vehiclePoint = turf.point([vehicle.longitude, vehicle.latitude]);

    // Query the spatial index to find intersecting route bounding boxes
    const matchingBoxes = routeTree
        .search({
            minX: vehicle.longitude,
            minY: vehicle.latitude,
            maxX: vehicle.longitude,
            maxY: vehicle.latitude,
        })
        .filter((route: PTRouteIndex) => route.route.properties.agency_id === vehicle.dataOwnerCode);

    // Find the route the vehicle is on
    let bufferSize = 0.001; // Start with a 1 meter buffer
    if (matchingBoxes.length === 0) return null; // We found no matches from the same agency

    while (bufferSize <= 0.007) {
        // Find the routes the vehicle geometrically intersects
        const foundRoute = matchingBoxes.filter(
            (bbox: PTRouteIndex) => !turf.booleanDisjoint(turf.buffer(vehiclePoint, bufferSize), bbox.route.geometry),
        );
        // If we already found more than one match, return null, since a bigger buffer size does not help with reducing the number of matches
        if (foundRoute.length > 1) return null;
        // If we found an unique match for the vehicle, we return it
        if (foundRoute.length === 1) return foundRoute[0];
        // Else, we increase our searching area (up to 7 meters)
        bufferSize += 0.002;
    }
    return null;
};
export default findMatchingRoute;
