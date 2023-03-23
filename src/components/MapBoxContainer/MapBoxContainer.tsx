import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import getGtfsTable from './functions/dataRequest'
import stopsLayer from './stops-layer.json';
import {jsonInterfaceConverter, jsonInterfaceConverterRoutes} from './functions/jsonInterfaceConverter';
import ShapeIdStops from '../../interfaces/ShapeIdStops';
import Stop from '../../interfaces/Stops';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import loadLineStringLayer from '../../loadLayersFunc';
import selectedLineLayer from './selected_line-layer.json';
// import { useStore } from 'react-context-hook';
import setLayerToMap from './functions/setLayerToMap';
import createLayer from './functions/createLayer';


// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


const Map = (
  {
    offset,
    setDisplayGeoDataPTLines,
    setSelectedRoute,
    setMap,
    setAgenciesSet,
    setModalitiesSet,
    setGeoDataPTLines,
    setShapeIdStopsMap,
    setStopIdsMap
  }: {
    offset: number,
    setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>,
    setSelectedRoute: React.Dispatch<React.SetStateAction<[number, string, string, string, string, string, boolean]>>,
    setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>,
    setAgenciesSet: React.Dispatch<React.SetStateAction<Set<string>|null|undefined>>,
    setModalitiesSet: React.Dispatch<React.SetStateAction<Set<string>|null|undefined>>,
    setGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>,
    setShapeIdStopsMap: React.Dispatch<React.SetStateAction<Map<number, ShapeIdStops>|null|undefined>>
    setStopIdsMap: React.Dispatch<React.SetStateAction<Map<number, Stop>|null|undefined>>
  }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // const [offset, , ] = useStore('offset');

  const [lng, ] = useState(4.9041);
  const [lat, ] = useState(52.3676);
  // const [shapeIdStopsMapMBCont, setShapeIdStopsMapMBCont] = useState<Map<number, ShapeIdStops>|null>(); 
  // const [stopIdsMapMBCont, setStopIdsMapMBCont] = useState<Map<number, Stop>|null>();

  const popupLine = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  const popupPoint = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  

  // Initialize map when component mounts
  useEffect(() => {
    let routesMap: Map<number, ShapeIdStops>|null = null;
    let stopsMap: Map<number, Stop>|null = null;
    let dataComponent: GeoJSON.FeatureCollection<GeoJSON.Geometry>|null = null;

    if (process.env.REACT_APP_MAPBOX_KEY) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    } else {
      throw new Error('Missing accesstoken for mapboxgl');
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as string | HTMLElement,
      style: 'mapbox://styles/ecuzmici/ckxhn19g40e1p14moxofji6oh',
      center: [lng, lat], //coordinates for Amsterdam
      zoom: 10,
    });
    setMap(map);

    // getDataFunction();
    // const dataShapeStops = 
    fetchGtfsTable('gtfs_stop_shape_ids_geom').then((dataShapeStops)=>{
      const {shapeIdStopsMap, stopIdsMap} = jsonInterfaceConverter(dataShapeStops);
      // console.log(shapeIdStopsMap, stopIdsMap);
      routesMap = shapeIdStopsMap;
      stopsMap = stopIdsMap;
      setShapeIdStopsMap(shapeIdStopsMap);
      setStopIdsMap(stopIdsMap);
    })
    
    
    
    map.on('load', async function (){    
      
      
      const data = await fetchGtfsTable('gtfs_shapes_agency_vehicle_type_number_stops_info');
      dataComponent=data

      const [routeLayer, agenciesSet, modalitiesSet] = loadLineStringLayer(map, data, {"Agency": new Set<string>(), "Vehicle Type": new Set<string>(), "Line Number": new Set<string>()}, offset as number)
      setAgenciesSet(agenciesSet);
      setModalitiesSet(modalitiesSet);
      if(routeLayer !== null){
        setDisplayGeoDataPTLines(routeLayer);
    }
      setGeoDataPTLines(data);
    })   

    map.on('click', function (e) {
      setSelectedRoute([-1, "", "", "", "", "", false])
      try {
        if(map.getLayer('stops-fill') !== undefined){
          map.removeLayer('stops-fill')
          map.removeSource('gtfs_shape_id_stops');
        }

        if(map.getLayer('selected_line') !== undefined){
          map.removeLayer('selected_line')
          map.removeSource('selected_line-layer');
        }
      } catch (error) {
        console.log(error);
        
      }
      
      const selectedFeature = selectFeaturesFunc(e)["lines"];
      if(selectedFeature!==undefined && selectedFeature !== null){

        const properties = JSON.parse(JSON.stringify(selectedFeature))
        const gid = properties["gid"] as number;

        const id = selectedFeature["shape_id"]
        const origin = selectedFeature["origin"];
        const destination = selectedFeature["destination"];
        const lineNumber = selectedFeature["line_number"];
        const agency = selectedFeature["agency_id"]

        if(dataComponent===null){
          return;
        }

        const [dataRoutesMap, , ] = jsonInterfaceConverterRoutes(dataComponent, {"Agency": new Set<string>(), "Vehicle Type": new Set<string>(), "Line Number": new Set<string>()});
        const shape = dataRoutesMap?.get(gid);
      
        const routeLayer = createLayer("LineString", [shape])
        
        setLayerToMap(
          'selected_line-layer', 
          JSON.parse(JSON.stringify(selectedLineLayer)), 
          routeLayer as FeatureCollection<Geometry, GeoJsonProperties>, 
          map
        )
         
        map?.setPaintProperty("selected_line", "line-offset", offset);
        setSelectedRoute([gid as number, id, agency, lineNumber, origin, destination, true])
        displayStopsForGidId(gid) 
      }
      
    });

    map.on('mousemove', (e) => {
      let selectedFeatureLines = null;
      let selectedFeaturePoints = null
      try {
        selectedFeatureLines = selectFeaturesFunc(e)["lines"];
        selectedFeaturePoints = selectFeaturesFunc(e)["points"];
      } catch (error) {
        return
      }
      
      try {
        if(selectedFeaturePoints !== undefined){
          map.getCanvas().style.cursor = 'pointer'
          
          if(selectedFeaturePoints!==null){
            const id = selectedFeaturePoints["stopId"]
            const name = selectedFeaturePoints["stopName"]
            
            const descr = document.createElement('div');
            descr.style.textAlign = 'left';
            descr.innerHTML = `<div>
              <div>Stop ID: ${id}</div>
              <div>Stop Name: ${name}</div>
            </div>`;
            popupPoint.setLngLat(e.lngLat).setHTML(descr.outerHTML).addTo(map);
          }           
        } else {
          map.getCanvas().style.cursor = '';
          popupPoint.remove();
        }
        
          
      } catch (error) {
          console.log(error);
          
      }


      try {
        if(selectedFeatureLines !== undefined && selectedFeaturePoints === undefined){
          map.getCanvas().style.cursor = 'pointer'
          
          if(selectedFeatureLines!==null){
            const id = selectedFeatureLines["shape_id"]
            const origin = selectedFeatureLines["origin"];
            const destination = selectedFeatureLines["destination"];
            const lineNumber = selectedFeatureLines["line_number"];
            const agency = selectedFeatureLines["agency_id"]
            
            const descr = document.createElement('div');
            descr.style.textAlign = 'left';
            descr.innerHTML = `<div>
              <div>Shape ID: ${id}</div>
              <div>Agency: ${agency}</div>
              <div>Line Number: ${lineNumber}</div>
              <div>Origin: ${origin}</div>
              <div>Destination: ${destination}</div>
            </div>`;
            popupLine.setLngLat(e.lngLat).setHTML(descr.outerHTML).addTo(map);
          }                 
  
        } else {
          map.getCanvas().style.cursor = '';
          popupLine.remove();
        }
          
      } catch (error) {
          console.log(error);
          
      }
    })

    const selectFeaturesFunc = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const offset = 0.5;
      const mapLinePoint: {"lines": GeoJsonProperties|undefined, "points": GeoJsonProperties|undefined} = {"lines": undefined,  "points": undefined};
      
      if(map.getLayer('connecting-lines-fill') !== undefined) {
        const selectedFeaturesLine = map.queryRenderedFeatures([new mapboxgl.Point(e.point.x-offset, e.point.y-offset), new mapboxgl.Point(e.point.x+offset, e.point.y+offset)], {
          layers: ['connecting-lines-fill']
        });
        if(selectedFeaturesLine.length>0){
          mapLinePoint["lines"] = selectedFeaturesLine[0].properties
        }
      }
      
      if(map.getLayer('stops-fill') !== undefined) {
        const selectedFeaturesPoint = map.queryRenderedFeatures([new mapboxgl.Point(e.point.x-offset, e.point.y-offset), new mapboxgl.Point(e.point.x+offset, e.point.y+offset)], {
          layers: ['stops-fill']
        });
        if(selectedFeaturesPoint.length>0){
          mapLinePoint["points"] = selectedFeaturesPoint[0].properties
        }
      }

      return mapLinePoint;
    };

    const displayStopsForGidId = (gid: number) => {
      const stopIds: Array<number>|undefined = routesMap?.get(gid)?.stops_ids;
      const stopsArray: (Stop|undefined)[] = []
      stopIds?.forEach((stopId: number) => {
        if(stopsMap?.has(stopId)){
          stopsArray.push(stopsMap?.get(stopId))
        }
      })
      const pointLayer = createLayer("Point", stopsArray)

      setLayerToMap(
        'gtfs_shape_id_stops', 
        JSON.parse(JSON.stringify(stopsLayer)), 
        pointLayer as FeatureCollection<Geometry, GeoJsonProperties>, 
        map
      )
      map?.setPaintProperty("stops-fill",  "circle-translate", [offset, 0]);
    };
    
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchGtfsTable (tableName: String) {
    return await getGtfsTable(tableName);
  }

  const styles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    zIndex: -1,
};


  return <div style={styles} ref={(el) => (mapContainerRef.current = el)} />;
};

export default Map;
