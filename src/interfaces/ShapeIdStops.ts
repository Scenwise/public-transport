import { Point } from "mapbox-gl";

export interface ShapeIdStops {
    shape_id: number,
    stops_ids: Array<number>,
    stop_names: Array<string>,
    origin: string,
    destination: string,
    route_id: number,
    vehicle_type: string,
    line_number: string,
    agency_id: string,
    geom: Array<Point>,
    gid: number
}
export default ShapeIdStops;