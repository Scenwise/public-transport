const setFilterReducer = (filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}) => {
    return {
        type: "SET_FILTER",
        payload: filter
    }
}

export default {setFilterReducer}