// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
//
// import { FormControlLabel, Switch, Typography } from '@mui/material';
// import {useAppSelector} from "../../store";
//
// /**
//  * Filter a list of alerts by visible ids.
//  *
//  * @param filterOn - Whether or not the filter is on
//  * @param visibleIds - The ids of the alerts that are visible
//  * @param alerts - The alerts to filter
//  *
//  * @returns The filtered alerts
//  */
// export const filterAlertsByVisibleIds = (
//     filterOn: boolean,
//     visibleIds: string[],
//     alerts: T[],
// ): T[] => {
//     if (!filterOn) return alerts;
//     return alerts.filter(({ id }) => visibleIds.includes(id));
// };
//
// const FilterVisibleSwitch: React.FC = () => {
//     const dispatch = useDispatch();
//     const visibleFiltering = useAppSelector(state => state.slice.visibleFilter);
//
//     const handleSwitchChange = () => {
//         const newFiltering = { ...visibleFiltering };
//         newFiltering.isOn = !newFiltering.isOn;
//         dispatch(changeVisibleFilterState(newFiltering));
//     };
//
//     return (
//         <FormControlLabel
//             sx={{ ml: 0, mr: 1 }}
//             control={
//                 <Switch onChange={handleSwitchChange} checked={visibleFiltering.isOn} color='primary' size='small' />
//             }
//             label={<Typography variant='caption'>Only show alerts on screen</Typography>}
//             disableTypography
//         />
//     );
// };
//
// export default FilterVisibleSwitch;
export {};
