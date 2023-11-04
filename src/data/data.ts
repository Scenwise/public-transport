export enum ReadyState {
    UNINSTANTIATED = -1,
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export const FilterType = {
    checkbox: 'checkbox',
    sub_checkbox: 'sub-checkbox',
    range: 'range', // determine range with a slider
    inputRange: 'inputRange', // determine range with two inputs
    switch: 'switch',
};
