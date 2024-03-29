type Filter = {
    optionTitle: string;
    optionKey: string;
    type: string;
    options: string[];
    availableOptions: string[]; // Keep track of the options that will not make the filtered list empty if clicking them
    variants: string[];
    value: number; // Used for delay filtering
};

type Filters = Record<string, Filter>;
type FeatureRecord<T extends GeoJSON.Feature> = Record<string, T>;

type PTRouteFeature = GeoJSON.Feature<PTRouteGeometry, PTRouteProperties>;
type PTRouteGeometry = GeoJSON.LineString;
interface PTRouteProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // index signature
    shape_id: number; // id
    origin: string;
    destination: string;
    line_number: string;
    agency_id: string;
    route_name: string;
    route_id: number;
    route_type: string;
    route_color: string;
    vehicle_type: string;
    stops_ids: string[];
    vehicle_ids: string[];
}

type PTStopFeature = GeoJSON.Feature<PTStopGeometry, PTStopProperties>;
type PTStopGeometry = GeoJSON.Point;
interface PTStopProperties {
    stopId: string;
    stopName: string;
    stopsCode: string;
    platformCode: string;
    wheelchairBoarding: string;
    routes: string[];
    arrivalTime: string;
    departureTime: string;
}

interface SchedulePayload {
    stop_id: number;
    trip_id: number;
    route_id: number;
    timepoint: number;
    pickup_type: number;
    trip_seq_id: string;
    arrival_time: string;
    drop_off_type: number;
    stop_headsign: string;
    stop_sequence: number;
    departure_time: string;
    fare_units_traveled: number;
    shape_dist_traveled: number;
}

type Status = {
    ptRoute: import('./data').ReadyState;
    ptStop: import('./data').ReadyState;
};

interface VisibleFiltering {
    isOn: boolean; // if only shows routes on the current map screen
    ids: string[]; // the ids of the public transport routes that are visible on the map
}

interface VehicleRoutePair {
    marker: mapboxgl.Marker;
    routeId: string; // key of the route in the routes map
    vehicle: PTVehicleFeature;
}

type PTVehicleFeature = GeoJSON.Feature<PTVehicleGeometry, PTVehicleProperties>;
type PTVehicleGeometry = GeoJSON.Point;
interface PTVehicleProperties {
    messageType: string;
    dataOwnerCode: string;
    linePlanningNumber: string;
    operatingDay: Array<number>;
    journeyNumber: number;
    reinforcementNumber: number;
    userStopCode: string;
    passageSequenceNumber: number;
    timestamp: number;
    source: string;
    vehicleNumber: number;
    punctuality: number;
    rdX: number;
    rdY: number;
}

type VehicleFilter = {
    color: string;
    checked: boolean;
};

interface SelectedMarkerColor {
    color: string;
    marker: mapboxgl.Marker;
}

interface PTRouteIndex {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    route: PTRouteFeature;
}
