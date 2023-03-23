import { useState } from "react";
import Map from "../MapBoxContainer/MapBoxContainer"
import ShapeIdStops from "../../interfaces/ShapeIdStops";
import Stop from "../../interfaces/Stops";
import RoutesList from "../RoutesList/RoutesList";
import styles from "./mainComponentStyle.module.css"
import DropDownMenu from "../Filters/DropDownMenu/DropDownMenu"
import TextInputFilter from "../Filters/TextInputFilter/TextInputFilter";
import loadLineStringLayer from "../../loadLayersFunc";
import RouteInformation from "../RouteInformation/RouteInformation";
import Slider from "@mui/material/Slider"
// import { Slider } from '@material-ui/core'
// import { useStore } from "react-context-hook";
const MainComponent = () => {

    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [geoDataPTLines, setGeoDataPTLines] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>();
    const [displayGeoDataPTLines, setDisplayGeoDataPTLines] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>();
    const [shapeIdStopsMapCont, setShapeIdStopsMap] = useState<Map<number, ShapeIdStops>|null>(); 
    const [stopIdsMapCont, setStopIdsMap] = useState<Map<number, Stop>|null>();
    const [agenciesSet, setAgenciesSet] = useState<Set<string>|null>();
    const [modalitiesSet, setModalitiesSet] = useState<Set<string>|null>();
    const [filter, setFilter] = useState<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>({"Agency": new Set<string>(), "Vehicle Type": new Set<string>(), "Line Number": new Set<string>()})
    const [selectedRoute, setSelectedRoute] = useState<[number, string, string, string, string, string, boolean]>([-1, "", "", "", "", "", false])
    const [offset, setOffset] = useState<number>(0);
    // const [, setOffset, ] = useStore('offset')

    const sliderChange = (newValue: number | number[]) => {
        // console.log(newValue);
        if (typeof(newValue) === "number") {
            setOffset(newValue)
            if(map?.getLayer('connecting-lines-fill') !== undefined) {
                map?.setPaintProperty("connecting-lines-fill", "line-offset", newValue);
            }
            
            if(map?.getLayer('selected_line') !== undefined) {
                map?.setPaintProperty("selected_line", "line-offset", newValue);
            }

            if(map?.getLayer('stops-fill') !== undefined) {
                map?.setPaintProperty("stops-fill", "circle-translate", [newValue, 0]);
            }
        }
        
    }
    
    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.routesList}>
                    <RoutesList geoDataPTLines={displayGeoDataPTLines}/>
                </div>
                <div className={styles.filtersDiv}>
                   <div className={styles.filterDiv}><DropDownMenu offset={offset} filter={filter} setFilter={setFilter} map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} geoDataPTLines={geoDataPTLines} dropDownOptions={agenciesSet} name={"Agency"}/></div>
                   <div className={styles.filterDiv}><DropDownMenu offset={offset} filter={filter} setFilter={setFilter} map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} geoDataPTLines={geoDataPTLines} dropDownOptions={modalitiesSet} name={"Vehicle Type"}/></div>
                   <div className={styles.filterDiv}><TextInputFilter offset={offset} filter={filter} setFilter={setFilter} name={"Line Number"} geoDataPTLines={geoDataPTLines} map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines}/></div>
                </div>   
                <div className={styles.deleteFilters}><RemoveOption offset={offset} filter={filter} setFilter={setFilter} geoDataPTLines={geoDataPTLines} map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines}/></div>
                <div className={styles.sliderDiv}>
                    <Slider 
                        style={{width: "95%"}} 
                        min={0} 
                        max={25}
                        onChange={(_,x) => sliderChange(x)} 
                        aria-labelledby="input-slider" 
                    />
                </div>

            </div> 
            <div>
                <Map offset={offset} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} setSelectedRoute={setSelectedRoute} setMap={setMap} setAgenciesSet={setAgenciesSet} setModalitiesSet={setModalitiesSet} setGeoDataPTLines={setGeoDataPTLines} setShapeIdStopsMap={setShapeIdStopsMap} setStopIdsMap={setStopIdsMap}/>
            </div>   
            <div>
                <RouteInformation selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} stopIdsMapCont={stopIdsMapCont} stopsIds={shapeIdStopsMapCont?.get(selectedRoute[0])?.stops_ids}/>    
            </div>   
        </div>
        
    )
}

const RemoveOption = ({offset, geoDataPTLines, filter, setFilter, map, setDisplayGeoDataPTLines}:
    {
        offset: number
        geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined,
        filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}, 
        setFilter: React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>, 
        map: mapboxgl.Map | null, 
        setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>
    }) => {
    // const [offset, , ] = useStore('offset');

    const removeAllFilters = () => {
        

        if(geoDataPTLines===undefined){
            return;
        }
        const newSet = new Set<string>();
               
        const filterToPass: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>} = {
            "Agency": newSet,
            "Vehicle Type": newSet,
            "Line Number": newSet,
        }
        setFilter(filterToPass)
        
        const [routeLayer, , ] = loadLineStringLayer(map, geoDataPTLines, filterToPass, offset as number)
        if(routeLayer !== null){
            setDisplayGeoDataPTLines(routeLayer);
        }
    }
    return <div onClick={()=>removeAllFilters()}>{"Remove all filters"}</div>
}

export default MainComponent;