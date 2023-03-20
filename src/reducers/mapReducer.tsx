import { MapActionType } from "../actions/ActionTypes";

export interface InitialStateI {
    map: mapboxgl.Map | null;
}

const initialState: InitialStateI = {
    map: null
}

const currentMapReducer = (state: InitialStateI = initialState , action: MapActionType): InitialStateI => {
    switch(action.type){
        case "SET_MAP":
            return {
                ...state,
                map: action.payload
            }
        default: return state
    }
}

export default currentMapReducer;