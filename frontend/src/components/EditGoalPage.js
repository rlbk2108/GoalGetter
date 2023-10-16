import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CalendarDatePicker from '../components/CalendarDatePicker';
import InputTextField from '../components/InputTextField';
import MultilineTextField from '../components/MultilineTextField';
import BasicSelect from '../components/BasicSelect';
import MultipleSelect from '../components/MultipleSelect';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

function EditGoal({ goalId, onClose, onUpdate }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(null);
    // Добавьте состояния для остальных полей цели, если необходимо

    useEffect(() => {
        const fetchEditingGoal = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                const response = await axios.get(`http://127.0.0.1:8000/api/goals/${goalId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const editingGoal = response.data;
                setTitle(editingGoal.title);
                setDescription(editingGoal.description);
                setDeadline(editingGoal.deadline ? new Date(editingGoal.deadline) : null);
                // Установите состояния для остальных полей цели
            } catch (error) {
                console.error('Error fetching editing goal:', error);
            }
        };

        fetchEditingGoal();
    }, [goalId]);

    const handleSave = async () => {
        try {
            // Отправка данных на сервер методом PUT
            const accessToken = Cookies.get('access_token');
            await axios.put(
                `http://127.0.0.1:8000/api/goals/${goalId}/`,
                {
                    title,
                    description,
                    deadline,
                    // Добавьте остальные поля цели
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Вызов функции onUpdate для обновления данных на странице Goals
            onUpdate();

            // Закрытие модального окна
            onClose();
        } catch (error) {
            console.error('Error updating goal:', error.response);
        }
    };

    return (
        <Modal show={true} onHide={onClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Редактировать цель</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputTextField value={title} onChange={(e) => setTitle(e.target.value)} />
                <MultilineTextField value={description} onChange={(value) => setDescription(value)} />
                <CalendarDatePicker value={deadline} onChange={(date) => setDeadline(date)} />
                {/* Добавьте компоненты для остальных полей цели */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Закрыть
                </Button>
                <Button onClick={handleSave}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditGoal;
