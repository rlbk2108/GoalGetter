import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MultilineTextField({ onChange, error }) {
    const [text, setText] = React.useState('');

    const handleDescriptionChange = (event) => {
        const newText = event.target.value;
        setText(newText);

        // Проверка на количество символов
        if (newText.length <= 500) {
            onChange(newText);
        }
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { width: '100%' },
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
                    value={text}
                    error={error}
                    helperText={error && "Вы превысили лимит по количеству символов"}
                />
            </div>
        </Box>
    );
}
