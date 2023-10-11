// InputTextField.js
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function InputTextField({ value, onChange, error }) {
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': {width: '100%' },
            }}
            noValidate
            autoComplete="on"
        >
            <TextField
                id="outlined-basic"
                label="Название цели"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={error} // Поддержка состояния ошибки
                helperText={error ? 'Пожалуйста, заполните поле' : ''} // Текст ошибки
            />
        </Box>
    );
}
