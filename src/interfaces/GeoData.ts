export interface GeoData {
    geoJSON: GeoJSON.FeatureCollection | null;
    hashMap: Map<string, number>;
    initialized?: boolean;
}
export default GeoData;