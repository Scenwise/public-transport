import { ActionTypes } from "../actions/ActionTypes";

export interface InitialStateI {
    agenciesSet: Set<string>|null;
    modalitiesSet: Set<string>|null;
}

const initialState = {
    agenciesSet: null,
    modalitiesSet: null
}

const filterSetReducer = (state:InitialStateI =  initialState ,action: ActionTypes): InitialStateI => {
    switch(action.type){
        case "SET_AGENCYSET": 
            return {
                ...state,
                agenciesSet: action.payload
            }
        case "SET_MODALITYSET":
            return {
                ...state,
                modalitiesSet: action.payload
            }
        default: return state;
    }
}

export default filterSetReducer;
