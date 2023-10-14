import { useEffect, useState } from "react"
import styles from "./routesList.module.css"

const RoutesList = (
    {
        geoDataPTLines
      }: {
        geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined
      }
) => {
    const [showHideList, setStateOpenClose] = useState<boolean>(false);
    const [routesList, setRoutesList] = useState<JSX.Element[]>([]);
    useEffect(() => {
      const routesArray: JSX.Element[] = [];
      if(geoDataPTLines === undefined){
        return;
      }
      
      geoDataPTLines.features.forEach((feature, index) => {
        const routeInfo = JSON.parse(JSON.stringify(feature.properties));
        routesArray.push(
          <RouteData 
            key={routeInfo["shape_id"]}
            number={index+1}
            shapeId={routeInfo["shape_id"]} 
            agencyId={routeInfo["agency_id"]} 
            lineNumber={routeInfo["line_number"]}
            from={routeInfo["origin"]}
            to={routeInfo["destination"]}
          />
        )
        
      });
      setRoutesList(routesArray);
      
    }, [geoDataPTLines])
    return (
      <div>
        <div className={styles.ListOfRoutesDiv}><span className={styles.ListOfRoutesSpan} onClick={() => setStateOpenClose(!showHideList)}>{"List Of Routes"}</span></div>
        <div className={showHideList === true?styles.listStyle:styles.noStyle}>{showHideList === true?routesList:null}</div>
      </div>
    );
      
}

const RouteData = ({number, shapeId, agencyId, lineNumber, from, to}:{number: number, shapeId: String, agencyId: String, lineNumber: String, from: String, to: String}) => {
  return <div>
    <span className={styles.divElement}>{number}</span>
    <span className={styles.divElement}>{shapeId}</span>
    <span className={styles.divElement}>{agencyId}</span>
    <span className={styles.divElement}>{lineNumber}</span>
    <span className={styles.divElement}>{from}</span>
    <span className={styles.divElement}>{to}</span>
  </div>
}

export default RoutesList