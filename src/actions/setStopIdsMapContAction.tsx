import Stop from '../interfaces/Stops';

const setStopIdsMapContAction = (stopIdMapCont: Map<number, Stop>|null) => {
    return {
        type: "SET_STOPIDSMAPCONT",
        payload: stopIdMapCont
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {setStopIdsMapContAction};