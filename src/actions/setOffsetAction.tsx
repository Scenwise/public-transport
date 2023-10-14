const setOffsetAction = (offset: number) => {
    return {
        type: "SET_OFFSET",
        payload: offset
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setOffsetAction};