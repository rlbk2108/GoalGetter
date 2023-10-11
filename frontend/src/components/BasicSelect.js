import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

export default function BasicSelect({ label, apiEndpoint, onChange }) {
    const [data, setData] = React.useState([]);
    const [value, setValue] = React.useState('');
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        // Fetch data from the API endpoint
        axios.get(apiEndpoint)
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiEndpoint]);

    const handleChange = (event) => {
        setValue(event.target.value);
        if (onChange) {
            onChange(event);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <FormControl sx={{width: '100%' }}>
                <InputLabel id={`demo-${label}-select-label`}>{label}</InputLabel>
                <Select
                    labelId={`demo-${label}-select-label`}
                    id={`demo-${label}-select`}
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={value}
                    label={label}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>Ничего</em>
                    </MenuItem>
                    {data.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
