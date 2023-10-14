const setGeoDataPTLinesAction = (newData: GeoJSON.FeatureCollection<GeoJSON.Geometry>) => {
    return {
        type: "SET_GEODATA",
        payload: newData
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setGeoDataPTLinesAction};