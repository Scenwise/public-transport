export const COLOR_ROUTE_SELECTED = 'red';
export const COLOR_ROUTE_HOVERED = 'orange';
export const COLOR_ROUTE_DEFAULT = [
    'case',
    ['==', ['get', 'route_color'], null],
    'purple',
    ['to-string', ['get', 'route_color']],
];
export const LINE_WIDTH_SELECTED = 5;
export const LINE_WIDTH_HOVERED = 7;
export const LINE_WIDTH_DEFAULT = 2;

export const COLOR_STOP_SELECTED = 'orange';
export const COLOR_STOP_HOVERED = 'orange';
export const COLOR_STOP_DEFAULT = 'yellow';
export const RADIUS_STOP_SELECTED = 8;
export const RADIUS_STOP_HOVERED = 10;
export const RADIUS_STOP_DEFAULT = 5;

export const STROKE_COLOR_STOP_SELECTED = 'red';
export const STROKE_COLOR_STOP_DEFAULT = 'transparent';
export const STROKE_WIDTH_STOP_SELECTED = 3;
export const STROKE_WIDTH_STOP_DEFAULT = 0;
