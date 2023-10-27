import { useSelector } from 'react-redux';

import { RootStore } from '../../store';
import styles from './routeInformation.module.css';

// selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} stopIdsMapCont={stopIdsMapCont} stopsIds={shapeIdStopsMapCont?.get(selectedRoute[0])}
const RouteInformation = () => {
    const selectedRoute = useSelector((state: RootStore) => state.selectedRouteReducer.selectedRoute);
    const stopIdsMapCont = useSelector((state: RootStore) => state.stopsReducer.stopIdMapCont);
    const shapeIdStopsMapCont = useSelector((state: RootStore) => state.stopsReducer.shapeIdStopsMapCont);
    const stopsIds: number[] | undefined = shapeIdStopsMapCont?.get(selectedRoute[0])?.stops_ids;
    const displayStops = () => {
        const stopNamesList: JSX.Element[] = [];
        let i = 1;
        stopsIds?.forEach((stopId) => {
            stopNamesList.push(
                <span className={styles['stop-names-span']} key={i}>
                    {stopIdsMapCont?.get(stopId)?.stopName.replaceAll('\n', ' ')}
                </span>,
            );
            i += 1;
        });
        return stopNamesList;
    };
    const spanInfo = (info: string) => {
        return <span className={styles['route-information-span']}>{info}</span>;
    };
    const routeInfoDetails = (
        shapeId: string,
        provider: string,
        lineNumber: string,
        origin: string,
        destination: string,
    ) => {
        return (
            <div className={styles['route-information-inner-div']}>
                {spanInfo(shapeId)}
                {spanInfo(provider)}
                {spanInfo(lineNumber)}
                {spanInfo(origin)}
                {spanInfo(destination)}
            </div>
        );
    };
    const routeInformationDivs = () => {
        return (
            <div>
                {routeInfoDetails('Shape ID', 'Provider', 'Line Number', 'Origin', 'Destination')}
                {routeInfoDetails(
                    selectedRoute[1],
                    selectedRoute[2],
                    selectedRoute[3],
                    selectedRoute[4],
                    selectedRoute[5],
                )}
            </div>
        );
    };

    const stopsDiv = () => {
        return <div className={styles['stops-div']}>{displayStops()}</div>;
    };

    return (
        <>
            {selectedRoute[0] !== -1 && selectedRoute[6] === true ? (
                <div className={styles['main-div-route-information']}>
                    {routeInformationDivs()}
                    {stopsDiv()}
                </div>
            ) : null}
        </>
    );
};

export default RouteInformation;
