import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import connectionsLayer from './components/MapBoxContainer/connections-layer.json'
import {jsonInterfaceConverterRoutes} from './components/MapBoxContainer/functions/jsonInterfaceConverter';
import ShapeIds from './interfaces/ShapeIds';
import setLayerToMap from './components/MapBoxContainer/functions/setLayerToMap';
// import Stop from './interfaces/Stops';
import createLayer from './components/MapBoxContainer/functions/createLayer';

const loadLineStringLayer = (
    map: mapboxgl.Map | null, 
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined,
    filters: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}|undefined,
    offset: number
): [GeoJSON.FeatureCollection<GeoJSON.Geometry>, Set<string>|null, Set<string>|null] => {
    if(map?.getLayer('connecting-lines-fill') !== undefined){
        map.removeLayer('connecting-lines-fill')
        map.removeSource('gtfs_shapes_agency_vehicle_type_number_stops_info');
    }
;
    if(data === undefined || filters === undefined ){
      return [{} as GeoJSON.FeatureCollection<GeoJSON.Geometry>, null, null]
    }
    
    const [dataRoutesMap, agenciesSet, modalitiesSet ] = jsonInterfaceConverterRoutes(data, filters);
    
    const dataRoutesArray: ShapeIds[] = []
    
    dataRoutesMap?.forEach((element) => {
      dataRoutesArray.push(element)
    })
    const routeLayer = createLayer("LineString", dataRoutesArray)
    
    setLayerToMap(
      'gtfs_shapes_agency_vehicle_type_number_stops_info', 
      JSON.parse(JSON.stringify(connectionsLayer)), 
      routeLayer as FeatureCollection<Geometry, GeoJsonProperties>, 
      map
    )

    map?.setPaintProperty("connecting-lines-fill", "line-offset", offset);
    return [routeLayer as FeatureCollection<Geometry, GeoJsonProperties>, agenciesSet, modalitiesSet];
}

export default loadLineStringLayer;