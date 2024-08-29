import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function SimpleBackdrop({ open }) {

    return (
        <div>
            {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
            <Backdrop
                sx={{ color: '#fff', zIndex: 999 }}
                open={open}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
