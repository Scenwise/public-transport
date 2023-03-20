const setMapAction = (map: mapboxgl.Map) => {
    return {
        type: "SET_MAP",
        payload: map
    }
};

export default {setMapAction};