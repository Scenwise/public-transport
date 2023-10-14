const setFilterReducer = (filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}) => {
    return {
        type: "SET_FILTER",
        payload: filter
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {setFilterReducer}