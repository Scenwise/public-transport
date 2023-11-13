import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { selectPTRoutesFeatureList, selectPTStopsFeatureList, updateVisibleRouteState } from '../dataStoring/slice';
import { getVisibleRoutes } from '../hooks/filterHook/useVisibleRoutesUpdate';
import { updateSourcesAndLayers } from '../hooks/useInitializeSourcesAndLayers';
import { usePublicTransport } from '../hooks/usePublicTransport';
import { useAppSelector } from '../store';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
// mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

/**
 * Map and container used for initialization.
 */
type MapAndContainer = {
    setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>;
    mapContainer: React.MutableRefObject<HTMLDivElement | null>;
};

const MapBoxContainer: React.FC = () => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [miniMap, setMiniMap] = useState<mapboxgl.Map | null>(null);

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const miniMapContainer = useRef<HTMLDivElement | null>(null);

    const dispatch = useDispatch();
    const mapStyle = useAppSelector((state) => state.slice.mapStyle);

    const [lng] = useState(4.9041);
    const [lat] = useState(52.3676);
    const [zoom, setZoom] = useState<number>(10);

    const visibleRoutes = useAppSelector((state) => state.slice.visibleRoutes);

    const ptRouteFeatures = useAppSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useAppSelector(selectPTStopsFeatureList);

    const selectedRouteID = useAppSelector((state) => state.slice.selectedRoute);

    usePublicTransport(map);

    const OVERVIEW_DIFFERENCE = 3;
    const OVERVIEW_MIN_ZOOM = 5;
    const OVERVIEW_MAX_ZOOM = 10;

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

    // Update the visible routes when map is moved.
    useEffect(() => {
        if (!map || !visibleRoutes.isOn) return;
        const listener = () => {
            setMap(newMap);
            const updatedVisibleFiltering = getVisibleRoutes(map, visibleRoutes);
            dispatch(updateVisibleRouteState(updatedVisibleFiltering));
        };

        const newMap = map.on('moveend', listener);

        return () => {
            map.off('moveend', listener);
        };
    }, [map, dispatch, visibleRoutes]);

    // If the style is changed, reload the layers and the source
    useEffect(() => {
        if (!map) return;
        const listener = () => {
            setMap(newMap);
            updateSourcesAndLayers('ptRoutes', ptRouteFeatures, map);
            updateSourcesAndLayers('ptStops', ptStopFeatures, map);
        };

        const newMap = map.on('style.load', listener);

        return () => {
            map.off('style.load', listener);
        };
    }, [map, ptRouteFeatures, ptStopFeatures]);

    // Update the mini map style
    useEffect(() => {
        if (miniMap) {
            miniMap.setStyle('mapbox://styles/mapbox/' + mapStyle);
            buildOverviewBounds(map, miniMap);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [mapStyle, miniMap]);

    const buildOverviewZoom = (zoomAmount: number) => {
        return Math.min(Math.max(zoomAmount - OVERVIEW_DIFFERENCE, OVERVIEW_MIN_ZOOM), OVERVIEW_MAX_ZOOM);
    };

    /**
     * Initializaes the map with styles,
     * load the geoJSON for the public transport segments.
     * @param param0 setMap and mapContainer
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const initializeMap = ({ setMap, mapContainer }: MapAndContainer): void => {
        const map = new mapboxgl.Map({
            container: mapContainer.current as string | HTMLElement,
            style: 'mapbox://styles/mapbox/' + mapStyle,
            center: [lng, lat], //coordinates for Amsterdam
            zoom: zoom,
        });

        const miniMap = new mapboxgl.Map({
            container: miniMapContainer.current as string | HTMLElement,
            style: 'mapbox://styles/mapbox/' + mapStyle,
            center: [lng, lat], //coordinates for Amsterdam
            zoom: buildOverviewZoom(zoom),
            maxZoom: 10,
            interactive: false,
            attributionControl: false,
        });

        miniMap.on('load', async () => {
            setMiniMap(miniMap);
            buildOverviewBounds(map, miniMap);
        });

        map.on('load', async () => {
            setMap(map);
            map.resize();
        });

        map.on('moveend', () => {
            const mapCenter = map.getCenter();
            const zoom = map.getZoom();
            setZoom(zoom);
            if (miniMap) {
                miniMap.flyTo({
                    center: [mapCenter.lng, mapCenter.lat],
                    zoom: buildOverviewZoom(zoom),
                });
                buildOverviewBounds(map, miniMap);
            }
        });
    };

    // Put the over bounds on the mini box.
    const buildOverviewBounds = (map: mapboxgl.Map | null, miniMap: mapboxgl.Map) => {
        if (miniMap && map) {
            // REMOVE OLD BOUNDS
            if (miniMap.getSource('parentOutline')) {
                miniMap.removeLayer('parentOutlineOutline');
                miniMap.removeLayer('parentOutlineFill');
                miniMap.removeSource('parentOutline');
            }

            // GENERATE NEW BOUNDS
            if (map.getZoom() > 5.25) {
                const bounds = [];
                const parentMapBounds = map.getBounds();
                const ne = [parentMapBounds._ne.lng, parentMapBounds._ne.lat];
                const se = [parentMapBounds._ne.lng, parentMapBounds._sw.lat];
                const sw = [parentMapBounds._sw.lng, parentMapBounds._sw.lat];
                const nw = [parentMapBounds._sw.lng, parentMapBounds._ne.lat];
                bounds.push(ne, se, sw, nw, ne);
                // CREATE GEONJSON FEATURES ON OVERVIEW MAP LINKED TO BOUND
                miniMap.addSource('parentOutline', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [bounds],
                        },
                        properties: {},
                    },
                });

                // ADD FILL TO POLYGON LAYER
                miniMap.addLayer({
                    id: 'parentOutlineFill',
                    type: 'fill',
                    source: 'parentOutline', // reference the data source
                    layout: {},
                    paint: {
                        'fill-color': '#0080ff', // blue color fill
                        'fill-opacity': 0.3,
                    },
                });

                // ADD OUTLINE TO POLYGON LAYER
                miniMap.addLayer({
                    id: 'parentOutlineOutline',
                    type: 'line',
                    source: 'parentOutline',
                    layout: {},
                    paint: {
                        'line-color': '#0080ff',
                        'line-width': 1,
                    },
                });
            }
        }
    };

    const [stopsTableHeight, setStopsTableHeight] = useState<number>(0);
    useEffect(() => {
        // Calculate the height of the StopsTable and update the state
        const stopsTable = document.getElementById(selectedRouteID);
        if (stopsTable) {
            setStopsTableHeight(stopsTable.offsetHeight);
        }
    }, [selectedRouteID]);

    const miniMapStyles: React.CSSProperties = {
        width: '20%',
        height: '20%',
        position: 'absolute',
        border: 'solid blue',
        bottom: `${stopsTableHeight + 5}px`, // Adjusted bottom property
        right: '3px',
        zIndex: 100,
        display: zoom >= 10 ? 'flex' : 'none',
    };
    const mapStyles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0px',
        zIndex: -1,
    };

    return (
        <>
            <div style={mapStyles} ref={(el) => (mapContainer.current = el)} />
            <div style={miniMapStyles} ref={(el) => (miniMapContainer.current = el)} />
        </>
    );
};

export default MapBoxContainer;
