import { vehicleTypesMap } from '../../data/data';

export const getVehiclePopupText = (vehicle: string, route: string, delay: number): string => {
    return (
        '<div>' +
        '\n' +
        '<div><b> Vehicle: </b>' +
        vehicle +
        '</div>' +
        '<div><b> Route: </b>' +
        route +
        '</div>' +
        '<div><b> Delay: </b>' +
        formatDelay(delay) +
        '</div>' +
        '</div>'
    );
};

const formatDelay = (delay: number): string => {
    if (delay > 0) return delay + ' sec <b> late </b>';
    else if (delay < 0) return delay * -1 + ' sec <b> early </b>';
    else return '<b> on time </b>';
};

export const getMarkerColorBasedOnVehicleType = (type: string): string => {
    if (type === '') {
        type = 'Other';
    }
    const enumValue = vehicleTypesMap[type as keyof typeof vehicleTypesMap];
    return enumValue.color;
};
