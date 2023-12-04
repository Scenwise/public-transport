import {
    COLOR_VEHICLE_AERIAL_LIFT,
    COLOR_VEHICLE_BUS,
    COLOR_VEHICLE_CABLE_TRAM,
    COLOR_VEHICLE_DEFAULT,
    COLOR_VEHICLE_FERRY,
    COLOR_VEHICLE_FUNICULAR,
    COLOR_VEHICLE_MONORAIL,
    COLOR_VEHICLE_RAIL,
    COLOR_VEHICLE_SUBWAY,
    COLOR_VEHICLE_TRAM,
    COLOR_VEHICLE_TROLLEYBUS,
} from '../data/layerPaints';

export enum ReadyState {
    UNINSTANTIATED = -1,
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export enum RouteType {
    Tram = 0,
    Subway = 1,
    Rail = 2,
    Bus = 3,
    Ferry = 4,
    CableTram = 5,
    AerialLift = 6,
    Funicular = 7,
    Trolleybus = 11,
    Monorail = 12,
}

export const wheelchairBoarding = ['No information', 'Some vehicles', 'Not possible'];

export const FilterType = {
    checkbox: 'checkbox',
    subCheckbox: 'subCheckbox',
    range: 'range', // determine range with a slider
    inputRange: 'inputRange', // determine range with two inputs
    switch: 'switch',
};

export const filterNames = ['Line Number', 'Vehicle Type', 'Agency', 'Route Type', 'Stop name'];
export const filterKeys = ['line_number', 'vehicle_type', 'agency_id', 'route_type', 'stop'];

export const vehicleTypes = new Map<string, VehicleFilter>(
    Object.entries({
        Bus: { color: COLOR_VEHICLE_BUS, checked: true },
        Trolleybus: { color: COLOR_VEHICLE_TROLLEYBUS, checked: true },
        Tram: { color: COLOR_VEHICLE_TRAM, checked: true },
        CableTram: { color: COLOR_VEHICLE_CABLE_TRAM, checked: true },
        Subway: { color: COLOR_VEHICLE_SUBWAY, checked: true },
        Rail: { color: COLOR_VEHICLE_RAIL, checked: true },
        Monorail: { color: COLOR_VEHICLE_MONORAIL, checked: true },
        Funicular: { color: COLOR_VEHICLE_FUNICULAR, checked: true },
        Ferry: { color: COLOR_VEHICLE_FERRY, checked: true },
        AerialLift: { color: COLOR_VEHICLE_AERIAL_LIFT, checked: true },
        Other: { color: COLOR_VEHICLE_DEFAULT, checked: true },
    }) as [string, VehicleFilter][],
);
