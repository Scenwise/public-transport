const setMapAction = (map: mapboxgl.Map) => {
    return {
        type: "SET_MAP",
        payload: map
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setMapAction};