import * as turf from '@turf/turf';
import RBush from 'rbush';
import { useEffect } from 'react';

interface BboxFeaturePair {
    bbox: turf.BBox;
    feature: PTRouteFeature;
}

const useRBush = (
    mapInitialized: boolean,
    routeTree: React.MutableRefObject<RBush<PTRouteIndex>>,
    routesData: PTRouteFeature[],
    treeLoaded: React.MutableRefObject<boolean>,
): void => {
    // Create RBush structure with bulk insertion for increased efficiency
    useEffect(() => {
        if (mapInitialized && routesData) {
            const mappedData = routesData
                .map((feature: PTRouteFeature) => ({
                    bbox: turf.bbox(feature.geometry),
                    feature: feature,
                }))
                .map((tuple: BboxFeaturePair) => ({
                    minX: tuple.bbox[0],
                    minY: tuple.bbox[1],
                    maxX: tuple.bbox[2],
                    maxY: tuple.bbox[3],
                    route: tuple.feature,
                }));
            routeTree.current.load(mappedData);
            treeLoaded.current = true;
            console.log('Constructed RBush!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routesData]);
};

export default useRBush;
