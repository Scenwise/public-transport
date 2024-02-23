import _ from 'lodash';
import { Marker } from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { ReadyState } from '../../data/data';
import {
    removeFilteredRouteBasedOnDelay,
    removeVehicleFromPTRoute,
    updateFilteredRoute,
    updatePTRoute,
} from '../../dataStoring/slice';
import { checkFilteredRoutePerVehicle } from '../../methods/filter/filteredRouteUtilities';
import animateVehicles from '../../methods/vehicles/animateVehicles';
import {
    getMarkerColorBasedOnVehicleType,
    getVehiclePopup,
    handleMarkerOnClick,
} from '../../methods/vehicles/vehicleMarkerUtilities';
import { RootState, useAppSelector } from '../../store';
import { mutableFilters } from '../filterHook/useUpdateRoutesWithFilter';

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
    const stops = useAppSelector((state) => state.slice.ptStops);
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
                                // animateVehicles returns true if the route and vehicle are matched correctly and false otherwise
                                const correct = animateVehicles(
                                    vehicleRoutePair,
                                    routesMap,
                                    vehicle.geometry.coordinates,
                                );
                                if (correct) {
                                    // Update the vehicle with the new delay,timestamp, and position
                                    setVehicleMarkers(
                                        new Map(
                                            vehicleMarkers.set(vehicleId, {
                                                marker: vehicleRoutePair.marker,
                                                routeId: vehicleRoutePair.routeId,
                                                vehicle: vehicle,
                                            }),
                                        ),
                                    );
                                    // Check based on filterings if we can add the marker to the map (only if new delay is higher than before and >=0)
                                    if (
                                        vehicle.properties.punctuality >= 0 &&
                                        vehicleRoutePair.vehicle.properties.punctuality <
                                            vehicle.properties.punctuality &&
                                        checkFilteredRoutePerVehicle(
                                            routesMap[vehicleRoutePair.routeId],
                                            mutableFilters,
                                            stops,
                                            vehicle.properties.punctuality,
                                        )
                                    ) {
                                        vehicleRoutePair.marker.addTo(map);
                                        dispatch(updateFilteredRoute(vehicleRoutePair.routeId));
                                    }
                                }
                                // If we misintersected, remove marker completely and try again on next update
                                else {
                                    vehicleMarkers.get(vehicleId)?.marker.remove();
                                    vehicleMarkers.delete(vehicleId);
                                    setVehicleMarkers(new Map(vehicleMarkers));
                                    // Remove vehicle from route
                                    dispatch(
                                        removeVehicleFromPTRoute({
                                            vehicle: vehicleId,
                                            route: vehicleRoutePair.routeId,
                                        }),
                                    );
                                    // Remove route from map if it has all filtered properties, but no vehicles on it and the delay filter is on
                                    dispatch(
                                        removeFilteredRouteBasedOnDelay({
                                            vehicleMarkers: vehicleMarkers,
                                            route: vehicleRoutePair.routeId,
                                        }),
                                    );
                                }
                            }

                            // If we do not have this vehicle, find its route
                            else if (vehicleRoutePair === undefined) {
                                const intersectedRoad = routesMap[stopsToRoutesMap[vehicle.properties.userStopCode]];
                                if (intersectedRoad !== undefined) {
                                    const routeId = intersectedRoad.properties.shape_id + '';
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

                                    // Add vehicle id to its route (used to fly to the vehicle when its route is selected)
                                    dispatch(updatePTRoute({ vehicle: vehicleId, route: routeId }));
                                    setVehicleMarkers(
                                        new Map(
                                            vehicleMarkers.set(vehicleId, {
                                                marker: marker,
                                                routeId: routeId,
                                                vehicle: vehicle,
                                            }),
                                        ),
                                    );

                                    // Check based on filterings if we can add the marker to the map
                                    if (
                                        checkFilteredRoutePerVehicle(
                                            intersectedRoad,
                                            mutableFilters,
                                            stops,
                                            vehicle.properties.punctuality,
                                        )
                                    ) {
                                        marker.addTo(map);
                                        dispatch(updateFilteredRoute(routeId));
                                    }
                                    handleMarkerOnClick(
                                        marker,
                                        selectedMarker,
                                        vehicleId,
                                        dispatch,
                                        intersectedRoad.properties.shape_id,
                                        map,
                                    );
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
