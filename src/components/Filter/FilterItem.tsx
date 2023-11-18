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

import { selectFilterList, selectPTRoutesFeatureList, updateFilter } from '../../dataStoring/slice';
import { getOptions } from '../../hooks/filterHook/useInitiateFilterOptions';
import { checkCheckboxFilter } from '../../hooks/filterHook/useUpdateRoutesWithFilter';
import { useAppDispatch, useAppSelector } from '../../store';

interface FilterItemProps {
    filterItem: Filter;
}

/**
 * Display a single filter.
 * @param filterItem - The filter to display.
 */
const FilterItem: React.FC<FilterItemProps> = ({ filterItem }) => {
    const dispatch = useAppDispatch();

    const filters = useAppSelector(selectFilterList);
    const fullRoutes = useAppSelector(selectPTRoutesFeatureList);

    const filter = deepcopy(filterItem);
    const [flag, setFlag] = useState(true);

    // Update the available options based on the changed filter
    useEffect(() => {
        const filteredList = fullRoutes.filter((route) =>
            checkCheckboxFilter(filter, route.properties[filter.optionKey]),
        );
        filters.forEach((otherFilter) => {
            if (otherFilter.optionKey !== filter.optionKey) {
                dispatch(
                    updateFilter({
                        ...otherFilter,
                        availableOptions: getOptions(otherFilter, filteredList),
                    }),
                );
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    // Update the filter when a checkbox is clicked.
    const handleCheckboxFiltering = async (index: number) => {
        const newValue = displayedOptions[index];
        if (filter.variants.includes(newValue)) {
            filter.variants.splice(filter.variants.indexOf(newValue), 1);
        } else {
            filter.variants.push(newValue);
        }
        setFlag(!flag);
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
