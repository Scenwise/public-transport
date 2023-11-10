import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Menu, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { selectFilterList, selectPTStopsFeatureList, updateFilters } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { FilterItem } from './FilterItem';
import FilterVisibleSwitch from './FilterVisibleSwitch';

const FilterList: React.FC = () => {
    const dispatch = useAppDispatch();

    // For open and close of the filter menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const filters = useAppSelector(selectFilterList);
    const initialFilters = useAppSelector((state) => state.slice.initialFilters);
    const routeFeatures = useAppSelector(selectPTStopsFeatureList);

    // If there are no routes, the filter menu should be disabled
    const isDisabled = routeFeatures ? routeFeatures.length == 0 : false;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleClearFilters = () => {
        dispatch(updateFilters(initialFilters));
    };

    return (
        <>
            <Tooltip title={'Routes Filter'} placement={'right'}>
                <span>
                    <IconButton
                        color='inherit'
                        aria-label='Route filter'
                        onClick={handleMenuOpen}
                        disabled={isDisabled}
                        style={{ borderRadius: '50%' }}
                    >
                        <FilterListIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Stack sx={{ px: 1.5, py: 1, width: 250 }} alignItems='stretch' gap={2}>
                    {filters.map((filter) => (
                        <FilterItem key={filter.optionTitle} filterItem={filter} />
                    ))}
                    <FilterVisibleSwitch />
                    <Button variant='contained' endIcon={<DeleteIcon />} onClick={handleClearFilters}>
                        Clear filters
                    </Button>
                </Stack>
            </Menu>
        </>
    );
};

export { FilterList };
