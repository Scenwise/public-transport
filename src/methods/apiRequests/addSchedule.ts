import deepcopy from 'deepcopy';

import { getRouteSchedule } from './apiFunction';

// Given a route, store the schedule of its each stop
export const addSchedule = (
    routeID: string,
    vehicleID: string,
    vehicleList: string[],
    ptStopsFeatures: PTStopFeature[],
    setStop: (stop: PTStopFeature) => void,
): Promise<void> => {
    return new Promise(() => {
        const res = getRouteSchedule(routeID);
        res.then((schedules: SchedulePayload[]) => {
            if (schedules) {
                const index = vehicleList.indexOf(vehicleID);
                groupStopsBySequence(schedules, ptStopsFeatures[0].properties.stopId)[index != -1 ? index : 0].forEach(
                    (schedule: SchedulePayload, index: number) => {
                        const stopFeature = deepcopy(ptStopsFeatures[index]);
                        // TODO: Sometimes the number of stops of a route from the stop table are not matched the numbers of the schedules
                        if (stopFeature) {
                            stopFeature.properties.arrivalTime = schedule.arrival_time;
                            stopFeature.properties.departureTime = schedule.departure_time;
                            setStop(stopFeature);
                        }
                    },
                );
            }
        }).catch((error) => {
            console.error(error);
        });
    });
};

/**
 * Function to split the schedule based on stop_sequence
 * [1,2,3,4,1,2,3,4...] => [[1,2,3,4], [1,2,3,4],...]
 * @param stops The stop schedule fetched to be splitted
 * @param originId Filter out the schedules from the opposite direction
 */
const groupStopsBySequence = (stops: SchedulePayload[], originId: string): SchedulePayload[][] => {
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

    return groups.filter((group) => group[0].stop_id + '' === originId);
};
