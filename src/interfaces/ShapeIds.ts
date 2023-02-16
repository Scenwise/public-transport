import { Point } from "mapbox-gl";

export interface ShapeIds {
    shape_id: number,
    origin: string,
    destination: string,
    route_id: number,
    vehicle_type: string,
    line_number: string,
    agency_id: string,
    route_name: string,
    geom: Array<Point>,
    gid: number
}

export default ShapeIds;