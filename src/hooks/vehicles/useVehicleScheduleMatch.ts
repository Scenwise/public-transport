/* eslint-disable */
import { useEffect } from 'react';

import { groupStopsBySequence } from '../../methods/apiRequests/addSchedule';
import { getRouteSchedule } from '../../methods/apiRequests/apiFunction';
import { useAppSelector } from '../../store';

export const useVehicleScheduleMatch = (vehicleMarkers: Map<string, VehicleRoutePair>): void => {
    const vehicleId = useAppSelector((state) => state.slice.lastVehicle);
    const routes = useAppSelector((state) => state.slice.ptRoutes);
    const stops = useAppSelector((state) => state.slice.ptStops);
    const vehicle = vehicleMarkers.get(vehicleId);

    // For each vehicle, call the schedule API and retrive the correct schedule
    useEffect(() => {
        if (vehicle !== undefined) {
            const route = routes[vehicle.routeId];
            const vehicleStops = route.properties.stops_ids.map((id) => stops[id]);
            const res = getRouteSchedule(route.properties.route_id + '');
            res.then((schedules: SchedulePayload[]) => {
                if (schedules.length > 0) {
                    const originStop = vehicleStops.filter(
                        (stop) => stop.properties.stopName === route.properties.origin,
                    )[0];
                    if (originStop === undefined) console.error('Did not find the origin stop in the list');
                    else {
                        const originStopId = originStop.properties.stopId;

                        // Find correct schedule for the vehicle
                        const correctedSchedules = groupStopsBySequence(schedules, originStopId);
                        if (correctedSchedules.length > 0)
                            vehicleScheduleMatch(vehicle?.vehicle, vehicleStops, correctedSchedules);
                        else
                            console.error(
                                'Schedule did not follow the expected format. Either origin stop was not found at all, or all schedules were reversed.',
                            );
                    }
                } else {
                    // TODO: no schedule is found
                }
            }).catch((error) => {
                console.error(error);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicle]);
};

const vehicleScheduleMatch = (
    vehicle: PTVehicleFeature,
    stops: PTStopFeature[],
    schedules: SchedulePayload[][],
): void => {
    // Convert correctedTime into comparable format
    const correctedTime = new Date((vehicle.properties.timestamp - vehicle.properties.punctuality) * 1000);
    const correctedHours = correctedTime.getHours();
    const correctedMinutes = correctedTime.getMinutes();
    const correctedSeconds = correctedTime.getSeconds();
    const correctedTimeString = `${correctedHours}:${
        correctedMinutes < 10 ? '0' + correctedMinutes : correctedMinutes
    }:${correctedSeconds < 10 ? '0' + correctedSeconds : correctedSeconds}`;

    // Find prev stop index in the stops array
    const prevStopIndex = stops.findIndex((x) => x.properties.stopsCode == vehicle.properties.userStopCode);
    if (prevStopIndex == -1) console.error('Did not find the stop in the list of stops');
    else if (prevStopIndex >= schedules[0].length - 1)
        console.error(
            'Schedule size does not match with stops list size. Schedule: ' +
                schedules[0].length +
                '. Stops: ' +
                stops.length +
                '. Prev stop index: ' +
                prevStopIndex,
        );
    else {
        // Find possible schedules for each vehicle
        const possibleSchedules = [];
        for (let i = 0; i < schedules.length; i++) {
            const prevStopTime = schedules[i][prevStopIndex].arrival_time;
            const nextStopTime = schedules[i][prevStopIndex + 1].departure_time;

            // Check if correctedTime falls between arrivalTime and departureTime
            if (
                prevStopTime &&
                nextStopTime &&
                correctedTimeString >= prevStopTime &&
                correctedTimeString <= nextStopTime
            ) {
                possibleSchedules.push(schedules[i]);
            }
        }
        //TODO: tie breaking constraint for more than one schedule found

        //TODO: Return the correct schedule and add it to the vehicle parameters. The exact stops are not needed, they can be retrieved using route_id.
        if (possibleSchedules.length == 0) {
            console.log('-----------------------------');
            console.log('Found no possible schedules');
            console.log('Time of vehicle: ' + correctedTimeString);
            console.log('Previous stop index: ' + prevStopIndex);
            console.log(schedules);
            console.log('-----------------------------');
        }
    }
};
