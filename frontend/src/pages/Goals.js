import React, { useState, useEffect } from 'react';
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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

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
    const [goals, setGoals] = useState([]);
    const [categories, setCategories] = useState({});

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/goal_create/');
                setGoals(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/category/');
                const categoriesData = response.data.reduce((acc, category) => {
                    acc[category.id] = category.name;
                    return acc;
                }, {});
                setCategories(categoriesData);
            } catch (error) {
                console.error('Ошибка при получении данных о категориях:', error);
            }
        };

        fetchGoals();
        fetchCategories();
    }, []); // Пустой массив зависимостей означает, что эффект будет вызван только после монтирования компонента

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
                    <MultilineTextField onChange={handleDescriptionChange} />
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
            <ul>
                {goals.map(goal => (
                    <li key={goal.id}>
                        <p>{goal.title}</p>
                        <div>
                            {goal.deadline && (
                                <>
                                    <EventAvailableIcon fontSize="small" /> {/* Иконка события */}
                                    <p>{dayjs(goal.deadline).format("DD.MM.YYYY")}</p>
                                </>
                            )}
                            <p>{categories[goal.category]}</p>
                        </div>
                        {/* Добавьте остальные поля, которые вам нужны */}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Goals;