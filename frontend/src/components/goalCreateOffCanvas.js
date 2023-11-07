import InputTextField from "./InputTextField";
import MultilineTextField from "./MultilineTextField";
import BasicSelect from "./BasicSelect";
import CalendarDatePicker from "./CalendarDatePicker";
import MultipleSelect from "./MultipleSelect";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import '../pages/GoalsList.css'
import Cookies from "js-cookie";
import axios from "axios";
import dayjs from "dayjs";
import Goals from "../pages/Goals";
const GoalCreateOffCanvas = () => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [goals, setGoals] = useState([]);
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [tagSelectedValues, setTagSelectedValues] = useState([]);
    const [reminderSelectedValues, setReminderSelectedValues] = useState([]);
    const [prioritySelectedValue, setPrioritySelectedValue] = useState('');
    const [statusSelectedValue, setStatusSelectedValue] = useState('');
    const [categorySelectedValue, setCategorySelectedValue] = useState('');
    const [titleError, setTitleError] = useState(false); // Новое состояние для ошибки
    const [deadlineError, setDeadlineError] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null); // State to store the goal being edited
    const [done, doneChanged] = useState(false);


    const sendDataToApi = async () => {
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
        await axios.post(
            'http://127.0.0.1:8000/api/goal_create/',
            {
                title,
                description,
                deadline: deadline ? dayjs(deadline.toString()).format('YYYY-MM-DD') : null,
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
        ).then(r => console.log(r.data)); // Логирование ответа сервера (если нужно)
        handleClose(); // Закрытие модального окна после успешной отправки

        // После успешного создания цели, отправляем GET-запрос для обновления списка целеq
        await axios.get(
            'http://127.0.0.1:8000/api/goal_create/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            .then(response => {
                setGoals(response.data)
            })
            .catch(error => {
                console.log('Ошибка при обновлении данных после создания цели', error)
            });
    };

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
            <form
                  encType="application/x-www-form-urlencoded"
                  className="home-form">
                  <InputTextField
                        value={title}
                        onChange={handleGoalNameChange}
                        error={titleError} // Передача состояния ошибки в компонент InputTextField
                    />

                  <MultilineTextField onChange={handleDescriptionChange} />
                    <div className="home-container23">
                        <span className="home-text18">Category</span>
                        <div className="select-wrapper">
                            <BasicSelect field="category" apiEndpoint=
                            "http://127.0.0.1:8000/api/category/" label="Категория" onChange={handleCategoryChange} />
                        </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Due data</span>
                        <div className="select-wrapper">
                        <CalendarDatePicker onChange={handleDateChange} error={deadlineError} />
                        </div>
                    </div>
                    {deadlineError && <div style={{ color: 'red' }}>Дата должна быть не раньше сегодняшней даты</div>}
                    <div className="home-container24">
                        <span className="home-text18">Tags</span>
                        <div className="select-wrapper">
                        <MultipleSelect apiEndpoint=
                                        "http://127.0.0.1:8000/api/tag/" label="Теги" onChange={handleTagChange} />
                            </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Status</span>
                        <div className="select-wrapper">
                        <BasicSelect field="status" apiEndpoint=
                        "http://127.0.0.1:8000/api/status/" label="Статус" onChange={handleStatusChange} />
                            </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Priority</span>
                        <div className="select-wrapper">
                        <BasicSelect field="priority" apiEndpoint=
                        "http://127.0.0.1:8000/api/priority/" label="Приоритет" onChange={handlePriorityChange} />
                            </div>
                    </div>
                    <div className="home-container24">
                        <span className="home-text18">Reminder</span>
                        <div className="select-wrapper">
                        <MultipleSelect apiEndpoint=
                                        "http://127.0.0.1:8000/api/week_days/"
                                    label="Напоминание" onChange={handleReminderChange} />
                            </div>
                    </div>


                <div className="home-container29">
                    <Button type="reset" className="delete-button button">
                      Reset
                    </Button>
                    <Button type="button" onClick={sendDataToApi} className="save-button button">
                      Create
                    </Button>
                  </div>

                </form>
        )

}

export default GoalCreateOffCanvas;