import { Point } from "mapbox-gl";

interface ShapeIds {
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

// const getProperty = (shape: ShapeIds) => {
//     return {
//         shape_id: shape?.shape_id,
//         origin: shape?.origin,
//         destination: shape?.destination,
//         route_id: shape?.route_id,
//         vehicle_type: shape?.vehicle_type,
//         line_number: shape?.line_number,
//         agency_id: shape?.agency_id,
//         route_name: shape?.route_id,
//         gid: shape?.gid
//     }
// } 

export default ShapeIds;