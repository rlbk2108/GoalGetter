import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MultilineTextField({ value, onChange }) {
    const handleDescriptionChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    id="outlined-multiline-static"
                    label="Описание"
                    sx={{
                        width: '100%',
                    }}
                    value={value}
                    multiline
                    rows={4}
                    onChange={handleDescriptionChange}
                />
            </div>
        </Box>
    );
}
