import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ruRU } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';

// Import the necessary locale data
import 'dayjs/locale/ru';
import FormControl from "@mui/material/FormControl";

// Set the locale for dayjs to Russian
dayjs.locale('ru');

export default function CalendarDatePicker({ value, onChange }) {
    const handleDateChange = (date) => {
        // Ensure that date is a valid Dayjs object
        const formattedDate = dayjs(date);
        onChange(formattedDate);
    };

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
            dateFormats={{
                shortDate: 'DD.MM.YYYY',
                mediumDate: 'DD MMM YYYY',
                longDate: 'DD MMMM YYYY',
            }}
            locale={ruRU}
        >
            <DemoContainer components={['DatePicker']} sx={{width:'100%', padding: 0}}>

                <DatePicker
                    label="Срок выполнения"
                    onAccept={handleDateChange}
                    format="YYYY-MM-DD"
                    value={value ? dayjs(value) : null} // Convert value to Dayjs object
                    startDay="1"
                    sx={{
                        width: '100%',
                        minWidth: 0
                    }}
                />

            </DemoContainer>
        </LocalizationProvider>
    );
}