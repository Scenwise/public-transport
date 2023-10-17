import { useEffect, useState } from 'react';

import styles from './routesList.module.css';

const RoutesList = ({
    geoDataPTLines,
}: {
    geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry> | undefined;
}) => {
    const [showHideList, setStateOpenClose] = useState<boolean>(false);
    const [routesList, setRoutesList] = useState<JSX.Element[]>([]);
    useEffect(() => {
        const routesArray: JSX.Element[] = [];
        if (geoDataPTLines === undefined) {
            return;
        }

        geoDataPTLines.features.forEach((feature, index) => {
            const routeInfo = JSON.parse(JSON.stringify(feature.properties));
            routesArray.push(
                <RouteData
                    key={routeInfo['shape_id']}
                    number={index + 1}
                    shapeId={routeInfo['shape_id']}
                    agencyId={routeInfo['agency_id']}
                    lineNumber={routeInfo['line_number']}
                    from={routeInfo['origin']}
                    to={routeInfo['destination']}
                />,
            );
        });
        setRoutesList(routesArray);
    }, [geoDataPTLines]);
    return (
        <div>
            <div className={styles.ListOfRoutesDiv}>
                <span className={styles['list-of-routes-span']} onClick={() => setStateOpenClose(!showHideList)}>
                    {'List Of Routes'}
                </span>
            </div>
            <div className={showHideList === true ? styles['list-style'] : ''}>
                {showHideList === true ? routesList : null}
            </div>
        </div>
    );
};

const RouteData = ({
    number,
    shapeId,
    agencyId,
    lineNumber,
    from,
    to,
}: {
    number: number;
    shapeId: string;
    agencyId: string;
    lineNumber: string;
    from: string;
    to: string;
}) => {
    return (
        <div>
            <span className={styles['div-element']}>{number}</span>
            <span className={styles['div-element']}>{shapeId}</span>
            <span className={styles['div-element']}>{agencyId}</span>
            <span className={styles['div-element']}>{lineNumber}</span>
            <span className={styles['div-element']}>{from}</span>
            <span className={styles['div-element']}>{to}</span>
        </div>
    );
};

export default RoutesList;
