import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BasicSelect from '../components/BasicSelect';
import MultipleSelect from '../components/MultipleSelect';
import CalendarDatePicker from '../components/CalendarDatePicker';
import InputTextField from '../components/InputTextField';
import MultilineTextField from '../components/MultilineTextField';
import dayjs from "dayjs";
import './Goals.css'; // Подключение CSS-файла для дополнительных стилей
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Goals() {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [tagSelectedValues, setTagSelectedValues] = useState([]);
    const [reminderSelectedValues, setReminderSelectedValues] = useState([]);
    const [prioritySelectedValue, setPrioritySelectedValue] = useState('');
    const [statusSelectedValue, setStatusSelectedValue] = useState('');
    const [categorySelectedValue, setCategorySelectedValue] = useState('');
    const [titleError, setTitleError] = useState(false); // Новое состояние для ошибки
    const [deadlineError, setDeadlineError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    const handleClose = () => {
        setShow(false);
        setTitle('');
        setDescription('');
        setDeadline(null);
        setTagSelectedValues([]);
        setReminderSelectedValues([]);
        setPrioritySelectedValue('');
        setStatusSelectedValue('');
        setCategorySelectedValue('');
        setTitleError(false); // Сброс ошибки при закрытии модального окна
    };
    const handleShow = () => setShow(true);

    const sendDataToApi = async () => {
        try {

            console.log('Sending data to the server:', {
                title,
                description,
                deadline,
                category: categorySelectedValue,
                tag: tagSelectedValues,
                status: statusSelectedValue,
                priority: prioritySelectedValue,
                reminder: reminderSelectedValues,
            });
            // Проверка на пустое название цели
            if (!title.trim()) {
                setTitleError(true);
                return;
            }

            // Проверка на пустой или неправильный срок выполнения цели
            if (dayjs(deadline).isBefore(dayjs().startOf('day'))) {
                setDeadlineError(true);
                return;
            }
            if (descriptionError) {
                return;
            }


            // Используйте Axios для отправки данных на сервер
            const response = await axios.post('http://127.0.0.1:8000/api/goal_create/', {
                title,
                description,
                deadline,
                category: categorySelectedValue,
                tag: tagSelectedValues,
                status: statusSelectedValue,
                priority: prioritySelectedValue,
                reminder: reminderSelectedValues,
            });

            console.log(response.data); // Логирование ответа сервера (если нужно)
            handleClose(); // Закрытие модального окна после успешной отправки
        } catch (error) {
            console.error('Ошибка при отправке данных:', error.response);
        }
    };


    const handleGoalNameChange = (event) => {
        setTitle(event.target.value);
        setTitleError(false); // Сброс ошибки при изменении значения
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);

        // Проверка на ошибку в описании (превышение лимита символов)
        if (value.length > 500) {
            setDescriptionError(true);
        } else {
            setDescriptionError(false);
        }
    };

    const handleDateChange = (date) => {
        setDeadline(date);
        setDeadlineError(false); // Сброс ошибки при изменении значения
    };

    const handleCategoryChange = (event) => {
        setCategorySelectedValue(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setPrioritySelectedValue(event.target.value);
    };

    const handleReminderChange = (selectedValues) => {
        // Assuming selectedValues is an array of selected values
        setReminderSelectedValues(selectedValues);
    };

    const handleStatusChange = (event) => {
        setStatusSelectedValue(event.target.value);
    };

    const handleTagChange = (values) => {
        setTagSelectedValues(values);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="Button-primary">
                Добавить цель
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Создать цель</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputTextField
                        value={title}
                        onChange={handleGoalNameChange}
                        error={titleError} // Передача состояния ошибки в компонент InputTextField
                    />
                    <MultilineTextField onChange={handleDescriptionChange} error={descriptionError} />
                    <CalendarDatePicker onChange={handleDateChange} error={deadlineError} />
                    {deadlineError && <div style={{ color: 'red' }}>Дата должна быть не раньше сегодняшней даты</div>}
                    <BasicSelect field="category" apiEndpoint="http://127.0.0.1:8000/api/category/" label="Категория" onChange={handleCategoryChange} />
                    <MultipleSelect apiEndpoint="http://127.0.0.1:8000/api/tag/" label="Теги" onChange={handleTagChange} />
                    <BasicSelect field="status" apiEndpoint="http://127.0.0.1:8000/api/status/" label="Статус" onChange={handleStatusChange} />
                    <BasicSelect field="priority" apiEndpoint="http://127.0.0.1:8000/api/priority/" label="Приоритет" onChange={handlePriorityChange} />
                    <MultipleSelect apiEndpoint="http://127.0.0.1:8000/api/week_days/" label="Напоминание" onChange={handleReminderChange} />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className="Button-secondary">
                        Закрыть
                    </Button>
                    <Button onClick={sendDataToApi} className="Button-primary">
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Goals;