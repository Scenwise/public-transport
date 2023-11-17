import { useEffect } from 'react';
import * as turf from "@turf/turf";
import RBush from 'rbush';

const useRBush = (routeTree: React.MutableRefObject<RBush<PTRouteIndex>>, routesData: PTRouteFeature[]): void => {
    // Create RBush structure with bulk insertion for increased efficiency
  useEffect(() => {
    const routeIndex = new RBush<PTRouteIndex>();
    const mappedData = routesData.map((feature: PTRouteFeature) => ({
      bbox: turf.bbox(feature.geometry),
      feature: feature,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })).map((tuple: any) => ({
      minX: tuple.bbox[0],
      minY: tuple.bbox[1],
      maxX: tuple.bbox[2],
      maxY: tuple.bbox[3],
      route: tuple.feature,
    }));
    routeIndex.load(mappedData);
    routeTree.current = routeIndex;
    console.log("Constructed RBush!");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routesData]);
}

export default useRBush;