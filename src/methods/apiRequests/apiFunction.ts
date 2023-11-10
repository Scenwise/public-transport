import axios from 'axios';

const getGtfsTable = async (tableName: string) => {
    const res = await axios.get(process.env.REACT_APP_GRAPH_SERVICE + '/geojson/' + tableName);
    return res.data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
};

export default getGtfsTable;
