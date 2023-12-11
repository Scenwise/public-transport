import axios from 'axios';

const getGtfsTable = async (tableName: string) => {
    const res = await axios.get(process.env.REACT_APP_GRAPH_SERVICE + '/geojson/' + tableName, {
        params: { region_ids: '9dbe4ff2-a739-3da3-9d9f-153235118899' },
    });
    return res.data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
};

export default getGtfsTable;
