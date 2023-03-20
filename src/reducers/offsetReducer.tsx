import { ActionTypes } from "../actions/ActionTypes";

export interface InitialStateI {
    offset: number;
}

const initialState: InitialStateI = {
    offset: 0
}

const offsetReducer = (state: InitialStateI = initialState, action: ActionTypes): InitialStateI => {
    switch(action.type){
        case "SET_OFFSET":
            return {
                ...state,
                offset: action.payload
            }
        default: return state
    }
}

export default offsetReducer;