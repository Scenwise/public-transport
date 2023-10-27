import { updateSelectedRoute } from '../dataStoring/slice';
import { useAppDispatch } from '../store';

export const usePopup = (map: mapboxgl.Map | null): void => {
    const dispatch = useAppDispatch();
    if (map) {
        map.on('click', 'ptRoutes', (e) => {
            if (e.features) {
                // const coords = e.lngLat;
                const temp = e?.features[0].properties;
                if (temp) {
                    dispatch(updateSelectedRoute('' + temp.shape_id));
                    // const content = renderPopupContent(React.createElement(TelpuntPopup, temp as LoopFeature['properties']));
                    //
                    // new Popup({ closeOnMove: true, className: 'ptRoutes-popup' })
                    //     .setLngLat(coords)
                    //     .setDOMContent(content)
                    //     .addTo(map);
                }
            }
        });
        changeMousePointers('ptRoutes', map);
    }
};

/**
 * Changes the pointer style to tell the user that an element is clickable.
 * @param layer clickable layer
 * @param map
 */
export const changeMousePointers = (layer: string, map: mapboxgl.Map): void => {
    //next two listeners change the pointer style
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map.on('mouseenter', layer, function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map.on('mouseleave', layer, function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = '';
    });
};
