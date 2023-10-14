const setAgenciesSetAction = (agenciesSet: Set<string>|null) => {
    return {
        type: "SET_AGENCYSET",
        payload: agenciesSet
    }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {setAgenciesSetAction};
