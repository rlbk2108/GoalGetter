// InputTextField.js
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import '../pages/GoalsList.css';

export default function InputTextField({ value, onChange, error }) {
    return (
        <Box
            component="form"
            sx={{
                width: '100%',
                marginTop: '32px',
                alignSelf: 'stretch',
            }}
            noValidate
            autoComplete="on"
        >
            <TextField

                label="Название цели"
                sx={{
                    width:'100%',
                }}
                value={value}
                className="home-input input"
                size={"small"}
                onChange={onChange}
                error={error} // Поддержка состояния ошибки
                helperText={error ? 'Пожалуйста, заполните поле' : ''} // Текст ошибки
            />
        </Box>
    );
}
