import { GeoDataPTLinesActionType } from "../actions/ActionTypes";

export interface InitialStateI {
    geoData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
}

const initialState: InitialStateI = {
    geoData: {} as GeoJSON.FeatureCollection<GeoJSON.Geometry>
}

const currentGeoDataPTLinesReducer = (state: InitialStateI = initialState, action: GeoDataPTLinesActionType): InitialStateI => {
    switch(action.type){
        case "SET_GEODATA":
            return {
                ...state,
                geoData: action.payload
            }
        default: return state
    }
}

export default currentGeoDataPTLinesReducer;
