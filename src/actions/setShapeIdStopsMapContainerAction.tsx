import ShapeIdStops from '../interfaces/ShapeIdStops';

const setShapeIdStopsMapContainerAction = (shapeIdStopsMapCont: Map<number, ShapeIdStops>|null) => {
    return {
        type: "SET_SHAPEIDSTOPSMAPCONT",
        payload: shapeIdStopsMapCont
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setShapeIdStopsMapContainerAction};