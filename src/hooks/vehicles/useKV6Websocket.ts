import _ from 'lodash';
import { Marker } from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { ReadyState, filteredRouteIds, mutableCurrentDelay } from '../../data/data';
import { updatePTRoute } from '../../dataStoring/slice';
import animateVehicles from '../../methods/vehicles/animateVehicles';
import {
    getMarkerColorBasedOnVehicleType,
    getVehiclePopup,
    handleMarkerOnClick,
} from '../../methods/vehicles/vehicleMarkerUtilities';
import { RootState, useAppSelector } from '../../store';

// Create websocket connection
export const useKV6Websocket = (
    mapInitialized: boolean,
    map: mapboxgl.Map | null,
    vehicleMarkers: Map<string, VehicleRoutePair>,
    setVehicleMarkers: React.Dispatch<React.SetStateAction<Map<string, VehicleRoutePair>>>,
): void => {
    const dispatch = useDispatch();
    const status = useAppSelector((state) => state.slice.status);
    const stopsToRoutesMap = useAppSelector((state: RootState) => state.slice.stopCodeToRouteMap);
    const routesMap = useAppSelector((state: RootState) => state.slice.ptRoutes);
    const selectedMarker = useRef<SelectedMarkerColor>({} as SelectedMarkerColor);

    // eslint-disable-next-line sonarjs/cognitive-complexity
    useEffect(() => {
        if (status.ptRoute !== ReadyState.OPEN) return;
        if (map && mapInitialized && routesMap) {
            const webSocketURL = 'wss://prod.dataservice.scenwise.nl/kv6';
            const socket = new WebSocket(webSocketURL);

            socket.onopen = () => {
                setTimeout(() => 7000);
                const message = JSON.stringify({
                    Command: {
                        Set: {
                            Select: {
                                Stream: true,
                                timeStart: Date.now() - 20000, // start about 20 seconds before current time
                                timeStop: 1918892497000, // stop sometime in 2030
                                region_ID: 'Noord-Holland', // Currently noord-holland is hard coded for testing
                            },
                        },
                    },
                });

                // Send the message to the server
                socket.send(message);
            };

            // On each socket message, process vehicles and find their corresponding route
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            socket.onmessage = _.throttle((event: MessageEvent) => {
                const message = event.data; // Take the data of the websocket message
                if (message === 'Successfully connected!') console.log(message);
                else {
                    const packets = JSON.parse(message).Packet;
                    for (const packet of packets) {
                        const payload = JSON.parse(packet.Payload);
                        const { latitude, longitude, ...properties } = payload;
                        const vehicle = {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [longitude, latitude], // Assuming longitude comes before latitude
                            },
                            properties: properties, // Include other properties from payload
                        } as PTVehicleFeature;
                        // Only process vehicles that have info about both delay and position; only process once routes data is loaded
                        if (
                            vehicle.properties.messageType === 'ONROUTE' &&
                            vehicle.properties.rdX !== -1 &&
                            vehicle.properties.rdY !== -1 &&
                            vehicle.geometry.coordinates[0] &&
                            vehicle.geometry.coordinates[1]
                        ) {
                            // If we already have this vehicle in move, set it to next position and update the map
                            const vehicleId = vehicle.properties.dataOwnerCode + '-' + vehicle.properties.vehicleNumber;
                            const vehicleRoutePair = vehicleMarkers.get(vehicleId);
                            // Only process movement if timestamp of last move is before timestamp of current move
                            if (
                                vehicleRoutePair !== undefined &&
                                vehicleRoutePair.vehicle.properties.timestamp < vehicle.properties.timestamp
                            ) {
                                // animateVehicles returns true if the route and vehicle are matched correctly and false
                                const correct = animateVehicles(
                                    vehicleRoutePair,
                                    routesMap,
                                    vehicle.geometry.coordinates,
                                );
                                if (correct) {
                                    setVehicleMarkers(
                                        new Map(
                                            vehicleMarkers.set(vehicleId, {
                                                marker: vehicleRoutePair.marker,
                                                routeId: vehicleRoutePair.routeId,
                                                vehicle: vehicle, // update delay, timestamp, position
                                            }),
                                        ),
                                    );
                                }
                                // TODO: if delay is more than limit, add it to the map
                                // If we misintersected, remove marker completely and try again on next update
                                else {
                                    vehicleMarkers.get(vehicleId)?.marker.remove();
                                    vehicleMarkers.delete(vehicleId);
                                    setVehicleMarkers(new Map(vehicleMarkers));
                                    //TODO: remove vehicle from route vehicle ids if we delete it
                                }
                            }

                            // If we do not have this vehicle, find its route
                            else if (vehicleRoutePair === undefined) {
                                const intersectedRoad = routesMap[stopsToRoutesMap[vehicle.properties.userStopCode]];
                                if (intersectedRoad !== undefined) {
                                    const marker = new Marker({
                                        color: getMarkerColorBasedOnVehicleType(intersectedRoad.properties.route_type),
                                    })
                                        .setLngLat([vehicle.geometry.coordinates[0], vehicle.geometry.coordinates[1]])
                                        .setPopup(
                                            getVehiclePopup(
                                                vehicleId,
                                                intersectedRoad.properties,
                                                vehicle.properties.punctuality,
                                                vehicle.properties.timestamp,
                                            ),
                                        );
                                    // Check based on filterings if we can add the marker to the map
                                    // First, we check the delay condition (-1 is the initial delay value)
                                    // eslint-disable-next-line sonarjs/no-collapsible-if
                                    if (
                                        mutableCurrentDelay[0] == -1 ||
                                        vehicle.properties.punctuality >= mutableCurrentDelay[0] * 60
                                    ) {
                                        // If we have the route on the map already, add it
                                        if (filteredRouteIds.has(intersectedRoad.properties.shape_id + '')) {
                                            marker.addTo(map);
                                        }
                                        // TODO: verify that the intersectedRoad satisfies all filters before adding it to the map
                                        // // If not, we need to add the route in the filtered routes
                                        // else {
                                        //     dispatch(updateFilteredRoute(intersectedRoad));
                                        //     marker.addTo(map);
                                        // }
                                    }

                                    handleMarkerOnClick(
                                        marker,
                                        selectedMarker,
                                        vehicleId,
                                        dispatch,
                                        intersectedRoad.properties.shape_id,
                                        map,
                                    );

                                    // Add vehicle id to its route (used to fly to the vehicle when its route is selected)
                                    const pair = {
                                        marker: marker,
                                        routeId: intersectedRoad.properties.shape_id + '',
                                        vehicle: vehicle,
                                    };
                                    dispatch(updatePTRoute(pair));
                                    setVehicleMarkers(new Map(vehicleMarkers.set(vehicleId, pair)));
                                }
                            }
                        }
                    }
                }
            }, 10);

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
    }, [status]);
};
