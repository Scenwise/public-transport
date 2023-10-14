const setSelectedRouteAction = (selectedRoute: [number, string, string, string, string, string, boolean]) => {
    return {
        type: "SET_SELECTEDROUTE",
        payload: selectedRoute
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setSelectedRouteAction};