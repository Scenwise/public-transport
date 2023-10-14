import { GeoDataPTLinesActionType } from "../actions/ActionTypes";

export interface InitialStateI {
    displayData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
}

const initialState: InitialStateI = {
    displayData: {} as GeoJSON.FeatureCollection<GeoJSON.Geometry>
}

const currentDisplayGeoDataPTLinesReducer = (state: InitialStateI = initialState, action: GeoDataPTLinesActionType): InitialStateI => {
    switch(action.type){
        case "SET_GEODATA":
            return {
                ...state,
                displayData: action.payload
            }
        default: return state
    }
}

export default currentDisplayGeoDataPTLinesReducer;
