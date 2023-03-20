import { ActionTypes } from "../actions/ActionTypes";

export interface InitialStateI {
    selectedRoute: [number, string, string, string, string, string, boolean];
}

const initialState = {
    selectedRoute: [-1, "", "", "", "", "", false] as [number, string, string, string, string, string, boolean]
}

const selectedRouteReducer = (state:InitialStateI =  initialState, action: ActionTypes): InitialStateI => {
    switch(action.type){
        case "SET_SELECTEDROUTE": 
            return {
                ...state,
                selectedRoute: action.payload
            }
        
        default: return state;
    }
}

export default selectedRouteReducer;
