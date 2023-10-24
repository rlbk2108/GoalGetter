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
import './GoalsList.css';
import Cookies from 'js-cookie';
import EditGoalModal from "./EditGoalForm";
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FlipMove from 'react-flip-move';

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
    const [filter, setFilter] = useState(false);
    const [done, doneChanged] = useState(false);


    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            const fetchData = async () => {
                axios.get(
                'http://127.0.0.1:8000/api/goal_create/',{
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            .then(response => {
                if (!filter) {
                    setGoals(response.data);
                } else if (done) {
                    setGoals(response.data)
                } else {
                    const sortedGoals = response.data.sort((a, b) => {
                      // Assuming 'deadline' is a string in the format 'YYYY-MM-DD'
                      return new Date(b.deadline) - new Date(a.deadline);
                    });

                    setGoals(sortedGoals)
                }
            })
            .catch(error => {
                console.log('Ошибка при получении данных о целях:', error)
            });
            }

            const fetchCategories = async () => {
                axios.get(
                'http://127.0.0.1:8000/api/category/',{
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })
            .then(response => {
                const categoriesData = response.data.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
                });
                setCategories(categoriesData);
            })
            .catch(error => {
                console.log('Ошибка при получении данных о категориях:', error)
            });
            }

            fetchData();
            fetchCategories();

            const intervalId = setInterval(() => {
                fetchData();
                fetchCategories();
            }, 10000); // обновляем каждые 10 секунд

            return () => clearInterval(intervalId);
        }

    }, [filter, done]);

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
            const deadlineFormatted = editedGoalData.deadline ? dayjs(editedGoalData.deadline).format('YYYY-MM-DD') : null;

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

    const handleDoneChange = (goalId, event) => {

        const accessToken = Cookies.get('access_token');

        axios.patch(
            `http://127.0.0.1:8000/api/goals/${goalId}/`,
            {
                done:event.target.checked
            },
            {
                headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            }
        ).then(response => {
            console.log(response.data)
        }
        ).catch(error => {
            console.error(error)
        })
        doneChanged(!done)
    }

    const handleStatusChange = (event) => {
        setStatusSelectedValue(event.target.value);
    };

    const handleTagChange = (values) => {
        setTagSelectedValues(values);
    };

    function openNav() {
      document.getElementById("goal-ops").style.display = 'flex';
    }

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    function closeNav() {
      document.getElementById("goal-ops").style.display = 'none';
    }

    const handleChangeFilter = () => {
        filter ? setFilter(false) : setFilter(true)
    }

    return (
        <>
    <div className="home-container">
      <div className="home-main-container">
        <div className="home-sidebar-cont">
          <div className="home-container01">
            <div className="home-container02">
              <h1 className="home-textmenu">Menu</h1>
              <svg viewBox="0 0 1024 1024" className="home-iconburger">
                <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
              </svg>
            </div>
            <div className="home-container03">
              <input
                type="text"
                placeholder="Search"
                className="home-textinput input"
              />
            </div>
            <div className="home-container04">
              <span className="home-text01">Goals</span>
              <div className="home-container05">
                <button type="button" className="home-button button">
                  <svg viewBox="0 0 1024 1024" className="home-icon">
                    <path d="M362 214l214 298-214 298h-192l214-298-214-298h192zM662 214l212 298-212 298h-192l212-298-212-298h192z"></path>
                  </svg>
                  <span className="home-text">Upcoming</span>
                </button>
              </div>
              <div className="home-container06">
                <button type="button" className="home-button button">
                  <svg viewBox="0 0 1024 1024" className="home-icon">
                    <path d="M918 490l64 64-298 300-194-192 64-64 130 128zM86 682v-84h340v84h-340zM598 256v86h-512v-86h512zM598 426v86h-512v-86h512z"></path>
                  </svg>
                  <span className="home-text">Goals</span>
                </button>
              </div>
              <div className="home-container07">
                <button type="button" className="home-button button">
                  <svg viewBox="0 0 1024 1024" className="home-icon">
                    <path d="M854 896v-554h-684v554h684zM854 128q34 0 59 26t25 60v682q0 34-25 60t-59 26h-684q-34 0-59-26t-25-60v-682q0-34 25-60t59-26h44v-86h84v86h428v-86h84v86h44z"></path>
                  </svg>
                  <span className="home-text">Calendar</span>
                </button>
              </div>
            </div>
            <div className="home-separator"></div>
            <div className="home-container08">
              <span className="home-text05">Lists</span>
              <div className="home-container09">
                <button type="button" className="home-button button">
                  <svg
                    viewBox="0 0 877.7142857142857 1024"
                    className="home-icon08"
                  >
                    <path d="M877.714 237.714v548.571c0 90.857-73.714 164.571-164.571 164.571h-548.571c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571c90.857 0 164.571 73.714 164.571 164.571z"></path>
                  </svg>
                  <span className="home-text">Personal</span>
                </button>
              </div>
              <div className="home-container10">
                <button type="button" className="home-button button">
                  <svg
                    viewBox="0 0 877.7142857142857 1024"
                    className="home-icon10"
                  >
                    <path d="M877.714 237.714v548.571c0 90.857-73.714 164.571-164.571 164.571h-548.571c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571c90.857 0 164.571 73.714 164.571 164.571z"></path>
                  </svg>
                  <span className="home-text">Work</span>
                </button>
              </div>
              <div className="home-container11">
                <button type="button" onClick={handleChangeFilter} className="home-button button">
                  <svg
                    viewBox="0 0 877.7142857142857 1024"
                    className="home-icon"
                  >
                    <path d="M877.714 237.714v548.571c0 90.857-73.714 164.571-164.571 164.571h-548.571c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571c90.857 0 164.571 73.714 164.571 164.571z"></path>
                  </svg>
                  <span className="home-text">Filter by date</span>
                </button>
              </div>
              <button type="button" className="home-button button">
                <svg viewBox="0 0 1024 1024" className="home-icon14">
                  <path d="M768 426.667h-170.667v-170.667c0-47.104-38.229-85.333-85.333-85.333s-85.333 38.229-85.333 85.333l3.029 170.667h-173.696c-47.104 0-85.333 38.229-85.333 85.333s38.229 85.333 85.333 85.333l173.696-3.029-3.029 173.696c0 47.104 38.229 85.333 85.333 85.333s85.333-38.229 85.333-85.333v-173.696l170.667 3.029c47.104 0 85.333-38.229 85.333-85.333s-38.229-85.333-85.333-85.333z"></path>
                </svg>
                <span className="home-text">Add New list</span>
              </button>
            </div>
            <div className="home-separator1"></div>
            <div className="home-container12">
              <span className="home-text10">Tags</span>
              <div className="home-container13">
                <button type="button" className="home-button07 tag-button">
                  Tag 1
                </button>
                <button type="button" className="home-button08 tag-button">
                  Tag 2
                </button>
                <button type="button" className="home-button09 tag-button">
                  <svg viewBox="0 0 1024 1024" className="home-icon16">
                    <path d="M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z"></path>
                  </svg>
                  <span className="home-text11">Add Tag </span>
                </button>
              </div>
            </div>
          </div>
          <div className="home-profile">
            <img
              src="https://images.unsplash.com/photo-1562159278-1253a58da141?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDIyfHxtYW4lMjBwb3J0dHJhaXR8ZW58MHx8fHwxNjI3MjkzNTM1&amp;ixlib=rb-1.2.1&amp;w=200"
              className="home-image"
            />
            <div className="home-container14">
              <span className="home-text12">Eraaly Kasymbekov</span>
              <span className="home-text13">View Profile</span>
            </div>
          </div>
        </div>
        <div id="goal-container" className="home-goals-container">
          <div className="home-dashboard">
            <div className="home-goals-list">
              <h1 className="home-text14">Goals</h1>
              <Button type="button" onClick={handleShow} className="home-button10 button">
                <svg viewBox="0 0 1024 1024" className="home-icon18">
                  <path d="M768 426.667h-170.667v-170.667c0-47.104-38.229-85.333-85.333-85.333s-85.333 38.229-85.333 85.333l3.029 170.667h-173.696c-47.104 0-85.333 38.229-85.333 85.333s38.229 85.333 85.333 85.333l173.696-3.029-3.029 173.696c0 47.104 38.229 85.333 85.333 85.333s85.333-38.229 85.333-85.333v-173.696l170.667 3.029c47.104 0 85.333-38.229 85.333-85.333s-38.229-85.333-85.333-85.333z"></path>
                </svg>
                <span className="home-text15">Add New Goal</span>
              </Button>
                <FlipMove>
                {goals.map(goal => (
                <div key={goal.id} className="home-container17">
                    <div onDoubleClick={() => openDeleteConfirmation(goal.id, goal.title)}
                         className="home-container18">
                      <div className="home-container19">
                        <input id="doneCheckbox" type="checkbox"
                               className="home-checkbox1"
                               checked={goal.done}
                               onChange={event => handleDoneChange(goal.id, event)}
                               />

                          {goal.done ?
                              <button id="titleButton" type="button" onClick={() => handleEditClick(goal.id)} className="home-button12-completed button">
                                {goal.title}
                              </button>
                              :
                              <button id="titleButton" type="button" onClick={() => handleEditClick(goal.id)} className="home-button12 button">
                                {goal.title}
                              </button>
                          }

                      </div>
                        {goal.deadline && (
                            <>
                                <div className="home-container20">
                                <svg
                                  viewBox="0 0 950.8571428571428 1024"
                                  className="home-icon22">
                                  <path d="M73.143 950.857h164.571v-164.571h-164.571v164.571zM274.286 950.857h182.857v-164.571h-182.857v164.571zM73.143 749.714h164.571v-182.857h-164.571v182.857zM274.286 749.714h182.857v-182.857h-182.857v182.857zM73.143 530.286h164.571v-164.571h-164.571v164.571zM493.714 950.857h182.857v-164.571h-182.857v164.571zM274.286 530.286h182.857v-164.571h-182.857v164.571zM713.143 950.857h164.571v-164.571h-164.571v164.571zM493.714 749.714h182.857v-182.857h-182.857v182.857zM292.571 256v-164.571c0-9.714-8.571-18.286-18.286-18.286h-36.571c-9.714 0-18.286 8.571-18.286 18.286v164.571c0 9.714 8.571 18.286 18.286 18.286h36.571c9.714 0 18.286-8.571 18.286-18.286zM713.143 749.714h164.571v-182.857h-164.571v182.857zM493.714 530.286h182.857v-164.571h-182.857v164.571zM713.143 530.286h164.571v-164.571h-164.571v164.571zM731.429 256v-164.571c0-9.714-8.571-18.286-18.286-18.286h-36.571c-9.714 0-18.286 8.571-18.286 18.286v164.571c0 9.714 8.571 18.286 18.286 18.286h36.571c9.714 0 18.286-8.571 18.286-18.286zM950.857 219.429v731.429c0 40-33.143 73.143-73.143 73.143h-804.571c-40 0-73.143-33.143-73.143-73.143v-731.429c0-40 33.143-73.143 73.143-73.143h73.143v-54.857c0-50.286 41.143-91.429 91.429-91.429h36.571c50.286 0 91.429 41.143 91.429 91.429v54.857h219.429v-54.857c0-50.286 41.143-91.429 91.429-91.429h36.571c50.286 0 91.429 41.143 91.429 91.429v54.857h73.143c40 0 73.143 33.143 73.143 73.143z"></path>
                                </svg>
                                <span className="home-text16">{dayjs(goal.deadline).format("DD.MM.YYYY")}</span>
                              </div>
                            </>
                        )}
                      <svg viewBox="0 0 1024 1024" className="home-icon24">
                        <path d="M250 176l92-90 426 426-426 426-92-90 338-336z"></path>
                      </svg>
                    </div>
                    <div className="home-separator3"></div>
                  </div>
                ))}
                    </FlipMove>
            </div>
            <div id="goal-ops" className="home-goal-ops">
              <div className="home-container21">
                <div className="home-container22">
                  <h1 className="home-text17">Goal:</h1>
                  <button type="button" onClick={closeNav} className="home-button13 button">
                    <svg
                      viewBox="0 0 804.5714285714286 1024"
                      className="home-icon26"
                    >
                      <path d="M741.714 755.429c0 14.286-5.714 28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571-16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"></path>
                    </svg>
                  </button>
                </div>
                <form
                  encType="application/x-www-form-urlencoded"
                  className="home-form"
                >
                  <input
                    type="text"
                    placeholder="Book tickets for a movie or a concert"
                    className="home-input input"
                  />
                  <textarea
                    cols="0"
                    rows="5"
                    placeholder="Description"
                    className="home-textarea textarea"
                  ></textarea>
                  <div className="home-container23">
                    <span className="home-text18">Due data</span>
                    <select className="home-select">
                      <option value="Personal">Personal</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  </div>
                  <div className="home-container24">
                    <span className="home-text19">Category</span>
                    <select className="home-select1">
                      <option value="Personal">Personal</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  </div>
                  <div className="home-container25">
                    <span className="home-text20">Tags</span>
                    <select multiple={true} className="home-select2">
                      <option value="Option 1">Option 1</option>
                      <option value="Personal">Personal</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  </div>
                  <div className="home-container26">
                    <span className="home-text21">Status</span>
                    <select className="home-select3">
                      <option value="Option 1">Option 1</option>
                      <option value="Personal">Personal</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  </div>
                  <div className="home-container27">
                    <span className="home-text22">Priority</span>
                    <select className="home-select4">
                      <option value="Option 1">Option 1</option>
                      <option value="Personal">Personal</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  </div>
                  <div className="home-container28">
                    <span className="home-text23">Reminder</span>
                    <select className="home-select5">
                      <option value="Option 1">Option 1</option>
                      <option value="Personal">Personal</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  </div>
                  <div className="home-container29">
                    <button type="button" className="home-button14 button">
                      Delete Goal
                    </button>
                    <button type="button" className="home-button15 button">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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