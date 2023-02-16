import { Point } from "mapbox-gl";

export interface Stop {
    stopId: number,
    stopName: string,
    geometry: Point
};

export default Stop;