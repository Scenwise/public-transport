import React, { useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Timeline } from '@mui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { useAppSelector } from '../store';
import { TPScheduleElement } from './TralisScheduleElement';

const useStyles = makeStyles(() => ({
    iconBtn: {
        marginRight: 0,
    },
}));
interface VehicleLabelPropType {
    labelName: string;
}
const VehicleLabel = ({ labelName }: VehicleLabelPropType) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current as unknown as HTMLCanvasElement;
        canvas.width = 45;
        canvas.height = 45;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.textAlign = 'center';
        const circle = new Path2D();
        circle.arc(22, 22, 20, 0, 2 * Math.PI);
        ctx.fill(circle);
        ctx.stroke(circle);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 13px Calibri';
        ctx.fillText(labelName, 22, 24, 33);
    }, [labelName]);

    return <canvas ref={canvasRef} />;
};

const PTSchedule: React.FC = () => {
    // Keep track if the schedule is expanded or folded
    const [expand, setExpand] = React.useState(false);
    // For the resizability of the schedule
    const [width, setWidth] = React.useState(380);
    const [height, setHeight] = React.useState(440);

    const ptRoutesFeatures = useAppSelector((state) => state.slice.ptRoutes);
    const ptStopsFeatures = useAppSelector((state) => state.slice.ptStops);

    // const ptRoutes = useAppSelector(selectPTRoutesFeatureList).map((feature) => feature.properties);
    const selectedRouteID = useAppSelector((state) => state.slice.selectedRoute);

    let ptRouteProperty = {} as PTRouteProperties;
    let ptStopsProperty = [] as PTStopProperties[];

    if (selectedRouteID != '') {
        ptRouteProperty = ptRoutesFeatures[selectedRouteID].properties;
        ptStopsProperty = ptRouteProperty.stops_ids.map((id) => ptStopsFeatures[id].properties);
    }

    // Some routes contain multiple identical stops, and it causes the error of "Encountered two children with the same key"
    // This is a fix to that problem
    // const duplicateIndicesRecord : Record<string, number[]> = {};
    // ptStopsProperty.forEach((item, index) => {
    //     const stopId = item.stopId;
    //     if (duplicateIndicesRecord[stopId] === undefined) {
    //         duplicateIndicesRecord[stopId] = [index];
    //     } else {
    //         duplicateIndicesRecord[stopId].push(index);
    //     }
    // });
    // const duplicateIndices = Object.values(duplicateIndicesRecord).filter(indices => indices.length > 1);
    // console.log(ptStopsProperty.length)
    // console.log(duplicateIndicesRecord)
    // console.log(duplicateIndices)
    const toggleAccordion = () => {
        setExpand((prev) => !prev);
    };

    useEffect(() => {
        setWidth(380);
        setHeight(440);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRouteID]);

    const classes = useStyles();

    return (
        <>
            {selectedRouteID != '' && (
                <Box position='absolute' key={selectedRouteID}>
                    <Rnd
                        default={{ x: 2, y: 415, width: 380, height: 84 }}
                        size={expand ? { width: width, height: height } : { width: width, height: 84 }}
                        onResize={(e, direction, ref) => {
                            setWidth(ref.offsetWidth);
                            setHeight(ref.offsetHeight);
                        }}
                        style={{ zIndex: 1 }}
                    >
                        <Accordion expanded={expand} style={{ overflow: 'hidden' }}>
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon
                                        style={{ marginRight: '0px' }}
                                        onClick={toggleAccordion}
                                        className={classes.iconBtn}
                                    />
                                }
                                style={{ cursor: 'move', zoom: 0.75 }}
                                aria-controls='panel-content'
                                id='panel-header'
                                className='draggable-panel-title'
                            >
                                <Stack>
                                    <Typography variant='h5' style={{ textAlign: 'left' }}>
                                        Schedule + {selectedRouteID}
                                    </Typography>
                                    <Stack direction={'row'} style={{ marginTop: 10 }}>
                                        <VehicleLabel labelName={ptRouteProperty.line_number} />
                                        <Typography
                                            variant='body1'
                                            style={{
                                                marginLeft: 10,
                                                marginTop: 10,
                                                height: 20,
                                                display: 'inline-block',
                                                left: 60,
                                                textAlign: 'left',
                                            }}
                                        >
                                            <b>
                                                {ptRouteProperty.destination} ({ptRouteProperty.route_id}){' '}
                                            </b>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails
                                style={{
                                    overflowY: 'auto',
                                    whiteSpace: 'nowrap',
                                    maxHeight: height,
                                    height: height,
                                    zoom: 0.75,
                                }}
                            >
                                <Timeline
                                    sx={{
                                        '& .MuiTimelineItem-root:before': {
                                            flex: 0,
                                        },
                                    }}
                                >
                                    {ptStopsProperty.map((stop, index) => (
                                        <TPScheduleElement
                                            stop={stop}
                                            first={index === 0}
                                            last={index >= ptStopsProperty.length - 1}
                                            key={selectedRouteID + '_' + index}
                                        />
                                    ))}
                                </Timeline>
                            </AccordionDetails>
                        </Accordion>
                    </Rnd>
                </Box>
            )}
        </>
    );
};

export { PTSchedule };
