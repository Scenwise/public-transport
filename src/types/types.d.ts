type Filter = {
    optionTitle: string;
    type: string;
    options?: string[]; //number[] | string[];
    variants?: string[]; //number[] | string[];
    variant?: string; //number | string;
};

type Filters = Record<string, Filter>;
type FeatureRecord<T extends GeoJSON.Feature> = Record<string, T>;

type PTSegmentFeature = GeoJSON.Feature<PTSegmentGeometry, PTSegmentProperties>;
type PTSegmentGeometry = GeoJSON.LineString;
interface PTSegmentProperties {
    shape_id: number; // id
    origin: string;
    destination: string;
    route_id: number;
    vehicle_type: string;
    line_number: string;
    agency_id: string;
    route_name: string;
}

type PTStopFeature = GeoJSON.Feature<PTStopGeometry, PTStopProperties>;
type PTStopGeometry = GeoJSON.Point;
interface PTStopProperties {
    stopId: number;
    stopName: string;
}

type Status = {
    ptSegment: import('./data').ReadyState;
    ptStop: import('./data').ReadyState;
};
