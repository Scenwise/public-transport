import React from 'react';

import './App.css';
import MapBoxContainer from './components/MapBoxContainer/MapBoxContainer';
import { RoutesTable } from './newComponents/Table/RoutesTable';
import { StopsTable } from './newComponents/Table/StopsTable';
import TopBar from './newComponents/TopBar/TopBar';

function App() {
    return (
        <div className='app'>
            <TopBar />
            <MapBoxContainer />
            <RoutesTable />
            <StopsTable />
        </div>
    );
}

export default App;
