const setModlitiesSetAction = (modalitiesSet: Set<string>|null) => {
    return {
        type: "SET_MODALITYSET",
        payload: modalitiesSet
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setModlitiesSetAction};
