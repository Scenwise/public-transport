import mapboxgl, { AnyLayer, LngLatLike } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getGtfsTable from '../../apiRequests/apiFunction';
import { addPublicTransportData } from '../../apiRequests/fetchData';
import { ReadyState } from '../../data/data';
import { updateMap, updatePTRoutes, updatePTStops, updateStatus } from '../../dataStoring/slice';
import { layerConfig } from '../../hooks/usePTRoutesLayerUpdate';
import { usePublicTransport } from '../../hooks/usePublicTransport';
import { useAppSelector } from '../../store';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

/**
 * Map and container used for initialization.
 */
type MapAndContainer = {
    setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>;
    mapContainer: React.MutableRefObject<HTMLDivElement | null>;
};

const MapBoxContainer = (): JSX.Element => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();

    const mapInitialized = useRef(false);

    const [lng] = useState(4.9041);
    const [lat] = useState(52.3676);
    // const offset = useSelector((state: RootStore) => state.offsetReducer.offset);
    // const [shapeIdStopsMapMBCont, setShapeIdStopsMapMBCont] = useState<Map<number, ShapeIdStops>|null>();
    // const [stopIdsMapMBCont, setStopIdsMapMBCont] = useState<Map<number, Stop>|null>();

    const popupLine = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
    });

    const popupPoint = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
    });

    usePublicTransport(map);

    /**
     * First initialization of map called on first render.
     */

    useEffect((): void => {
        if (process.env.REACT_APP_MAPBOX_KEY) {
            mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
        } else {
            throw new Error('Missing accesstoken for mapboxgl');
        }

        if (!map) initializeMap({ setMap, mapContainer });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    /**
     * Initializaes the map with styles,
     * load the geoJSON for the public transport segments.
     * @param param0 setMap and mapContainer
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const initializeMap = ({ setMap, mapContainer }: MapAndContainer): void => {
        const map = new mapboxgl.Map({
            container: mapContainer.current as string | HTMLElement,
            style: 'mapbox://styles/ecuzmici/ckxhn19g40e1p14moxofji6oh',
            center: [lng, lat], //coordinates for Amsterdam
            zoom: 10,
        });

        map.on('load', async () => {
            setMap(map);
            map.resize();

            dispatch(updateMap(map));

            // TODO: refactor this
            // Initialize map when component mounts
            // TODO: solve the cognitive-complexity problem
            // eslint-disable-next-line sonarjs/cognitive-complexity
            //     let routesMap: Map<number, ShapeIdStops> | null = null;
            //     let stopsMap: Map<number, Stop> | null = null;
            //     let dataComponent: GeoJSON.FeatureCollection<GeoJSON.Geometry> | null = null;
            //
            //     fetchGtfsTable('gtfs_stop_shape_ids_geom').then((dataShapeStops) => {
            //         const { shapeIdStopsMap, stopIdsMap } = jsonInterfaceConverter(dataShapeStops);
            //
            //         routesMap = shapeIdStopsMap;
            //         stopsMap = stopIdsMap;
            //
            //         dispatch(
            //             allActions.setShapeIdStopsMapContainerAction.setShapeIdStopsMapContainerAction(shapeIdStopsMap),
            //         );
            //         dispatch(allActions.setStopIdsMapContAction.setStopIdsMapContAction(stopIdsMap));
            //     });
            //
            //     map.on('load', async function () {
            //         const data = await fetchGtfsTable('gtfs_shapes_agency_vehicle_type_number_stops_info');
            //         dataComponent = data;
            //
            //         // const [routeLayer, agenciesSet, modalitiesSet] = loadLineStringLayer(
            //         //     map,
            //         //     data,
            //         //     {
            //         //         Agency: new Set<string>(),
            //         //         'Vehicle Type': new Set<string>(),
            //         //         'Line Number': new Set<string>(),
            //         //     },
            //         //     offset as number,
            //         // );
            //         // dispatch(allActions.setAgencieSetAction.setAgenciesSetAction(agenciesSet));
            //         //
            //         // dispatch(allActions.setModalitiesSetAction.setModlitiesSetAction(modalitiesSet));
            //
            //         // if (routeLayer !== null) {
            //         //     setDisplayGeoDataPTLines(routeLayer);
            //         // }
            //         // dispatch(allActions.setGeoDataPTLinesActions.setGeoDataPTLinesAction(data));
            //         // setDisplayGeoDataPTLines(data);
            //     });
            //
            //     map.on('click', function (e) {
            //         dispatch(allActions.setSelectedRouteAction.setSelectedRouteAction([-1, '', '', '', '', '', false]));
            //
            //         try {
            //             if (map.getLayer('stops-fill') !== undefined) {
            //                 map.removeLayer('stops-fill');
            //                 map.removeSource('gtfs_shape_id_stops');
            //             }
            //
            //             if (map.getLayer('selected_line') !== undefined) {
            //                 map.removeLayer('selected_line');
            //                 map.removeSource('selected_line-layer');
            //             }
            //         } catch (error) {
            //             console.log(error);
            //         }
            //
            //         const selectedFeature = selectFeaturesFunc(e)['lines'];
            //         if (selectedFeature !== undefined && selectedFeature !== null) {
            //             const properties = JSON.parse(JSON.stringify(selectedFeature));
            //
            //             const gid = properties['route_id'] as number;
            //
            //             const id = selectedFeature['shape_id'];
            //             const origin = selectedFeature['origin'];
            //             const destination = selectedFeature['destination'];
            //             const lineNumber = selectedFeature['line_number'];
            //             const agency = selectedFeature['agency_id'];
            //
            //             if (dataComponent === null) {
            //                 return;
            //             }
            //
            //             const [dataRoutesMap, ,] = jsonInterfaceConverterRoutes(dataComponent, {
            //                 Agency: new Set<string>(),
            //                 'Vehicle Type': new Set<string>(),
            //                 'Line Number': new Set<string>(),
            //             });
            //             const shape = dataRoutesMap?.get(gid);
            //
            //             const routeLayer = createLayer('LineString', [shape]);
            //
            //             setLayerToMap(
            //                 'selected_line-layer',
            //                 JSON.parse(JSON.stringify(selectedLineLayer)),
            //                 routeLayer as FeatureCollection<Geometry, GeoJsonProperties>,
            //                 map,
            //             );
            //
            //             // map?.setPaintProperty('selected_line', 'line-offset', offset);
            //             // dispatch(
            //             //     allActions.setSelectedRouteAction.setSelectedRouteAction([
            //             //         gid as number,
            //             //         id,
            //             //         agency,
            //             //         lineNumber,
            //             //         origin,
            //             //         destination,
            //             //         true,
            //             //     ]),
            //             // );
            //
            //             // displayStopsForGidId(gid);
            //         }
            //     });
            //
            //     map.on('mousemove', (e) => {
            //         let selectedFeatureLines = null;
            //         let selectedFeaturePoints = null;
            //         try {
            //             selectedFeatureLines = selectFeaturesFunc(e)['lines'];
            //             selectedFeaturePoints = selectFeaturesFunc(e)['points'];
            //         } catch (error) {
            //             return;
            //         }
            //
            //         try {
            //             if (selectedFeaturePoints !== undefined) {
            //                 map.getCanvas().style.cursor = 'pointer';
            //
            //                 if (selectedFeaturePoints !== null) {
            //                     const id = selectedFeaturePoints['stopId'];
            //                     const name = selectedFeaturePoints['stopName'];
            //
            //                     const descr = document.createElement('div');
            //                     descr.style.textAlign = 'left';
            //                     descr.innerHTML = `<div>
            //   <div>Stop ID: ${id}</div>
            //   <div>Stop Name: ${name}</div>
            // </div>`;
            //                     popupPoint.setLngLat(e.lngLat).setHTML(descr.outerHTML).addTo(map);
            //                 }
            //             } else {
            //                 map.getCanvas().style.cursor = '';
            //                 popupPoint.remove();
            //             }
            //         } catch (error) {
            //             console.log(error);
            //         }
            //
            //         try {
            //             if (selectedFeatureLines !== undefined && selectedFeaturePoints === undefined) {
            //                 map.getCanvas().style.cursor = 'pointer';
            //
            //                 if (selectedFeatureLines !== null) {
            //                     const id = selectedFeatureLines['shape_id'];
            //                     const origin = selectedFeatureLines['origin'];
            //                     const destination = selectedFeatureLines['destination'];
            //                     const lineNumber = selectedFeatureLines['line_number'];
            //                     const agency = selectedFeatureLines['agency_id'];
            //
            //                     const descr = document.createElement('div');
            //                     descr.style.textAlign = 'left';
            //                     descr.innerHTML = `<div>
            //   <div>Shape ID: ${id}</div>
            //   <div>Agency: ${agency}</div>
            //   <div>Line Number: ${lineNumber}</div>
            //   <div>Origin: ${origin}</div>
            //   <div>Destination: ${destination}</div>
            // </div>`;
            //                     popupLine.setLngLat(e.lngLat).setHTML(descr.outerHTML).addTo(map);
            //                 }
            //             } else {
            //                 map.getCanvas().style.cursor = '';
            //                 popupLine.remove();
            //             }
            //         } catch (error) {
            //             console.log(error);
            //         }
            //     });
            //
            //     const selectFeaturesFunc = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
            //         const offset = 0.5;
            //         const mapLinePoint: {
            //             lines: GeoJsonProperties | undefined;
            //             points: GeoJsonProperties | undefined;
            //         } = {
            //             lines: undefined,
            //             points: undefined,
            //         };
            //
            //         if (map.getLayer('connecting-lines-fill') !== undefined) {
            //             const selectedFeaturesLine = map.queryRenderedFeatures(
            //                 [
            //                     new mapboxgl.Point(e.point.x - offset, e.point.y - offset),
            //                     new mapboxgl.Point(e.point.x + offset, e.point.y + offset),
            //                 ],
            //                 {
            //                     layers: ['connecting-lines-fill'],
            //                 },
            //             );
            //             if (selectedFeaturesLine.length > 0) {
            //                 mapLinePoint['lines'] = selectedFeaturesLine[0].properties;
            //             }
            //         }
            //
            //         if (map.getLayer('stops-fill') !== undefined) {
            //             const selectedFeaturesPoint = map.queryRenderedFeatures(
            //                 [
            //                     new mapboxgl.Point(e.point.x - offset, e.point.y - offset),
            //                     new mapboxgl.Point(e.point.x + offset, e.point.y + offset),
            //                 ],
            //                 {
            //                     layers: ['stops-fill'],
            //                 },
            //             );
            //             if (selectedFeaturesPoint.length > 0) {
            //                 mapLinePoint['points'] = selectedFeaturesPoint[0].properties;
            //             }
            //         }
            //
            //         return mapLinePoint;
            //     };
            //
            //     // const displayStopsForGidId = (gid: number) => {
            //     //     const stopIds: Array<number> | undefined = routesMap?.get(gid)?.stops_ids;
            //     //     const stopsArray: (Stop | undefined)[] = [];
            //     //     stopIds?.forEach((stopId: number) => {
            //     //         if (stopsMap?.has(stopId)) {
            //     //             stopsArray.push(stopsMap?.get(stopId));
            //     //         }
            //     //     });
            //     //     const pointLayer = createLayer('Point', stopsArray);
            //     //
            //     //     setLayerToMap(
            //     //         'gtfs_shape_id_stops',
            //     //         JSON.parse(JSON.stringify(stopsLayer)),
            //     //         pointLayer as FeatureCollection<Geometry, GeoJsonProperties>,
            //     //         map,
            //     //     );
            //     //     map?.setPaintProperty('stops-fill', 'circle-translate', [offset, 0]);
            //     // };
            //
            //     return () => map.remove();
            // TODO: refactor
        });
    };

    async function fetchGtfsTable(tableName: string) {
        return await getGtfsTable(tableName);
    }

    const styles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0px',
        zIndex: -1,
    };

    return <div style={styles} ref={(el) => (mapContainer.current = el)} />;
};

export default MapBoxContainer;
