import axios from 'axios';

export const getGtfsTable = async (tableName: string) => {
    const res = await axios.get(process.env.REACT_APP_GRAPH_SERVICE + '/geojson/' + tableName, {
        params: { region_ids: '9dbe4ff2-a739-3da3-9d9f-153235118899' },
    });
    return res.data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
};

export const getRouteSchedule = async (routeId: string) => {
    const res = await axios.get(process.env.REACT_APP_GRAPH_SERVICE + '/json/stop_times?route_id=' + routeId, {
        params: { region_ids: '9dbe4ff2-a739-3da3-9d9f-153235118899' },
    });
    return res.data as SchedulePayload[];
};
