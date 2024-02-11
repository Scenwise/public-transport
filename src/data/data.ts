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
} from './layerPaints';

export const allLayers = ['Routes', 'Stops'];
export const allIcons = ['arrow'];
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

export const filterNames = ['Vehicle Type', 'Line Number', 'Stop Name', 'Agency', 'Delay'];
export const filterKeys = ['route_type', 'line_number', 'stop', 'agency_id', 'delay'];

export const vehicleTypes = new Map<string, VehicleFilter>(
    Object.entries({
        Bus: { color: COLOR_VEHICLE_BUS },
        Trolleybus: { color: COLOR_VEHICLE_TROLLEYBUS },
        Tram: { color: COLOR_VEHICLE_TRAM },
        CableTram: { color: COLOR_VEHICLE_CABLE_TRAM },
        Subway: { color: COLOR_VEHICLE_SUBWAY },
        Rail: { color: COLOR_VEHICLE_RAIL },
        Monorail: { color: COLOR_VEHICLE_MONORAIL },
        Funicular: { color: COLOR_VEHICLE_FUNICULAR },
        Ferry: { color: COLOR_VEHICLE_FERRY },
        AerialLift: { color: COLOR_VEHICLE_AERIAL_LIFT },
        Other: { color: COLOR_VEHICLE_DEFAULT },
    }) as [string, VehicleFilter][],
);

export const filteredRouteIds = new Set<string>();
export const mutableCurrentDelay = [-1] as number[];
