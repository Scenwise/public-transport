import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

const setLayerToMap = (
    layerSource: string, 
    layerId: string, 
    featureCollection: FeatureCollection<Geometry, GeoJsonProperties>, 
    map: mapboxgl.Map|null
) => {
    // console.log(featureCollection);
    
    map?.addSource(layerSource, {
        'type':'geojson',
        'data': featureCollection
        });     
    map?.addLayer(JSON.parse(JSON.stringify(layerId))) 

}

export default setLayerToMap;