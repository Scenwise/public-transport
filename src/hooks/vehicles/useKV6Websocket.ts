import { Marker, Popup } from 'mapbox-gl';
import RBush from 'rbush';
import { useEffect } from 'react';

import animateVehicles from './animateVehicles';
import findMatchingRoute from './findMatchingRoute';
import { getMarkerColorBasedOnVehicleType, getVehiclePopupText } from './vehicleMarkerUtilities';

// Create websocket connection
export const useKV6Websocket = (
    mapInitialized: boolean,
    map: mapboxgl.Map | null,
    routeTree: RBush<PTRouteIndex>,
    routesMap: FeatureRecord<PTRouteFeature>,
    vehicleMarkers: Map<string, VehicleRoutePair>,
    setVehicleMarkers: React.Dispatch<React.SetStateAction<Map<string, VehicleRoutePair>>>,
    loadedTree: React.MutableRefObject<boolean>,
): void => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    useEffect(() => {
        if (map && mapInitialized && routesMap && loadedTree.current) {
            const webSocketURL = 'wss://prod.dataservice.scenwise.nl/kv6';
            const socket = new WebSocket(webSocketURL);

            socket.onopen = () => {
                setTimeout(() => 5000);
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
            };

            // On each socket message, process vehicles and find their corresponding route
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const _ = require('lodash');
            socket.onmessage = _.throttle((event: MessageEvent) => {
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
                            vehicle.latitude
                        ) {
                            // If we already have this vehicle in move, set it to next position and update the map
                            const mapKey = vehicle.dataOwnerCode + '-' + vehicle.vehicleNumber;
                            const vehicleRoutePair = vehicleMarkers.get(mapKey);
                            // Only process movement if timestamp of last move is before timestamp of current move
                            if (
                                vehicleRoutePair !== undefined &&
                                vehicleRoutePair.vehicle.timestamp < vehicle.timestamp
                            ) {
                                // animateVehicles returns true if the route and vehicle are matched correctly and false
                                const correct = animateVehicles(vehicleRoutePair, routesMap, [
                                    vehicle.longitude,
                                    vehicle.latitude,
                                ]);
                                if (correct) {
                                    setVehicleMarkers(
                                        new Map(
                                            vehicleMarkers.set(mapKey, {
                                                marker: vehicleRoutePair.marker,
                                                routeId: vehicleRoutePair.routeId,
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
                                const intersectedRoad = findMatchingRoute(vehicle, routeTree);
                                if (intersectedRoad != null) {
                                    const popup = new Popup().setHTML(
                                        getVehiclePopupText(
                                            mapKey,
                                            intersectedRoad.route.properties.line_number,
                                            vehicle.punctuality,
                                        ),
                                    );
                                    const marker = new Marker({
                                        color: getMarkerColorBasedOnVehicleType(
                                            intersectedRoad.route.properties.route_type,
                                        ),
                                    })
                                        .setLngLat([vehicle.longitude, vehicle.latitude])
                                        .addTo(map)
                                        .setPopup(popup);
                                    setVehicleMarkers(
                                        new Map(
                                            vehicleMarkers.set(mapKey, {
                                                marker: marker,
                                                routeId: intersectedRoad.route.properties.shape_id + '',
                                                vehicle: vehicle,
                                            }),
                                        ),
                                    );
                                }
                            }
                        }
                    }
                }
            }, 250);

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onclose = (event) => {
                console.log('WebSocket closed:', event);
            };

            return () => {
                socket.close();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routesMap]);
};
