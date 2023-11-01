type Filter = {
    optionTitle: string;
    type: string;
    options?: string[]; //number[] | string[];
    variants?: string[]; //number[] | string[];
    variant?: string; //number | string;
};

type Filters = Record<string, Filter>;
type FeatureRecord<T extends GeoJSON.Feature> = Record<string, T>;

type PTRouteFeature = GeoJSON.Feature<PTRouteGeometry, PTRouteProperties>;
type PTRouteGeometry = GeoJSON.LineString;
interface PTRouteProperties {
    shape_id: number; // id
    origin: string;
    destination: string;
    line_number: string;
    agency_id: string;
    route_name: string;
    route_id: number;
    vehicle_type: string;
    stops_ids: string[];
}

type PTStopFeature = GeoJSON.Feature<PTStopGeometry, PTStopProperties>;
type PTStopGeometry = GeoJSON.Point;
interface PTStopProperties {
    stopId: string;
    stopName: string;
}

// type Stops =  Record<string, Stop>;
// type Stop =  {
//     stopName: string;
//     geometry: number[];
// }

type Status = {
    ptRoute: import('./data').ReadyState;
    ptStop: import('./data').ReadyState;
};
