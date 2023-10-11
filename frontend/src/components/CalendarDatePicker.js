import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ruRU } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';

// Import the necessary locale data
import 'dayjs/locale/ru';

// Set the locale for dayjs to Russian
dayjs.locale('ru');

export default function CalendarDatePicker({ onChange }) {
    const handleDateChange = (date) => {
        // Преобразовать date в нужный формат "YYYY-MM-DD"
        const formattedDate = date.format('YYYY-MM-DD');
        onChange(formattedDate);
    };

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
            dateFormats={{
                shortDate: 'DD.MM.YYYY', // Adjust the format as needed
                mediumDate: 'DD MMM YYYY', // Adjust the format as needed
                longDate: 'DD MMMM YYYY', // Adjust the format as needed
            }}
            locale={ruRU} // Важно передать объект локализации, а не только текстовые данные
        >
            <DemoContainer
                components={['DatePicker']}

            >
                <DatePicker
                    label="Срок выполнения цели"
                    onAccept={handleDateChange}
                    format="YYYY-MM-DD"
                    startDay="1" // Set the start day to Monday (1 corresponds to Monday)
                    sx={{
                        width: '100%',
                    }}
                />
            </DemoContainer>

        </LocalizationProvider>
    );
}