import React from 'react';

import MapBoxContainer from './components/MapBoxContainer';
import { RoutesTable } from './components/Table/RoutesTable';
// import { StopsTable } from './components/Table/StopsTable';
import TopBar from './components/TopBar/TopBar';
import { VehicleMarkersProvider } from './components/Vehicles/VehicleMapContext';

function App() {
    return (
        <div>
            <TopBar />
            <VehicleMarkersProvider>
                <MapBoxContainer />
            </VehicleMarkersProvider>
            <RoutesTable />
            {/* <StopsTable /> */}
        </div>
    );
}

export default App;
