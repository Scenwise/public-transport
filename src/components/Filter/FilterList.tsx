import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '@mui/material';

import { selectFilterList, selectPTStopsFeatureList, updateFilters } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { GeneralExpandableMenu } from '../GeneralExpandableMenu';
import DelayFilter from './DelayFilter';
import { FilterItem } from './FilterItem';
import FilterVisibleSwitch from './FilterVisibleSwitch';

const FilterList: React.FC = () => {
    const dispatch = useAppDispatch();

    const filters = useAppSelector(selectFilterList);
    const initialFilters = useAppSelector((state) => state.slice.initialFilters);
    const routeFeatures = useAppSelector(selectPTStopsFeatureList);

    // If there are no routes, the filter menu should be disabled
    const isDisabled = routeFeatures ? routeFeatures.length == 0 : false;

    const handleClearFilters = () => {
        dispatch(updateFilters(initialFilters));
    };

    return (
        <GeneralExpandableMenu
            beforeExpanded={<FilterListIcon />}
            menuTitle={'Routes filter'}
            disabled={isDisabled}
            style={{ maxWidth: '300px' }}
        >
            {filters
                .filter((filter) => filter.optionKey !== 'delay')
                .map((filter) => (
                    <FilterItem key={filter.optionTitle} filterItem={filter} />
                ))}

            <FilterVisibleSwitch />
            <DelayFilter />
            <Button variant='contained' endIcon={<DeleteIcon />} onClick={handleClearFilters}>
                Clear filters
            </Button>
        </GeneralExpandableMenu>
    );
};

export { FilterList };
