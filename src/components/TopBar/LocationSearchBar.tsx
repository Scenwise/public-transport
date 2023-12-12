import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import SearchIcon from '@mui/icons-material/Search';
import { Card, ListItemText, Popper } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import { selectPTRoutesFeatureList, updateSelectedRoute } from '../../dataStoring/slice';
import { useAppDispatch, useAppSelector } from '../../store';

const LocationSearchBar: React.FC = () => {
    const ptRoutes: PTRouteFeature[] = useAppSelector(selectPTRoutesFeatureList);
    const dispatch = useAppDispatch();
    const [departureValue, setDepartureValue] = useState('');
    const [destinationValue, setDestinationValue] = useState('');
    const [departureOptions, setDepartureOptions] = useState<string[]>([]);
    const [destinationOptions, setDestinationOptions] = useState<string[]>([]);

    const [departureAnchorEl, setDepartureAnchorEl] = useState<HTMLDivElement | null>(null);
    const [destinationAnchorEl, setDestinationAnchorEl] = useState<HTMLDivElement | null>(null);

    const departurePopperRef = useRef<HTMLDivElement>(null);
    const destinationPopperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                departurePopperRef.current &&
                !departurePopperRef.current.contains(event.target as Node) &&
                departureAnchorEl &&
                !departureAnchorEl.contains(event.target as Node)
            ) {
                setDepartureAnchorEl(null);
            }
            if (
                destinationPopperRef.current &&
                !destinationPopperRef.current.contains(event.target as Node) &&
                destinationAnchorEl &&
                !destinationAnchorEl.contains(event.target as Node)
            ) {
                setDestinationAnchorEl(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [departureAnchorEl, destinationAnchorEl]);

    /**
     * Function to filter the options based on the input value
     * @param field The field in each feature to filter on
     * @param ptRouteFeatures THe ptRoutes list
     * @param value The input value from the user to filter the list
     */
    const getFilteredOptions = (field: string, ptRouteFeatures: PTRouteFeature[], value: string): string[] => {
        return ptRouteFeatures
            .filter((route) => route.properties[field].toLowerCase().includes(value.toLowerCase()))
            .map((route) => route.properties[field])
            .sortAndUnique();
    };

    const handleDepartureChange = (value: string) => {
        setDepartureValue(value);
        // Filter origin values based on input
        const filteredOrigins = getFilteredOptions('origin', ptRoutes, value);
        setDepartureOptions(filteredOrigins);
    };

    const handleDestinationChange = (value: string) => {
        setDestinationValue(value);
        // Filter destination values based on input
        const filteredDestinations = getFilteredOptions(
            'destination',
            ptRoutes.filter((route) => route.properties.origin == departureValue),
            value,
        );
        setDestinationOptions(filteredDestinations);
    };

    const handleDepartureSelection = (selectedValue: string) => {
        handleDepartureChange(selectedValue);
        setDepartureValue(selectedValue);
        setDepartureAnchorEl(null);
    };

    const handleDestinationSelection = (selectedValue: string) => {
        handleDestinationChange(selectedValue);
        setDestinationValue(selectedValue);
        setDestinationAnchorEl(null);
    };

    const handleClick = () => {
        if (departureValue && destinationValue) {
            const res = ptRoutes.filter(
                (route) =>
                    route.properties.origin == departureValue && route.properties.destination == destinationValue,
            )[0];
            dispatch(updateSelectedRoute(res.properties.shape_id + ''));
        }
    };

    const departureRow = ({ index, style }: { index: number; style: React.CSSProperties }) => (
        <MenuItem
            style={style}
            key={index}
            value={departureOptions[index]}
            onClick={() => handleDepartureSelection(departureOptions[index])}
        >
            <ListItemText key={index} primary={departureOptions[index]}>
                {departureOptions[index]}
            </ListItemText>
        </MenuItem>
    );

    const destinationRow = ({ index, style }: { index: number; style: React.CSSProperties }) => (
        <MenuItem
            style={style}
            key={index}
            value={destinationOptions[index]}
            onClick={() => handleDestinationSelection(destinationOptions[index])}
        >
            <ListItemText key={index} primary={destinationOptions[index]}>
                {destinationOptions[index]}
            </ListItemText>
        </MenuItem>
    );

    return (
        <>
            <Stack alignItems='center' direction='row'>
                <Stack alignItems='center'>
                    <input
                        placeholder='Departure'
                        value={departureValue}
                        onChange={(e) => handleDepartureChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== 'Escape') {
                                // Prevents autoselecting item while typing (default Select behaviour)
                                e.stopPropagation();
                            }
                        }}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
                            setDepartureAnchorEl(event.currentTarget)
                        }
                    />
                    {departureOptions.length > 0 && (
                        <Popper
                            open={!!departureAnchorEl}
                            anchorEl={departureAnchorEl}
                            placement='bottom-start'
                            style={{ zIndex: 1 }}
                        >
                            <Card
                                ref={departurePopperRef}
                                style={{ marginTop: '8px', width: 'auto', height: '50%', overflow: 'sroll' }}
                            >
                                <FixedSizeList
                                    height={Math.min(300, 50 * departureOptions.length)}
                                    itemData={departureOptions}
                                    itemSize={50}
                                    itemCount={departureOptions.length}
                                    width={350}
                                >
                                    {departureRow}
                                </FixedSizeList>
                            </Card>
                        </Popper>
                    )}
                    <input
                        placeholder='Destination'
                        value={destinationValue}
                        onChange={(e) => handleDestinationChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== 'Escape') {
                                // Prevents autoselecting item while typing (default Select behaviour)
                                e.stopPropagation();
                            }
                        }}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
                            setDestinationAnchorEl(event.currentTarget)
                        }
                    />
                    {destinationOptions.length > 0 && (
                        <Popper
                            open={!!destinationAnchorEl}
                            anchorEl={destinationAnchorEl}
                            placement='bottom-start'
                            style={{ zIndex: 1 }}
                        >
                            <Card
                                ref={destinationPopperRef}
                                style={{ marginTop: '8px', width: 'auto', height: '50%', overflow: 'sroll' }}
                            >
                                <FixedSizeList
                                    height={Math.min(300, 50 * destinationOptions.length)}
                                    itemData={destinationOptions}
                                    itemSize={50}
                                    itemCount={destinationOptions.length}
                                    width={350}
                                >
                                    {destinationRow}
                                </FixedSizeList>
                            </Card>
                        </Popper>
                    )}
                </Stack>
                <Toolbar>
                    <IconButton color='inherit' onClick={handleClick}>
                        <SearchIcon />
                    </IconButton>
                </Toolbar>
            </Stack>
        </>
    );
};

export { LocationSearchBar };
