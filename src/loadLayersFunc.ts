import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import connectionsLayer from './components/MapBoxContainer/connections-layer.json'
import {jsonInterfaceConverterRoutes} from './components/MapBoxContainer/functions/jsonInterfaceConverter';
import ShapeIds from './interfaces/ShapeIds';

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
    //   const filters = {agencies: agenciesFilter, Vehicle Type:modalitiesFilter};
      if(data === undefined || filters === undefined ){
        return [{} as GeoJSON.FeatureCollection<GeoJSON.Geometry>, null, null]
      }
      const [dataRoutesMap, agenciesSet, modalitiesSet ] = jsonInterfaceConverterRoutes(data, filters);
      
      const routeLayer = {type: 'FeatureCollection',features: [] as Array<unknown>};
      
      // const gids = dataRoutesMap?.keys;
      dataRoutesMap?.forEach((shape: ShapeIds, shapeId: number) => {
        // const shape: ShapeIds|undefined = dataRoutesMap?.get(shapeId);
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: shape?.geom
          },
          properties: {
            shape_id: shape?.shape_id,
            origin: shape?.origin,
            destination: shape?.destination,
            route_id: shape?.route_id,
            vehicle_type: shape?.vehicle_type,
            line_number: shape?.line_number,
            agency_id: shape?.agency_id,
            route_name: shape?.route_id,
            gid: shape?.gid
          }
        }
        routeLayer.features.push(feature);
      })

      map?.addSource('gtfs_shapes_agency_vehicle_type_number_stops_info', {
        'type':'geojson',
        'data': routeLayer as FeatureCollection<Geometry, GeoJsonProperties>
      });     
      map?.addLayer(JSON.parse(JSON.stringify(connectionsLayer)))
      map?.setPaintProperty("connecting-lines-fill", "line-offset", offset);
      return [routeLayer as FeatureCollection<Geometry, GeoJsonProperties>, agenciesSet, modalitiesSet];
}

export default loadLineStringLayer;