const getFilter = (filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}): {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>} => {
    return {
        "Agency": filter["Agency"],
        "Vehicle Type": filter["Vehicle Type"],
        "Line Number": filter["Line Number"],
    }

}

const getFilterValues = (
    filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}, 
    ddMenuName: string
): Set<string> => {
    const newSet = new Set<string>();
    (filter as  any)[ddMenuName].forEach((element: string) => {
        newSet.add(element);
    })
    return newSet;
}

const addNewValueToFilter = (
    geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
    filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}, 
    ddMenuName: string, 
    name: string, 
    // setFilter: React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>
) => {
    if(geoDataPTLines!==undefined){

        const newSet = getFilterValues(filter, ddMenuName);
        const filterToPass = getFilter(filter);

        if(ddMenuName==="Agency" || ddMenuName==="Vehicle Type" || ddMenuName==="Line Number"){
            filterToPass[ddMenuName] = newSet.add(name)
        }
        
        // setFilter({...filter, [ddMenuName]: newSet.add(name)})
        const dictionary = {...filter, [ddMenuName]: newSet.add(name)}
        return {filterToPass, dictionary}
    }           

};

const removeSingleFilterValue = (
    geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
    filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}, 
    ddMenuName: string, 
    name: string, 
    // setFilter: React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>
) => {
    if(geoDataPTLines!==undefined){
        
        const newSet = getFilterValues(filter, ddMenuName);
        const filterToPass = getFilter(filter);
        if(ddMenuName==="Agency" || ddMenuName==="Vehicle Type" || ddMenuName==="Line Number"){
            newSet.delete(name)
            filterToPass[ddMenuName] = newSet
        }
        
        // setFilter({...filter, [ddMenuName]: newSet})
        const dictionary = {...filter, [ddMenuName]: newSet.add(name)}
        return {filterToPass, dictionary}
        
    }      
};

const removeAllFilters = (
    geoDataPTLines: GeoJSON.FeatureCollection<GeoJSON.Geometry>|undefined, 
    filter: {"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}, 
    ddMenuName: string, 
    name: string, 
    // setFilter: React.Dispatch<{"Agency": Set<string>, "Vehicle Type": Set<string>, "Line Number": Set<string>}>
) => {
    if(geoDataPTLines!==undefined){

        const filterToPass = getFilter(filter);

        if(ddMenuName==="Agency" || ddMenuName==="Vehicle Type" || ddMenuName==="Line Number"){
            filterToPass[ddMenuName] = new Set<string>();
        }
        
        // setFilter({...filter, [ddMenuName]: new Set<string>()})
        const dictionary = {...filter, [ddMenuName]: new Set<string>()}
        return {filterToPass, dictionary}
    }
};


export {addNewValueToFilter, removeSingleFilterValue, removeAllFilters};