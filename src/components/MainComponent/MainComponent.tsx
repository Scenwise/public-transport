import { useState } from "react";
import Map from "../MapBoxContainer/MapBoxContainer"
import RoutesList from "../RoutesList/RoutesList";
import styles from "./mainComponentStyle.module.css"
import DropDownMenu from "../Filters/DropDownMenu/DropDownMenu"
import TextInputFilter from "../Filters/TextInputFilter/TextInputFilter";
import loadLineStringLayer from "../../loadLayersFunc";
import RouteInformation from "../RouteInformation/RouteInformation";
import Slider from "@mui/material/Slider"
import {useSelector, useDispatch} from 'react-redux'
import { RootStore } from "../../index";
import allActions from "../../actions/allActions";
// import { Slider } from '@material-ui/core'
// import { useStore } from "react-context-hook";
const MainComponent = () => {
    
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    // const [geoDataPTLines, setGeoDataPTLines] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>();
    const [displayGeoDataPTLines, setDisplayGeoDataPTLines] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry>>();

    const dispatch = useDispatch();
    const sliderChange = (newValue: number | number[]) => {
        // console.log(newValue);
        if (typeof(newValue) === "number") {
            // setOffset(newValue)
            dispatch(allActions.setOffsetAction.setOffsetAction(newValue));
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
                   <div className={styles.filterDiv}><DropDownMenu map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} dropDownOptions={useSelector((state: RootStore) => state.filterSetReducer.agenciesSet)} name={"Agency"}/></div>
                   <div className={styles.filterDiv}><DropDownMenu map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} dropDownOptions={useSelector((state: RootStore) => state.filterSetReducer.modalitiesSet)} name={"Vehicle Type"}/></div>
                   <div className={styles.filterDiv}><TextInputFilter name={"Line Number"} map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines}/></div>
                </div>   
                <div className={styles.deleteFilters}><RemoveOption map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines}/></div>
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
                <Map setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} setMap={setMap}/>
            </div>   
            <div>
                <RouteInformation /*stopsIds={shapeIdStopsMapCont?.get(selectedRoute[0])?.stops_ids}*//>    
            </div>   
        </div>
        
    )
}

const RemoveOption = ({map, setDisplayGeoDataPTLines}:
    {
        map: mapboxgl.Map | null, 
        setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>
    }) => {
    // const [offset, , ] = useStore('offset');
    const geoDataPTLines = useSelector((state: RootStore) => state.currentGeoDataPTLinesReducer).geoData;
    const offset = useSelector((state: RootStore) => state.offsetReducer.offset);
    const dispatch = useDispatch();

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
        dispatch(allActions.setFilterAction.setFilterReducer(filterToPass));
        // setFilter(filterToPass)
        
        const [routeLayer, , ] = loadLineStringLayer(map, geoDataPTLines, filterToPass, offset as number)
        if(routeLayer !== null){
            setDisplayGeoDataPTLines(routeLayer);
        }
    }
    return <div onClick={()=>removeAllFilters()}>{"Remove all filters"}</div>
}

export default MainComponent;