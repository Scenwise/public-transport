import deepcopy from 'deepcopy';

import { getRouteSchedule } from './apiFunction';

// Given a route, store the schedule of its each stop
export const addSchedule = (
    routeID: string,
    routeOrigin: string,
    vehicleIndex: number,
    ptStopsFeatures: PTStopFeature[],
    ptStops: FeatureRecord<PTStopFeature>,
    setStop: (stop: PTStopFeature) => void,
): Promise<void> => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    return new Promise(() => {
        const res = getRouteSchedule(routeID);
        res.then((schedules: SchedulePayload[]) => {
            if (schedules.length > 0) {
                const originStop = ptStopsFeatures.filter(
                    (stop: PTStopFeature) => stop.properties.stopName === routeOrigin,
                )[0];
                const originStopName = originStop ? originStop.properties.stopId : ptStopsFeatures[0].properties.stopId;

                const stopIds = ptStopsFeatures.map((feature) => feature.properties.stopId);

                const groupedSchedules = groupStopsBySequence(schedules, originStopName, stopIds);

                const schedule = groupedSchedules[vehicleIndex != -1 ? vehicleIndex : 0]
                    ? groupedSchedules[vehicleIndex != -1 ? vehicleIndex : 0]
                    : groupedSchedules[0];

                if (schedule.length > 0) {
                    schedule.forEach((stop) => {
                        const stopFeature = deepcopy(ptStops[stop.stop_id]);
                        if (stopFeature) {
                            stopFeature.properties.arrivalTime = stop.arrival_time;
                            stopFeature.properties.departureTime = stop.departure_time;
                            setStop(stopFeature);
                        }
                    });
                    return;
                }
            }
            // If no schedule is found, there is no vehicle on the route so no active schedule
            ptStopsFeatures.forEach((stop: PTStopFeature) => {
                const copiedStop = deepcopy(stop);
                copiedStop.properties.arrivalTime = 'No active schedule';
                copiedStop.properties.departureTime = 'No active schedule';
                setStop(copiedStop);
            });
        }).catch((error) => {
            console.error(error);
        });
    });
};

/**
 * Function to split the schedule based on stop_sequence
 * [1,2,3,4,4,3,2,1,1,2,3,4...] => [[1,2,3,4], [1,2,3,4],...]
 * @param stops The stop schedule fetched to be splitted
 * @param originId Filter out the schedules from the opposite direction
 */
const groupStopsBySequence = (stops: SchedulePayload[], originId: string, stopIds: string[]): SchedulePayload[][] => {
    const groups: SchedulePayload[][] = [];
    let currentGroup: SchedulePayload[] = [];

    for (const stop of stops) {
        if (currentGroup.length === 0 || currentGroup[currentGroup.length - 1].stop_sequence < stop.stop_sequence) {
            currentGroup.push(stop);
        } else {
            groups.push(currentGroup);
            currentGroup = [stop];
        }
    }

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    // Get schedule groups with the correct direction (must contain all stop ids, as stops in different direction have different ids)
    // Sort the groups based on time
    // Sometimes there are duplicate stops in the payload, remove them
    return groups
        .filter((group) => {
            return stopIds
                .filter((id) => !!id)
                .every((stopId) => {
                    return group.some((payload) => payload.stop_id + '' === stopId);
                });
        })
        .sort((groupA, groupB) => {
            const arrivalTimeA = groupA[0].arrival_time;
            const arrivalTimeB = groupB[0].arrival_time;
            return arrivalTimeA.localeCompare(arrivalTimeB);
        })
        .filter((group, index, array) => {
            // Check if the arrival time of the first element is unique in the sorted array
            return index === 0 || group[0].arrival_time !== array[index - 1][0].arrival_time;
        });
};
