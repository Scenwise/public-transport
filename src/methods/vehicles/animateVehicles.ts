import * as turf from '@turf/turf';
import { Popup } from 'mapbox-gl';

import { getVehiclePopupText } from './vehicleMarkerUtilities';

const animateVehicles = (
    vehicleRoutePair: VehicleRoutePair,
    routesMap: FeatureRecord<PTRouteFeature>,
    newPosition: Array<number>,
) => {
    // Find the route from the routes map
    const route = routesMap[vehicleRoutePair.routeId];
    // Display the new vehicle delay
    const popup = new Popup().setHTML(
        getVehiclePopupText(
            vehicleRoutePair.vehicle.dataOwnerCode + '-' + vehicleRoutePair.vehicle.vehicleNumber,
            route.properties,
            vehicleRoutePair.vehicle.punctuality,
        ),
    );
    vehicleRoutePair.marker.setPopup(popup);

    const line = route.geometry.coordinates;

    // Find current and new positions on route and slice the route to that zone only
    const convertedLine = turf.featureCollection(
        line.map((x: Array<number>) => turf.point(x)) as turf.Feature<turf.Point, turf.Properties>[],
    );
    const startPosition = turf.nearestPoint(vehicleRoutePair.marker.getLngLat().toArray(), convertedLine).geometry
        .coordinates;
    const endPosition = turf.nearestPoint(newPosition, convertedLine).geometry.coordinates;

    // If distance between actual location and route is > 50 meters, delete the match (vehicle changed its route)
    if (turf.pointToLineDistance(turf.point(newPosition), turf.lineString(line)) > 0.05) return false;

    const startIndex = line.findIndex(
        (coord: Array<number>) => coord[0] === startPosition[0] && coord[1] === startPosition[1],
    );
    const endIndex = line.findIndex(
        (coord: Array<number>) => coord[0] === endPosition[0] && coord[1] === endPosition[1],
    );

    let increment = 1;
    if (startIndex > endIndex) increment = -1; // if start is after end in the route, we move backwards

    let counter = startIndex;
    function animate() {
        // If decreasing, we start from endIndex
        if (counter === endIndex + increment) return;
        vehicleRoutePair.marker.setLngLat([line[counter][0], line[counter][1]]);

        // Request the next frame of animation
        counter += increment;
        requestAnimationFrame(animate);
    }

    animate();
    return true;
};

export default animateVehicles;
