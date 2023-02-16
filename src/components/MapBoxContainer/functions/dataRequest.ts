import axios from "axios";

const getGtfsTable = async (tableName: String) => {
    const res = await axios.get(process.env.REACT_APP_GRAPH_SERVICE + '/geojson/'+tableName);
    const geoData = res.data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    return geoData;
}

export default getGtfsTable;