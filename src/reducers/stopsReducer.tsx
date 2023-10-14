import { ShapeIdStopsMapActionType } from "../actions/ActionTypes";
import { StopIdsMapContActionType } from "../actions/ActionTypes";
import ShapeIdStops from "../interfaces/ShapeIdStops";
import Stop from "../interfaces/Stops";

export interface InitialStateI {
    shapeIdStopsMapCont: Map<number, ShapeIdStops>|null;
    stopIdMapCont: Map<number, Stop>|null;
}

const initialState: InitialStateI = {
    shapeIdStopsMapCont: null,
    stopIdMapCont: null
}

const stopsReducer = (state: InitialStateI = initialState , action: ShapeIdStopsMapActionType|StopIdsMapContActionType): InitialStateI => {
    switch(action.type){
        case "SET_SHAPEIDSTOPSMAPCONT":
            return {
                ...state,
                shapeIdStopsMapCont: action.payload
            }
        case "SET_STOPIDSMAPCONT":
            return {
                ...state,
                stopIdMapCont: action.payload
            }
        default: return state
    }
}

export default stopsReducer;