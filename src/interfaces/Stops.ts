import { Point } from "mapbox-gl";

export interface Stop {
    stopId: number,
    stopName: string,
    geom: Point
};

export default Stop;