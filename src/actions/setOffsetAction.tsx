const setOffsetAction = (offset: number) => {
    return {
        type: "SET_OFFSET",
        payload: offset
    }
};

export default {setOffsetAction};