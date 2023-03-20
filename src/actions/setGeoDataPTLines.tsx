const setGeoDataPTLinesAction = (newData: GeoJSON.FeatureCollection<GeoJSON.Geometry>) => {
    return {
        type: "SET_GEODATA",
        payload: newData
    }
};

export default {setGeoDataPTLinesAction};