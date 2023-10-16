import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputTextField from '../components/InputTextField';
import MultilineTextField from '../components/MultilineTextField';
import CalendarDatePicker from '../components/CalendarDatePicker';
import BasicSelect from '../components/BasicSelect';
import MultipleSelect from '../components/MultipleSelect';
import axios from 'axios';
import Cookies from "js-cookie";

const EditGoalModal = ({ show, handleClose, goal = {}, onSave }) => {
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDeadline, setEditedDeadline] = useState(null);
    const [editedCategory, setEditedCategory] = useState('');
    const [editedTag, setEditedTag] = useState([]);
    const [editedStatus, setEditedStatus] = useState('');
    const [editedPriority, setEditedPriority] = useState('');
    const [editedReminder, setEditedReminder] = useState([]);

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

    // Handle saving the edited goal
    const handleSave = () => {
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
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Goal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Input fields for editing goal data */}
                <InputTextField value={editedTitle} onChange={handleTitleChange} />
                <MultilineTextField value={editedDescription} onChange={(value) => setEditedDescription(value)} />
                <CalendarDatePicker value={editedDeadline} onChange={(date) => setEditedDeadline(date)} />

                {/* Dropdowns for additional fields */}
                <BasicSelect
                    apiEndpoint="http://127.0.0.1:8000/api/category/"
                    label="Category"
                    value={editedCategory}
                    onChange={handleCategoryChange} />
                <MultipleSelect
                    apiEndpoint="http://127.0.0.1:8000/api/tag/"
                    label="Tags"
                    value={editedTag}  // Pass the value prop here
                    onChange={(values) => setEditedTag(values)}
                />
                <BasicSelect
                    apiEndpoint="http://127.0.0.1:8000/api/status/"
                    label="Status"
                    value={editedStatus}
                    onChange={(event) => setEditedStatus(event.target.value)} />
                <BasicSelect
                    apiEndpoint="http://127.0.0.1:8000/api/priority/"
                    label="Priority"
                    value={editedPriority}
                    onChange={handlePriorityChange} />
                <MultipleSelect
                    apiEndpoint="http://127.0.0.1:8000/api/week_days/"
                    label="Reminder"
                    value={editedReminder}
                    onChange={handleReminderChange} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditGoalModal;
