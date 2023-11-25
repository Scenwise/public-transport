import { RouteType } from '../../data/data';
import {
    COLOR_VEHICLE_AERIAL_LIFT,
    COLOR_VEHICLE_BUS,
    COLOR_VEHICLE_CABLE_TRAM,
    COLOR_VEHICLE_FERRY,
    COLOR_VEHICLE_FUNICULAR,
    COLOR_VEHICLE_MONORAIL,
    COLOR_VEHICLE_RAIL,
    COLOR_VEHICLE_SUBWAY,
    COLOR_VEHICLE_TRAM,
    COLOR_VEHICLE_TROLLEYBUS,
} from '../../data/layerPaints';

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

const RouteTypeStrings: { [key: string]: RouteType } = {
    Tram: RouteType.Tram,
    Subway: RouteType.Subway,
    Rail: RouteType.Rail,
    Bus: RouteType.Bus,
    Ferry: RouteType.Ferry,
    CableTram: RouteType.CableTram,
    AerialLift: RouteType.AerialLift,
    Funicular: RouteType.Funicular,
    Trolleybus: RouteType.Trolleybus,
    Monorail: RouteType.Monorail,
};

export const getMarkerColorBasedOnVehicleType = (type: string): string => {
    const enumValue = RouteTypeStrings[type];
    switch (enumValue) {
        case RouteType.Tram:
            return COLOR_VEHICLE_TRAM;
        case RouteType.Subway:
            return COLOR_VEHICLE_SUBWAY;
        case RouteType.Rail:
            return COLOR_VEHICLE_RAIL;
        case RouteType.Ferry:
            return COLOR_VEHICLE_FERRY;
        case RouteType.CableTram:
            return COLOR_VEHICLE_CABLE_TRAM;
        case RouteType.AerialLift:
            return COLOR_VEHICLE_AERIAL_LIFT;
        case RouteType.Funicular:
            return COLOR_VEHICLE_FUNICULAR;
        case RouteType.Trolleybus:
            return COLOR_VEHICLE_TROLLEYBUS;
        case RouteType.Monorail:
            return COLOR_VEHICLE_MONORAIL;
        // For vehicles with no type, we consider them busses by default
        default:
            return COLOR_VEHICLE_BUS;
    }
};
