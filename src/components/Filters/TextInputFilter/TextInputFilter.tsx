import { useState } from "react";
// import { useStore } from "react-context-hook";
import loadLineStringLayer from "../../../loadLayersFunc";
import styles from './textInputFilter.module.css';
import {addNewValueToFilter, removeSingleFilterValue, removeAllFilters} from '../filterFunctions'

const TextInputFilter = ({
    offset,
    filter,
    setFilter,
    name, 
    geoDataPTLines,
    map, 
    setDisplayGeoDataPTLines
}: {
    offset: number,
    filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>},
    setFilter:React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>,
    name: string, 
    geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
    map: mapboxgl.Map | null, 
    setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>
}) => {
    // const [offset,,] = useStore('offset');

    const [openClose, changeOpenCloseState] = useState<boolean>(false);
    const [lineNumber, setNewLineNumber] = useState<string>("");
    // const [listOfLinesOpen, setListOfLinesOpen] = useState<boolean>(false)
    const updateFilter = (lineNumber: string) => {
        if(lineNumber.length === 0){
            return
        }
        let filterToPass = undefined;
        if(geoDataPTLines!==undefined){
            if(lineNumber === "Remove"){
                filterToPass = removeAllFilters(geoDataPTLines, filter, "Line Number", lineNumber, setFilter);  
            } else {
                filterToPass = addNewValueToFilter(geoDataPTLines, filter, "Line Number", lineNumber, setFilter);
            }
               
        }
        const [routeLayer,,] = loadLineStringLayer(map, geoDataPTLines, filterToPass, offset as number)
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
            linesNumList.push(<LineNumberOption offset={offset} key={i} index={i+1} lineNum={element} filter={filter} setFilter={setFilter} geoDataPTLines={geoDataPTLines} map={map} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines}/>)
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

const LineNumberOption = ({offset, index, lineNum, filter, setFilter, geoDataPTLines,
    map, setDisplayGeoDataPTLines}: 
    {
        offset: number,
        index: number, 
        lineNum: string,
        filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>},
        setFilter:React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>,
        geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
        map: mapboxgl.Map | null, 
        setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>
    }) => {
    // const [offset,,] = useStore('offset');

    const removeLine = () => {
        if(geoDataPTLines===undefined){
            return;
        }

        const filterToPass = removeSingleFilterValue(geoDataPTLines, filter, "Line Number", lineNum, setFilter);
        const [routeLayer,,] = loadLineStringLayer(map, geoDataPTLines, filterToPass, offset as number)
        if(routeLayer !== null){
            setDisplayGeoDataPTLines(routeLayer);
        }
    }
    return <div onClick={()=>removeLine()}>{index+" "+lineNum}</div>
}

export default TextInputFilter;
