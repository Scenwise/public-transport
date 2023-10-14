import { ActionTypes } from "../actions/ActionTypes";

export interface InitialStateI {
    filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>};
}

const initialState: InitialStateI = {
    filter: {"Agency": new Set<string>(), "Vehicle Type": new Set<string>(), "Line Number": new Set<string>()}
}

const filterReducer = (state: InitialStateI = initialState, action: ActionTypes): InitialStateI => {
    switch(action.type){
        case "SET_FILTER":
            return {
                ...state,
                filter: action.payload
            }
        default: return state
    }
}

export default filterReducer;