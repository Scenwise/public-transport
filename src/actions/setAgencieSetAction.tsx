const setAgenciesSetAction = (agenciesSet: Set<string>|null) => {
    return {
        type: "SET_AGENCYSET",
        payload: agenciesSet
    }
};

export default {setAgenciesSetAction};