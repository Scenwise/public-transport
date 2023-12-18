import React from 'react';

import MapIcon from '@mui/icons-material/Map';

import { GeneralExpandableMenu } from '../../GeneralExpandableMenu';
import { LayersClickabilityToggle } from './LayersClickabilityToggle';
import MapStyleSelector from './MapStyleSelector';
import { OffsetSlider } from './OffsetSlider';

/**
 * Setting related to the map and its layers, allow to change:
 * - different map styles
 * - line offset of the routes
 * - ability to click on the routes and/or the stops layers
 */
const MapSetting: React.FC = () => {
    return (
        <GeneralExpandableMenu beforeExpanded={<MapIcon />} menuTitle={'Map Settings'}>
            <OffsetSlider />
            <MapStyleSelector />
            <LayersClickabilityToggle />
        </GeneralExpandableMenu>
    );
};

export { MapSetting };
