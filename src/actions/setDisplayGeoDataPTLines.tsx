const setDisplayGeoDataPTLines = (displayData: GeoJSON.FeatureCollection<GeoJSON.Geometry>) => {
    return {
        type: "SET_GEODATA",
        payload: displayData
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setDisplayGeoDataPTLines};