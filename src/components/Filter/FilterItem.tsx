import deepcopy from 'deepcopy';
import React, { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';

import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, Chip, InputAdornment, ListItemText, ListSubheader, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { updateFilter } from '../../dataStoring/slice';
import { useAppDispatch } from '../../store';

interface FilterItemProps {
    filterItem: Filter;
}

/**
 * Display a single filter.
 * @param filterItem - The filter to display.
 */
const FilterItem: React.FC<FilterItemProps> = ({ filterItem }) => {
    const dispatch = useAppDispatch();

    const filter = deepcopy(filterItem);

    // TODO: Need to find a more efficient way to show the available options, now adding this will make the processing extremely slow.
    // // Change when a state of checkbox is changed
    // const filters = useAppSelector(selectFilterList);
    // const fullRoutes = useAppSelector(selectPTRoutesFeatureList);
    // const ptStops = useAppSelector((state) => state.slice.ptStops);
    // const flag = useRef(true);
    // // Update the available options based on the changed filter
    // useEffect(() => {
    //     if (!flag.current) {
    //         const filteredList = fullRoutes.filter((route) =>
    //             checkCheckboxFilter(filter, route.properties[filter.optionKey]),
    //         );
    //             filters.forEach((otherFilter) => {
    //                 if (otherFilter.optionKey !== filter.optionKey) {
    //                     dispatch(
    //                         updateFilter({
    //                             ...otherFilter,
    //                             availableOptions: getOptions(
    //                                 otherFilter,
    //                                 filteredList,
    //                                 filteredList
    //                                     .map((item) => item.properties.stops_ids)
    //                                     .flat()
    //                                     .filter((v, i, a) => a.indexOf(v) == i)
    //                                     .map((item) => ptStops[item]),
    //                             ),
    //                         }),
    //                     );
    //                 }
    //             });
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [flag.current]);

    // Update the filter when a checkbox is clicked.
    const handleCheckboxFiltering = async (index: number) => {
        const newValue = displayedOptions[index];
        if (filter.variants.includes(newValue)) {
            filter.variants.splice(filter.variants.indexOf(newValue), 1);
        } else {
            filter.variants.push(newValue);
        }
        // flag.current = !flag.current;
        dispatch(updateFilter(filter));
    };

    // Handling user input for search an filter option.
    const [searchText, setSearchText] = useState<string>('');
    const [displayedOptions, setDisplayedOptions] = useState<string[]>(filter.options);

    const containsText = (text: string, searchText: string) =>
        text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    useEffect(() => {
        setDisplayedOptions(filter.options.filter((option) => containsText(option, searchText)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    // Filter option item component
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
        <MenuItem
            style={style}
            key={index}
            value={displayedOptions[index]}
            onClick={() => handleCheckboxFiltering(index)}
        >
            <Checkbox checked={filter.variants.includes(displayedOptions[index])} />
            <ListItemText
                primary={displayedOptions[index]}
                style={{ color: filter.availableOptions.includes(displayedOptions[index]) ? 'black' : '#d1d1d1' }}
            />
        </MenuItem>
    );

    return (
        <FormControl>
            <InputLabel>{filter.optionTitle}</InputLabel>
            <Select
                multiple
                value={filter.variants}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
            >
                <ListSubheader>
                    <TextField
                        size='small'
                        // Autofocus on textfield
                        autoFocus
                        placeholder='Type to search...'
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== 'Escape') {
                                // Prevents autoselecting item while typing (default Select behaviour)
                                e.stopPropagation();
                            }
                        }}
                    />
                </ListSubheader>
                <FixedSizeList
                    height={300}
                    itemData={filter}
                    itemSize={50}
                    itemCount={displayedOptions.length}
                    width={300}
                >
                    {Row}
                </FixedSizeList>
            </Select>
        </FormControl>
    );
};

export { FilterItem };
