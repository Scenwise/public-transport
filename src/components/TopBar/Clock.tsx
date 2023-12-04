import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Clock: React.FC = () => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    return (
        <Stack direction='column' alignItems='center'>
            <Typography variant='h6' noWrap={true}>
                {time}
            </Typography>
        </Stack>
    );
};

export default Clock;
