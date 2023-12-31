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
import Cookies from 'js-cookie';
import EditGoalModal from "./EditGoalForm";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationModal from './DeleteConfirmationModal';

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
    const [editModalShow, setEditModalShow] = useState(false); // State for showing/hiding edit modal
    const [selectedGoal, setSelectedGoal] = useState(null); // State to store the goal being edited
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    useEffect(() => {

        const fetchGoals = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                const response = await axios.get(
                    'http://127.0.0.1:8000/api/goal_create/',{
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                setGoals(response.data);

            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                const response = await axios.get(
                    'http://127.0.0.1:8000/api/category/',{
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    });
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
    const handleEditClick = (goal) => {
        setSelectedGoal(goal);
        setEditModalShow(true);
    };

    const handleSaveEditedGoal = async (editedGoalData) => {
        try {
            const goalId = selectedGoal;
            const accessToken = Cookies.get('access_token');

            // Check if deadline exists before calling format
            const deadlineFormatted = editedGoalData.deadline ? editedGoalData.deadline.format('YYYY-MM-DD') : null;

            const response = await axios.put(
                `http://127.0.0.1:8000/api/goals/${goalId}/`,
                {
                    id: editedGoalData.id,
                    title: editedGoalData.title,
                    description: editedGoalData.description,
                    deadline: deadlineFormatted, // Use the formatted deadline
                    category: editedGoalData.category,
                    tag: editedGoalData.tag,
                    status: editedGoalData.status,
                    priority: editedGoalData.priority,
                    reminder: editedGoalData.reminder,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data); // Log the response if needed

            // Update the goals list after successful update
            const updatedResponse = await axios.get(
                'http://127.0.0.1:8000/api/goal_create/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setGoals(updatedResponse.data);
        } catch (error) {
            if (error.response) {
                console.error('Error updating goal 1:', error.response);
            } else {
                console.error('Error updating goal 2:', error.message);
            }
        }
    };


    const sendDataToApi = async () => {
        try {
            console.log('Sending data to the server:', {
                title,
                description,
                deadline: dayjs(deadline).format('YYYY-MM-DD'), // Format the deadline here
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
            const accessToken = Cookies.get('access_token');
            const response = await axios.post(
                'http://127.0.0.1:8000/api/goal_create/',
                {
                    title,
                    description,
                    deadline: deadline ? dayjs(deadline).format('YYYY-MM-DD') : null,
                    category: categorySelectedValue,
                    tag: tagSelectedValues,
                    status: statusSelectedValue,
                    priority: prioritySelectedValue,
                    reminder: reminderSelectedValues,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data); // Логирование ответа сервера (если нужно)
            handleClose(); // Закрытие модального окна после успешной отправки

            // После успешного создания цели, отправляем GET-запрос для обновления списка целей
            const updatedResponse = await axios.get(
                'http://127.0.0.1:8000/api/goal_create/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
            setGoals(updatedResponse.data);

        } catch (error) {
            console.error('Ошибка при отправке данных:', error.response);
        }
    };

    const confirmDelete = async (goalId) => {
        const result = window.confirm(`Вы уверены, что хотите удалить цель с ID ${goalId}?`);
        if (result) {
            await deleteGoal(goalId);
        }
    };
    const deleteGoal = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            await axios.delete(`http://127.0.0.1:8000/api/goals/${goalToDelete.id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Обновите список целей после успешного удаления
            const updatedResponse = await axios.get('http://127.0.0.1:8000/api/goal_create/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setGoals(updatedResponse.data);

            // Закройте модальное окно подтверждения после удаления
            closeDeleteConfirmation();
        } catch (error) {
            console.error('Ошибка при удалении цели:', error);
        }
    };

    const openDeleteConfirmation = (goalId, goalTitle) => {
        setGoalToDelete({ id: goalId, title: goalTitle });
        setShowDeleteConfirmation(true);
    };

    // Функция для закрытия модального окна подтверждения
    const closeDeleteConfirmation = () => {
        setGoalToDelete(null);
        setShowDeleteConfirmation(false);
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
                    <BasicSelect field="category" apiEndpoint=
                        "http://127.0.0.1:8000/api/category/" label="Категория" onChange={handleCategoryChange} />
                    <MultipleSelect apiEndpoint=
                                        "http://127.0.0.1:8000/api/tag/" label="Теги" onChange={handleTagChange} />
                    <BasicSelect field="status" apiEndpoint=
                        "http://127.0.0.1:8000/api/status/" label="Статус" onChange={handleStatusChange} />
                    <BasicSelect field="priority" apiEndpoint=
                        "http://127.0.0.1:8000/api/priority/" label="Приоритет" onChange={handlePriorityChange} />
                    <MultipleSelect apiEndpoint=
                                        "http://127.0.0.1:8000/api/week_days/"
                                    label="Напоминание" onChange={handleReminderChange} />
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
            {selectedGoal && (
                <EditGoalModal
                    show={editModalShow}
                    handleClose={() => {
                        setEditModalShow(false);
                        setSelectedGoal(null); // Clear the selected goal when closing the modal
                    }}
                    goal={selectedGoal}
                    onSave={handleSaveEditedGoal}
                />
            )}
            <ul>
                {goals.map(goal => (
                    <li key={goal.id}>
                        <p>{goal.title}</p>
                        <div>
                            {goal.deadline && (
                                <>
                                    <EventAvailableIcon fontSize="small" />
                                    <p>{dayjs(goal.deadline).format("DD.MM.YYYY")}</p>
                                </>
                            )}
                            <p>{categories[goal.category]}</p>
                        </div>
                        <Button variant="info" onClick={() => handleEditClick(goal.id)}>
                            Редактировать
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => openDeleteConfirmation(goal.id, goal.title)}
                            className="custom-button"
                        >
                            <DeleteIcon fontSize="small" className="delete-icon" />
                        </Button>
                    </li>
                ))}
            </ul>
            <DeleteConfirmationModal
                show={showDeleteConfirmation}
                onClose={closeDeleteConfirmation}
                onConfirm={deleteGoal}
                goalTitle={goalToDelete ? goalToDelete.title : ''}
            />
        </>
    );
}

export default Goals;