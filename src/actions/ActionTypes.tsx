import ShapeIdStops from "../interfaces/ShapeIdStops";
import Stop from "../interfaces/Stops";

const SET_GEODATA = "SET_GEODATA";
const SET_MAP = "SET_MAP";
const SET_SHAPEIDSTOPSMAPCONT = "SET_SHAPEIDSTOPSMAPCONT";
const SET_STOPIDSMAPCONT = "SET_STOPIDSMAPCONT";
const SET_MODALITYSET = "SET_MODALITYSET";
const SET_AGENCYSET = "SET_AGENCYSET";
const SET_SELECTEDROUTE = "SET_SELECTEDROUTE";
const SET_OFFSET = "SET_OFFSET";
const SET_FILTER = "SET_FILTER";

export interface GeoDataPTLinesActionType{
    type: typeof SET_GEODATA;
    payload: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
}

export interface MapActionType{
    type: typeof SET_MAP;
    payload: mapboxgl.Map;
}

export interface ShapeIdStopsMapActionType{
    type: typeof SET_SHAPEIDSTOPSMAPCONT;
    payload: Map<number, ShapeIdStops>|null;
}

export interface StopIdsMapContActionType{
    type: typeof SET_STOPIDSMAPCONT;
    payload: Map<number, Stop>|null;
}

export interface ModalitySetActionType{
    type: typeof SET_MODALITYSET;
    payload: Set<string>|null
}

export interface AgenciesSetActionType{
    type: typeof SET_AGENCYSET;
    payload: Set<string>|null
}

export interface SelectedRouteActionType{
    type: typeof SET_SELECTEDROUTE;
    payload: [number, string, string, string, string, string, boolean]
}

export interface OffsetActionType {
    type: typeof SET_OFFSET;
    payload: number
}

export interface FilterActionType {
    type: typeof SET_FILTER;
    payload: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}
}

export type ActionTypes =
 | GeoDataPTLinesActionType 
 | MapActionType 
 | ShapeIdStopsMapActionType
 | StopIdsMapContActionType 
 | ModalitySetActionType 
 | AgenciesSetActionType
 | SelectedRouteActionType
 | OffsetActionType
 | FilterActionType;