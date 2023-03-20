const setSelectedRouteAction = (selectedRoute: [number, string, string, string, string, string, boolean]) => {
    return {
        type: "SET_SELECTEDROUTE",
        payload: selectedRoute
    }
};

export default {setSelectedRouteAction};