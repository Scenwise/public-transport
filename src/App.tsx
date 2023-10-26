import './App.css';
import MapBoxContainer from './components/MapBoxContainer/MapBoxContainer';
import { PTSchedule } from './newComponents/PTSchedule';
import { RouteList } from './newComponents/RouteList';

function App() {
    return (
        <div className='app'>
            <MapBoxContainer />
            <RouteList />
            <PTSchedule />
        </div>
    );
}

export default App;
