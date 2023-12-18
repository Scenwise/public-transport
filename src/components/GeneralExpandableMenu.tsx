import React, { forwardRef, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

type GeneralMenuProps = {
    beforeExpanded: React.ReactNode;
    menuTitle: string;
    disabled?: boolean;
};

const GeneralExpandableMenu = forwardRef<HTMLDivElement, GeneralMenuProps & React.HTMLAttributes<HTMLDivElement>>(
    (props, ref) => {
        const { beforeExpanded, menuTitle, disabled, children, ...rest } = props;
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

        const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleMenuClose = () => {
            setAnchorEl(null);
        };

        const afterExpandedContentRef = ref as React.MutableRefObject<HTMLDivElement>;

        return (
            <>
                <Tooltip title={menuTitle} placement={'right'}>
                    <span>
                        <IconButton
                            color='inherit'
                            aria-label='Open menu'
                            onClick={handleMenuOpen}
                            disabled={disabled !== undefined ? disabled : false}
                            style={{ borderRadius: '50%' }}
                        >
                            {beforeExpanded}
                        </IconButton>
                    </span>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    anchorReference='anchorEl'
                >
                    <Stack sx={{ px: 1.5, py: 1 }} alignItems='stretch' gap={2} ref={afterExpandedContentRef} {...rest}>
                        {children}
                    </Stack>
                </Menu>
            </>
        );
    },
);

GeneralExpandableMenu.displayName = 'GeneralExpandableMenu';

export { GeneralExpandableMenu };
