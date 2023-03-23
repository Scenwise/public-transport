import { useState } from "react";
// import { useStore } from "react-context-hook";
import loadLineStringLayer from '../../../loadLayersFunc';
import styles from './dropDownMenu.module.css'
import {addNewValueToFilter, removeSingleFilterValue, removeAllFilters} from '../filterFunctions'

const DropDownMenu = (
    {
        offset,
        filter,
        setFilter,
        map, 
        setDisplayGeoDataPTLines,
        geoDataPTLines, 
        dropDownOptions, 
        name
    }:
    {
        offset: number,
        filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>},
        setFilter: React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>,
        map: mapboxgl.Map | null, 
        setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>,
        geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
        dropDownOptions: Set<string>| null | undefined, 
        name: string
    }) => {
    const [openState, setState] = useState<boolean>(false)
    
    const dispalyOptions = () => {
        const options: JSX.Element[] = [];
        let i=0;
        dropDownOptions?.forEach((element)=>{
            options.push(<Option offset={offset} key={i+1} ddMenuName={name} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} setState={setState} filter={filter} setFilter={setFilter} name={element} map={map} geoDataPTLines={geoDataPTLines} number={i+1}/>)
            i+=1
        })
        options.push(<RemoveFilters offset={offset} ddMenuName={name} key={i+1} number={i+1} setDisplayGeoDataPTLines={setDisplayGeoDataPTLines} setState={setState} filter={filter} setFilter={setFilter} name={"Remove"} map={map} geoDataPTLines={geoDataPTLines}/>)
        return options
    }
    return (<>
    <div className={styles.dropDownMenuTitleDiv}><span onClick={()=>setState(!openState)} className={styles.dropDownMenuTitleSpan}>{name}</span></div>
    <div className={openState===true?styles.openFilterDiv:styles.filterDiv}>{openState===true?dispalyOptions():null}</div>
    </>)
};

const Option = (
    {
        offset,
        ddMenuName,
        number,
        setDisplayGeoDataPTLines,
        setState,
        filter,
        setFilter,
        name, 
        map, 
        geoDataPTLines
    }:
    {
        offset: number,
        ddMenuName: string,
        number: number,
        setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>,
        setState: React.Dispatch<boolean>,
        filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>},
        setFilter: React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>,
        name: string, 
        map: mapboxgl.Map | null, 
        geoDataPTLines:GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined
    }) => {
    // const [offset,,] = useStore('offset');

    const addRemoveOption = () => {

        let filterToPass = undefined;
        if(containsDictionaryKey(ddMenuName) === false){
            setState(false)
            filterToPass = addNewValueToFilter(geoDataPTLines, filter, ddMenuName, name, setFilter);
            
        } else {
            filterToPass = removeSingleFilterValue(geoDataPTLines, filter, ddMenuName, name, setFilter);              
        }

        const [routeLayer,,] = loadLineStringLayer(map, geoDataPTLines, filterToPass, offset as number)
        if(routeLayer !== null && routeLayer !== undefined){
            setDisplayGeoDataPTLines(routeLayer);
        } 
    }

    const containsDictionaryKey = (key: string)=>{
        if(key==="Agency"||key==="Vehicle Type"||key==="Line Number"){
            return filter[key].has(name)
        }
    }


    return <div 
        className={containsDictionaryKey(ddMenuName) === false?styles.optionsDiv:styles.optionsDivSelected}
        onClick={()=>{
            addRemoveOption();            
    }}>{number}{" "}{name}</div>
}

const RemoveFilters = (
    {
        offset,
        ddMenuName,
        number,
        setDisplayGeoDataPTLines,
        setState,
        filter,
        setFilter,
        name, 
        map, 
        geoDataPTLines}:
    {
        offset: number,
        ddMenuName: string,
        number: number,
        setDisplayGeoDataPTLines: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined>>,
        setState:React.Dispatch<boolean>,
        filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>},
        setFilter:React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>,
        name:string, 
        map:mapboxgl.Map | null, 
        geoDataPTLines:GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined
    }) => {
        
    // const [offset,,] = useStore('offset');

    return <div className={styles.optionsDiv}
    onClick={()=>{
        setState(false)
        const filterToPass = removeAllFilters(geoDataPTLines, filter, ddMenuName, name, setFilter)
        const [routeLayer,,] = loadLineStringLayer(map, geoDataPTLines, filterToPass, offset as number)
        if(routeLayer !== null && routeLayer !== undefined){
            setDisplayGeoDataPTLines(routeLayer);
        } 
        
    }}>{name}</div>
}
export default DropDownMenu;