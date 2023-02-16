import Stops from '../../interfaces/Stops';
import styles from './routeInformation.module.css';
// selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} stopIdsMapCont={stopIdsMapCont} stopsIds={shapeIdStopsMapCont?.get(selectedRoute[0])}
const RouteInformation = ({
    selectedRoute,
    setSelectedRoute,
    stopIdsMapCont,
    stopsIds
}:{
    selectedRoute: [number, string, string, string, string, string, boolean],
    setSelectedRoute: React.Dispatch<React.SetStateAction<[number, string, string, string, string, string, boolean]>>,
    stopIdsMapCont: Map<number, Stops>|null|undefined,
    stopsIds: number[]|undefined
}) => {

    const displayStops = () => {
        const stopNamesList: JSX.Element[] = []
        let i = 1;
        stopsIds?.forEach((stopId)=>{
            stopNamesList.push(
                <span 
                    className={styles.stopNamesSpan} 
                    key={i}
                >
                    {stopIdsMapCont?.get(stopId)?.stopName.replaceAll('\n', ' ')}
                </span>
            )
            i+=1;
        })
        return stopNamesList;
    }
    const spanInfo = (info: string) => {
        return <span className={styles.routeInformationSpan}>{info}</span>
    }
    const routeInfoDetails = (shapeId: string, provider: string, lineNumber: string, origin: string, destination: string) => {
        return <div className={styles.routeInformationInnerDiv}>
            {spanInfo(shapeId)}
            {spanInfo(provider)}
            {spanInfo(lineNumber)}
            {spanInfo(origin)}
            {spanInfo(destination)}
        </div>
    }
    const routeInformationDivs = () => {
        return <div>
                    {routeInfoDetails("Shape ID","Provider", "Line Number", "Origin", "Destination")}
                    {routeInfoDetails(selectedRoute[1], selectedRoute[2], selectedRoute[3], selectedRoute[4], selectedRoute[5])}
            </div>
    }

    const stopsDiv = () => {
        return <div className={styles.StopsDiv}>
                    {displayStops()}
                </div>
    }

    return <>
        {
        selectedRoute[0] !== -1 && selectedRoute[6] === true? 
            <div className={styles.MainDivRouteInformation}>
                {routeInformationDivs()}
                {stopsDiv()}
                
            </div>
            :null
        }
    </>
    
}

export default RouteInformation;