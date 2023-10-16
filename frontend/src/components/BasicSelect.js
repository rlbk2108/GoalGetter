import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import Cookies from "js-cookie";

export default function BasicSelect({ label, apiEndpoint, value, onChange }) {
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    // Set initial value from the prop
    const [selectedValue, setSelectedValue] = React.useState(value || '');

    React.useEffect(() => {
        // Fetch data from the API endpoint
        const accessToken = Cookies.get('access_token');
        axios.get(apiEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setData(response.data);
                // Synchronize selectedValue with the value prop
                setSelectedValue(value || '');
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [apiEndpoint, value]); // Include value in the dependency array

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedValue(selectedValue);
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
            <FormControl sx={{ width: '100%' }}>
                <InputLabel id={`demo-${label}-select-label`}>{label}</InputLabel>
                <Select
                    labelId={`demo-${label}-select-label`}
                    id={`demo-${label}-select`}
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={selectedValue} // Use selectedValue as the value
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