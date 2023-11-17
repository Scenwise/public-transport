import { Marker, Popup } from 'mapbox-gl';
import RBush from 'rbush';
import { useEffect, useState } from 'react';

import { COLOR_VEHICLE_DEFAULT } from '../../data/layerPaints';
import animateVehicles from './animateVehicles';
import findMatchingRoutes from './findMatchingRoutes';

// Create websocket connection
export const useKV6Websocket = (
    map: mapboxgl.Map | null,
    routeTree: React.MutableRefObject<RBush<PTRouteIndex>>,
    routesData: PTRouteFeature[],
): void => {
    // Keys are of format: "[DataOwnerCode]-[VehicleNumber]"
    const [vehicleMarkers, setVehicleMarkers] = useState(new Map<string, VehicleRoutePair>());

    // eslint-disable-next-line sonarjs/cognitive-complexity
    useEffect(() => {
        const webSocketURL = 'wss://prod.dataservice.scenwise.nl/kv6';
        const socket = new WebSocket(webSocketURL);

        socket.onopen = () => {
            const message = JSON.stringify({
                Command: {
                    Set: {
                        Select: {
                            Stream: true,
                            timeStart: Date.now() - 20000, // start about 20 seconds before current time
                            timeStop: 1918892497000, // stop sometime in 2030
                            region_ID: 'Netherlands',
                        },
                    },
                },
            });

            // Send the message to the server
            socket.send(message);
            setTimeout(() => 5000);
        };

        // On each socket message, process vehicles and find their corresponding route
        socket.onmessage = (event) => {
            const message = event.data; // Take the data of the websocket message
            if (message === 'Successfully connected!') console.log(message);
            else {
                const packets = JSON.parse(message).Packet;
                for (const packet of packets) {
                    const vehicle = JSON.parse(packet.Payload) as PTVechileProperties;
                    // Only process vehicles that have info about both delay and position; only process once routes data is loaded
                    if (
                        vehicle.messageType === 'ONROUTE' &&
                        vehicle.rdX !== -1 &&
                        vehicle.rdY !== -1 &&
                        vehicle.longitude &&
                        vehicle.latitude &&
                        map !== null &&
                        routesData !== null
                    ) {
                        // If we already have this vehicle in move, set it to next position and update the map
                        const mapKey = vehicle.dataOwnerCode + '-' + vehicle.vehicleNumber;
                        const vehicleRoutePair = vehicleMarkers.get(mapKey);
                        // Only process movement if timestamp of last move is before timestamp of current move
                        if (vehicleRoutePair !== undefined && vehicleRoutePair.vehicle.timestamp < vehicle.timestamp) {
                            const correct = animateVehicles(
                                vehicleRoutePair,
                                [vehicle.longitude, vehicle.latitude],
                                map,
                            );
                            if (correct) {
                                setVehicleMarkers(
                                    new Map(
                                        vehicleMarkers.set(mapKey, {
                                            marker: vehicleRoutePair.marker,
                                            route: vehicleRoutePair.route,
                                            vehicle: vehicle, // update delay, timestamp, position
                                        }),
                                    ),
                                );
                            }
                            // If we misintersected, remove marker completely and try again on next update
                            else {
                                vehicleMarkers.get(mapKey)?.marker.remove();
                                vehicleMarkers.delete(mapKey);
                                setVehicleMarkers(new Map(vehicleMarkers));
                            }
                        }

                        // If we do not have this vehicle, find its route
                        else if (vehicleRoutePair === undefined) {
                            const intersectedRoads = findMatchingRoutes(vehicle, routeTree);
                            if (intersectedRoads.length === 1) {
                                const popup = new Popup().setText(
                                    'Route: ' +
                                        intersectedRoads[0].route.properties.line_number +
                                        '\nVehicle: ' +
                                        mapKey,
                                );
                                const marker = new Marker({ color: COLOR_VEHICLE_DEFAULT })
                                    .setLngLat([vehicle.longitude, vehicle.latitude])
                                    .addTo(map)
                                    .setPopup(popup);
                                setVehicleMarkers(
                                    new Map(
                                        vehicleMarkers.set(mapKey, {
                                            marker: marker,
                                            route: intersectedRoads[0].route,
                                            vehicle: vehicle,
                                        }),
                                    ),
                                );
                            }
                        }
                    }
                }
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };

        return () => {
            socket.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routesData]);
};
