// Define the haversine function
const haversine = (coord1: number[], coord2: number[]): number => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const earthRadius = 6371e3; // Earth radius in meters
    const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const lat1Rad = degreesToRadians(lat1);
    const lat2Rad = degreesToRadians(lat2);
    const deltaLat = degreesToRadians(lat2 - lat1);
    const deltaLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
};

// Function to find the index of the closest point in the route's coordinate list
export const findClosestPointIndex = (stopCoord: number[], routeCoords: number[][]): number => {
    let minDistance = Infinity;
    let closestIndex = -1;

    for (let i = 0; i < routeCoords.length; i++) {
        const distance = haversine(stopCoord, routeCoords[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    }

    return closestIndex;
};
