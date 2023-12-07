import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';

const Clock: React.FC = () => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    return (
        <Typography variant='h6' noWrap={true}>
            {time}
        </Typography>
    );
};

export default Clock;
