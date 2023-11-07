import InputTextField from "./InputTextField";
import MultilineTextField from "./MultilineTextField";
import BasicSelect from "./BasicSelect";
import CalendarDatePicker from "./CalendarDatePicker";
import MultipleSelect from "./MultipleSelect";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import axios from "axios";
import Goals from "../pages/Goals";
import DeleteConfirmationModal from "../pages/DeleteConfirmationModal";

const GoalEditOffCanvas = ({ handleClose, goal = {}, onSave }) => {
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDeadline, setEditedDeadline] = useState(null);
    const [editedCategory, setEditedCategory] = useState('');
    const [editedTag, setEditedTag] = useState([]);
    const [editedStatus, setEditedStatus] = useState('');
    const [editedPriority, setEditedPriority] = useState('');
    const [editedReminder, setEditedReminder] = useState([]);
    const [titleError, setTitleError] = useState(false); // Новое состояние для ошибки
    const [deadlineError, setDeadlineError] = useState(false);
    const [deleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (goal) {
                try {
                    const accessToken = Cookies.get('access_token');
                    const response = await axios.get(
                        `http://127.0.0.1:8000/api/goals/${goal}/`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            }
                        });

                    const data = response.data;
                    setEditedTitle(data.id);
                    setEditedTitle(data.title || '');
                    setEditedDescription(data.description || '');
                    setEditedDeadline(data.deadline || null);
                    setEditedCategory(data.category || '');
                    setEditedTag(data.tag || []);
                    setEditedStatus(data.status || '');
                    setEditedPriority(data.priority || '');
                    setEditedReminder(data.reminder || []);
                } catch (error) {
                    console.error('Error fetching goal data:', error);
                }
            } else {
                console.log('No goal id provided');
            }
        };

        fetchData();
    }, [goal]);
    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setEditedCategory(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setEditedPriority(event.target.value);
    };

    const handleReminderChange = (selectedValues) => {
        setEditedReminder(selectedValues);
    };

    const deleteGoal = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            await axios.delete(`http://127.0.0.1:8000/api/goals/${goal}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Закройте модальное окно подтверждения после удаления
        } catch (error) {
            console.error('Ошибка при удалении цели:', error);
        }
        closeDeleteConfirmation();
    };

    const closeDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
    };

    const handleSave = () => {
    if (!editedTitle.trim()) {
        // Set the title error state
        setTitleError(true);
        return;
    }
    if (dayjs(editedDeadline).isBefore(dayjs().startOf('day'))) {
        setDeadlineError(true);
        return;
    }

        onSave({
            id: goal.id,
            title: editedTitle,
            description: editedDescription,
            deadline: editedDeadline,
            category: editedCategory,
            tag: editedTag,
            status: editedStatus,
            priority: editedPriority,
            reminder: editedReminder,
            // ... остальные измененные поля
        });
        setTitleError(false);
        setDeadlineError(false);

        handleClose();
    };

    return (
        <>
            <form
                encType="application/x-www-form-urlencoded"
                  className="home-form">

                  <InputTextField value={editedTitle}
                                  onChange={handleTitleChange}
                                  error={titleError}/>

                  <MultilineTextField value={editedDescription} onChange={(value) => setEditedDescription(value)} />
                    <div className="home-container23">
                        <span className="home-text18">Category</span>
                        <div className="select-wrapper">
                        <BasicSelect
                            apiEndpoint="http://127.0.0.1:8000/api/category/"
                            label="Категория"
                            value={editedCategory}
                            onChange={handleCategoryChange} />
                        </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Due data</span>
                        <div className="select-wrapper">
                        <CalendarDatePicker value={editedDeadline}
                                    onChange={(date) => setEditedDeadline(date)}
                                    error={deadlineError} />
                            </div>
                {deadlineError && <div style={{ color: 'red' }}>Дата должна быть не раньше сегодняшней даты</div>}
                    </div>
                    {deadlineError && <div style={{ color: 'red' }}>Дата должна быть не раньше сегодняшней даты</div>}
                    <div className="home-container24">
                        <span className="home-text18">Tags</span>
                        <div className="select-wrapper">
                        <MultipleSelect
                            apiEndpoint="http://127.0.0.1:8000/api/tag/"
                            label="Тег"
                            value={editedTag}  // Pass the value prop here
                            onChange={(values) => setEditedTag(values)} />
                            </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Status</span>
                        <div className="select-wrapper">
                        <BasicSelect
                            apiEndpoint="http://127.0.0.1:8000/api/status/"
                            label="Статус"
                            value={editedStatus}
                            onChange={(event) => setEditedStatus(event.target.value)} />
                            </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Priority</span>
                        <div className="select-wrapper">
                        <BasicSelect
                            apiEndpoint="http://127.0.0.1:8000/api/priority/"
                            label="Приоритет"
                            value={editedPriority}
                            onChange={handlePriorityChange} />
                            </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Reminder</span>
                        <div className="select-wrapper">
                        <MultipleSelect
                            apiEndpoint="http://127.0.0.1:8000/api/week_days/"
                            label="Напоминание"
                            value={editedReminder}
                            onChange={handleReminderChange} />
                            </div>
                    </div>

                        <div className="home-container29">
                            <Button type="button" onClick={() => {
                                setShowDeleteConfirmation(true)
                            }} className="delete-button button">
                              Delete Goal
                            </Button>
                            <Button type="button" onClick={handleSave} className="save-button button">
                              Save Changes
                            </Button>
                          </div>

                </form>

            {deleteConfirmation&&
                <DeleteConfirmationModal
                show={deleteConfirmation}
                onConfirm={deleteGoal}
                onClose={closeDeleteConfirmation}
                goalTitle={goal ? editedTitle : ''}
            />}
</>
        )
}

export default GoalEditOffCanvas;