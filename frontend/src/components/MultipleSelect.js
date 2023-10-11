import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectCheckmarks({ apiEndpoint, label,  onChange}) {
    const [options, setOptions] = useState([]);
    const [selectedValues, setSelectedValues] = React.useState([]);

    useEffect(() => {
        // Fetch data from the API endpoint
        axios.get(apiEndpoint)
            .then(response => setOptions(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiEndpoint]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedValues(value);
        if (onChange) {
            onChange(value.map(id => parseInt(id, 10))); // Преобразование в числовой формат, если id - строка
        }
    };

    return (
        <div>
            <FormControl sx={{ width: '100%' }}>
                <InputLabel id={`demo-multiple-checkbox-label-${label}`}>{label}</InputLabel>
                <Select
                    labelId={`demo-multiple-checkbox-label-${label}`}
                    id={`demo-multiple-checkbox-${label}`}
                    multiple
                    value={selectedValues}
                    onChange={handleChange}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => {
                        const selectedNames = selected.map(id => {
                            const option = options.find(opt => opt.id === id);
                            return option ? option.name : '';
                        });
                        return selectedNames.join(', ');
                    }}
                    MenuProps={MenuProps}
                >
                    {options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={selectedValues.indexOf(option.id) > -1} />
                            <ListItemText primary={option.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
