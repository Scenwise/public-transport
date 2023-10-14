import { useState } from "react";
// import { useStore } from "react-context-hook";
import {useSelector, useDispatch} from 'react-redux';
import { RootStore } from '../../../index';
import loadLineStringLayer from "../../../loadLayersFunc";
import styles from './textInputFilter.module.css';
import {addNewValueToFilter, removeSingleFilterValue, removeAllFilters} from '../filterFunctions'
import allActions from "../../../actions/allActions";

const TextInputFilter = ({
    // offset,
    // filter,
    // setFilter,
    name, 
    // geoDataPTLines,
    map, 
    setDisplayGeoDataPTLines
}: {
    // offset: number,
    // filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>},
    // setFilter:React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>,
    name: string, 
    // geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
    map: mapboxgl.Map | null, 
    setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>
}) => {
    // const [offset,,] = useStore('offset');

    const [openClose, changeOpenCloseState] = useState<boolean>(false);
    const [lineNumber, setNewLineNumber] = useState<string>("");
    const geoDataPTLines = useSelector((state: RootStore) => state.currentGeoDataPTLinesReducer).geoData
    const offset = useSelector((state: RootStore) => state.offsetReducer.offset)
    const filter = useSelector((state: RootStore) => state.filterReducer.filter)
    const dispatch = useDispatch();
    // const [listOfLinesOpen, setListOfLinesOpen] = useState<boolean>(false)
    const updateFilter = (lineNumber: string) => {
        if(lineNumber.length === 0){
            return
        }
        let filterResult = undefined;
        if(geoDataPTLines!==undefined){
            if(lineNumber === "Remove"){
                filterResult = removeAllFilters(geoDataPTLines, filter, "Line Number", lineNumber);  
                dispatch(allActions.setFilterAction.setFilterReducer(filterResult?.dictionary as { Agency: Set<string>; "Vehicle Type": Set<string>; "Line Number": Set<string>; }));
            } else {
                filterResult = addNewValueToFilter(geoDataPTLines, filter, "Line Number", lineNumber);
                dispatch(allActions.setFilterAction.setFilterReducer(filterResult?.dictionary as { Agency: Set<string>; "Vehicle Type": Set<string>; "Line Number": Set<string>; }));
            }
               
        }
        const [routeLayer,,] = loadLineStringLayer(map, geoDataPTLines, filterResult?.filterToPass, offset as number)
        if(routeLayer === null || routeLayer === undefined){
            return routeLayer;
        }        
        setDisplayGeoDataPTLines(routeLayer);
        setNewLineNumber("");
    }
    // const updateSet = () => {
    //     return lineNumber;
    // }

    const listLineNumSelectd = () => {
        const linesNumList: JSX.Element[] = []; 
        let i = 0
        filter["Line Number"].forEach((element: string) => {
            linesNumList.push(<LineNumberOption key={i} index={i+1} lineNum={element} geoDataPTLines={geoDataPTLines} map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines}/>)
            i+=1
        })
        return linesNumList
    }
    const containsDictionaryKey = (key: string)=>{
        if(key==="Agency"||key==="Vehicle Type"||key==="Line Number"){
            return filter[key].size>0
        }
    }
    return (
        <div>
            <div className={styles.textInputNameDiv} ><span onClick={()=>changeOpenCloseState(!openClose)} className={styles.textInputNameSpan}>{name}</span></div>
            {openClose === true? (
                <div className={styles.textInputDiv}>
                    <div onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setNewLineNumber(e.target.value)} className={styles.innerDivs}><input value={lineNumber} type={"text"}></input></div>
                    <div className={styles.innerDivs}><button onClick={()=>updateFilter(lineNumber)}>Filter</button></div>    
                    <div className={styles.innerDivs}><button onClick={()=>updateFilter("Remove")}>Remove</button></div> 
                    {containsDictionaryKey(name) === true? listLineNumSelectd():null}                
                </div>
                )
                : 
                null
            } 
        </div>
    );
}

const LineNumberOption = ({index, lineNum, geoDataPTLines,
    map, setDisplayGeoDataPTLines}: 
    {
        index: number, 
        lineNum: string,
        // filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>},
        // setFilter:React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>,
        geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
        map: mapboxgl.Map | null, 
        setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>
    }) => {
    // const [offset,,] = useStore('offset');
    const filter = useSelector((state: RootStore) => state.filterReducer.filter);
    const offset = useSelector((state: RootStore) => state.offsetReducer.offset);
    const dispatch = useDispatch();
    const removeLine = () => {
        if(geoDataPTLines===undefined){
            return;
        }

        const filterResult = removeSingleFilterValue(geoDataPTLines, filter, "Line Number", lineNum);
        dispatch(allActions.setFilterAction.setFilterReducer(filterResult?.dictionary as { Agency: Set<string>; "Vehicle Type": Set<string>; "Line Number": Set<string>; }));            
        const [routeLayer,,] = loadLineStringLayer(map, geoDataPTLines, filterResult?.filterToPass, offset as number)
        if(routeLayer !== null){
            setDisplayGeoDataPTLines(routeLayer);
        }
    }
    return <div onClick={()=>removeLine()}>{index+" "+lineNum}</div>
}

export default TextInputFilter;
