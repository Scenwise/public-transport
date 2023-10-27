import React from 'react';

import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

interface TralisScheduleElementPropType {
    stop: PTStopProperties;
    last: boolean;
}

/**
 * Provide ach station information of timeline schedule of the public transportation.
 * @param stop A public transportation station object contains arrived time, departure time and so on.
 * @param last Use for check if the stop is the last, if so, there will be no departure time and a timeline connector won't be drawn below it.
 */
const TPScheduleElement: React.FC<TralisScheduleElementPropType> = ({ stop, last }) => {
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot color={'primary'} />
                {!last && <TimelineConnector style={{ backgroundColor: '#0080c9' }} />}
            </TimelineSeparator>
            <TimelineContent color={'#000000'}>{stop.stopName + ' ' + stop.stopId}</TimelineContent>
        </TimelineItem>
    );
};

export { TPScheduleElement };
