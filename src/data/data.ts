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

export const FilterType = {
    checkbox: 'checkbox',
    subCheckbox: 'subCheckbox',
    range: 'range', // determine range with a slider
    inputRange: 'inputRange', // determine range with two inputs
    switch: 'switch',
};
