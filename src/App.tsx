import './App.css';
import MainComponent from './components/MainComponent/MainComponent'
import { withStore } from "react-context-hook";


const initialOffset = { offset: 0 }

function App() {
  return (
    <MainComponent/>
  );
}

export default withStore(App, initialOffset);
