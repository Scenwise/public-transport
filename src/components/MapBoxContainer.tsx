import mapboxgl, { AnyLayer } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { selectPTRoutesFeatureList, selectPTStopsFeatureList, updateVisibleRouteState } from '../dataStoring/slice';
import { getVisibleRoutes } from '../hooks/filterHook/useVisibleRoutesUpdate';
import { layerConfig, updateSourcesAndLayers } from '../hooks/useInitializeSourcesAndLayers';
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

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();
    const mapStyle = useAppSelector((state) => state.slice.mapStyle);

    const [lng] = useState(4.9041);
    const [lat] = useState(52.3676);

    const visibleRoutes = useAppSelector((state) => state.slice.visibleRoutes);

    const ptRouteFeatures = useAppSelector(selectPTRoutesFeatureList);
    const ptStopFeatures = useAppSelector(selectPTStopsFeatureList);

    const mapInitialized = useRef(false);

    usePublicTransport(map, mapInitialized);

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
            zoom: 10,
        });

        map.on('load', async () => {
            setMap(map);
            map.resize();

            Object.entries(layerConfig).forEach(([layerId, layer]: [string, AnyLayer]) => {
                const sourceId = `${layerId}Source`;

                if (!map.getSource(sourceId)) {
                    map.addSource(sourceId, {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features: [] },
                    });

                    if (!map.getLayer(layer.id)) {
                        map.addLayer(layer);
                    }
                }
            });
            mapInitialized.current = true;
        });

        // If the style is changed, reload the layers and the source
        map.on('style.load', () => {
            updateSourcesAndLayers('ptRoutes', ptRouteFeatures, map);
            updateSourcesAndLayers('ptStops', ptStopFeatures, map);
        });
    };

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
