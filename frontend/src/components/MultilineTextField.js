import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MultilineTextField({ onChange }) {
    const handleDescriptionChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': {width: '100%' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Описание"
                    multiline
                    maxRows={4}
                    onChange={handleDescriptionChange}
                />
            </div>
        </Box>
    );
}
