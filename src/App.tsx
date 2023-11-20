import React from 'react';

import MapBoxContainer from './components/MapBoxContainer';
import { RoutesTable } from './components/Table/RoutesTable';
// import { StopsTable } from './components/Table/StopsTable';
import TopBar from './components/TopBar/TopBar';

function App() {
    return (
        <div>
            <TopBar />
            <MapBoxContainer />
            <RoutesTable />
            {/* <StopsTable /> */}
        </div>
    );
}

export default App;
