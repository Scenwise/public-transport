import './App.css';
import MapBoxContainer from './components/MapBoxContainer/MapBoxContainer';
import { PTSchedule } from './newComponents/PTSchedule';
import { RouteList } from './newComponents/RouteList';
import TopBar from './newComponents/TopBar/TopBar';

function App() {
    return (
        <div className='app'>
            <TopBar />
            <MapBoxContainer />
            <RouteList />
            <PTSchedule />
        </div>
    );
}

export default App;
