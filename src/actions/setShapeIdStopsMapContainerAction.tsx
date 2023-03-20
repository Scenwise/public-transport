import ShapeIdStops from '../interfaces/ShapeIdStops';

const setShapeIdStopsMapContainerAction = (shapeIdStopsMapCont: Map<number, ShapeIdStops>|null) => {
    return {
        type: "SET_SHAPEIDSTOPSMAPCONT",
        payload: shapeIdStopsMapCont
    }
};

export default {setShapeIdStopsMapContainerAction};