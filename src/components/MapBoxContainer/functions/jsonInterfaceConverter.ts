import ShapeIds from "../../../interfaces/ShapeIds";
import ShapeIdStops from "../../../interfaces/ShapeIdStops";
import Stop from "../../../interfaces/Stops";

const jsonInterfaceConverter = (
        data: GeoJSON.FeatureCollection<GeoJSON.Geometry>
    ): {shapeIdStopsMap: Map<number, ShapeIdStops>|null, stopIdsMap: Map<number, Stop>|null} => {
    let mapShapeIdStops = new Map<number, ShapeIdStops>();
    let mapStopIds = new Map<number, Stop>();
    try {
        data.features.forEach((element) => {
            const property: ShapeIdStops = JSON.parse(JSON.stringify(element.properties))
            
            const stops:number = property.stops_ids.length;
            const stopIds = property.stops_ids;
            const stopNames = property.stop_names;
            const stopGeoms = JSON.parse(JSON.stringify(element.geometry))["coordinates"];
            property.geom = stopGeoms;
            mapShapeIdStops.set(property.route_id, property);
            
            for(let i = 0; i < stops; i++){
                const stop:Stop = {
                    stopId: stopIds[i],
                    stopName: stopNames[i],
                    geom: stopGeoms[i]
                };
                mapStopIds.set(stopIds[i], stop)
            }
        })
    } catch (error) {
        console.log(error);
        return {shapeIdStopsMap: null, stopIdsMap: null};
    }
    
    return {shapeIdStopsMap: mapShapeIdStops, stopIdsMap: mapStopIds};
}

const jsonInterfaceConverterRoutes = (
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    filters: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}
): [Map<number, ShapeIds>|null, Set<string>|null, Set<string>|null] => {

    const agenciesSet = new Set<string>();
    const modalitiesSet = new Set<string>();
    const shapeIdsMap = new Map<number, ShapeIds>();
    const filterAgencies = filters["Agency"]
    const filterModalities = filters["Vehicle Type"]
    const filterLineNumber = filters["Line Number"]
    try {

        data.features.forEach((element) => {
            const property: ShapeIds = JSON.parse(JSON.stringify(element.properties))
            
            if(filters !== undefined /*&& (filterAgencies.size>0 || filterModalities.size>0 || filterLineNumber.size>0)*/){
                if(filterAgencies.size>0){
                    if(!filterAgencies.has(property.agency_id)){
                        return;
                    }
                }
                if(filterModalities.size>0){
                    if(!filterModalities.has(property.vehicle_type)){
                        return;
                    }
                }
                if(filterLineNumber.size>0){
                    if(!filterLineNumber.has(property.line_number)){
                        return;
                    }
                }
                
            }

            if(element.geometry===null){
                return;
            }
            
            const routeGeoms = JSON.parse(JSON.stringify(element.geometry))["coordinates"];
            property.geom = routeGeoms;
            shapeIdsMap.set(property.route_id, property)
            agenciesSet.add(property.agency_id);
            modalitiesSet.add(property.vehicle_type)
        })

    } catch (error) {
        console.log(error);
    }
    
    return [shapeIdsMap, agenciesSet, modalitiesSet];
}

export {jsonInterfaceConverter, jsonInterfaceConverterRoutes};