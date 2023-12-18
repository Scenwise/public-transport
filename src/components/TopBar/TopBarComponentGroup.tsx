import React, { ReactNode } from 'react';

import { Divider, Stack } from '@mui/material';

type TopBarComponentGroupProps = {
    children: ReactNode;
    justifyContent?: string;
};

/**
 * Use to group the components in the top bar, divide each group with a divider.
 * @param children The grouped components
 * @param justifyContent The position of the group
 * @constructor
 */
const TopBarComponentGroup: React.FC<TopBarComponentGroupProps> = ({ children, justifyContent }) => {
    const CustomDivider = () => (
        <Divider
            orientation='vertical'
            variant='middle'
            flexItem
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
    );
    return (
        <>
            {justifyContent != 'flex-start' && <CustomDivider />}
            <Stack direction='row' spacing={5} sx={{ flexGrow: 1 }} justifyContent={justifyContent} alignItems='center'>
                {children}
            </Stack>
            {justifyContent != 'flex-end' && <CustomDivider />}
        </>
    );
};

export { TopBarComponentGroup };
