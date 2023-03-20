const setDisplayGeoDataPTLines = (displayData: GeoJSON.FeatureCollection<GeoJSON.Geometry>) => {
    return {
        type: "SET_GEODATA",
        payload: displayData
    }
};

export default {setDisplayGeoDataPTLines};