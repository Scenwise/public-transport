import * as React from 'react';
import { CSVLink } from 'react-csv';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { IconButton, Tooltip } from '@mui/material';

import { useAppSelector } from '../../store';

const CsvExport: React.FC = () => {
    const filteredRoutes = useAppSelector((state) => state.slice.filteredRoutes)
        .map((route) => route.properties)
        .map((route) => ({
            origin: route.origin,
            destination: route.destination,
            'line number': route.line_number,
            agency: route.agency_id,
            'vehicle type': route.vehicle_type,
            'route id': route.route_id + '',
            'shape id': route.shape_id + '',
        }));

    return (
        <CSVLink
            data={filteredRoutes}
            filename={'public-transport-routes.csv'}
            target='_blank'
            style={{ textDecoration: 'none' }}
        >
            <Tooltip title='Export' placement={'right'}>
                <IconButton>
                    <CloudDownloadIcon style={{ color: '#ffffff' }} />
                </IconButton>
            </Tooltip>
        </CSVLink>
    );
};
export { CsvExport };
