import ShapeIds from "../../../interfaces/ShapeIds";
import Stop from "../../../interfaces/Stops";

const createLayer = (
    type: string, 
    dataToConvert: (ShapeIds|undefined)[]|(Stop | undefined)[]|null
  ) => {
    const layer = {type: 'FeatureCollection',features: [] as Array<unknown>};
    dataToConvert?.forEach(
      (shape: ShapeIds|(Stop|undefined)) => {
      // const shape: ShapeIds|undefined = dataRoutesMap?.get(shapeId);
      const feature = {
              type: 'Feature',
              geometry: {
              type: type,
              coordinates: shape?.geom
            },
              properties: shape
          }          
      layer.features.push(feature);
    })
    return layer

}

export default createLayer;