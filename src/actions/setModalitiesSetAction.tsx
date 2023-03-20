const setModlitiesSetAction = (modalitiesSet: Set<string>|null) => {
    return {
        type: "SET_MODALITYSET",
        payload: modalitiesSet
    }
};

export default {setModlitiesSetAction};
