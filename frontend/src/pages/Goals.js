import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import dayjs from "dayjs";
import './Goals.css'; // Подключение CSS-файла для дополнительных стилей
import './GoalsList.css';
import Cookies from 'js-cookie';
import FlipMove from 'react-flip-move';
import GoalEditOffCanvas from "../components/GoalEditOffCanvas";
import GoalCreateOffCanvas from "../components/goalCreateOffCanvas";
import Modal from "react-bootstrap/Modal";
import CalendarDatePicker from "../components/CalendarDatePicker";
import BasicSelect from "../components/BasicSelect";
import MultipleSelect from "../components/MultipleSelect";

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [categories, setCategories] = useState({});
    const [editModalShow, setEditModalShow] = useState(false); // State for showing/hiding edit modal
    const [selectedGoal, setSelectedGoal] = useState(null); // State to store the goal being edited
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [filter, setFilter] = useState(false);
    const [done, doneChanged] = useState(false);
    const [searchModalShow, setSearchModalShow] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterCategory, setFilterCategory] = useState(null);
    const [filterDeadline, setFilterDeadline] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterReminder, setFilterReminder] = useState('');
    let [searchURL, setSearchURL] = useState('http://127.0.0.1:8000/api/goal_create/?')
    let updatedURL = searchURL

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            const fetchData = async () => {
                axios.get(
                searchURL,{
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
            }, 5000); // обновляем каждые 5 секунд

            return () => clearInterval(intervalId);
        }

    }, [filter, done, searchURL]);

    const handleEditClick = (goal) => {
        setSelectedGoal(goal);
        setEditModalShow(true);
    };

    const handleSearchClose = () => {
        setSearchModalShow(false)
    }


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

    // функция для обновления URL. Нужен для функционирования фильтрации
    const handleURLchange = (param, value) => {
        switch (param) {
            case 'category':
                updatedURL += `category=${value.target.value}&`
                console.log(updatedURL)
                break;

            case 'deadline':
                updatedURL += `deadline=${dayjs(value).format('YYYY-MM-DD')}&`
                console.log(updatedURL)
                break;

            case 'tag':
                updatedURL += `tag=${value}&`
                break;

            case 'status':
                updatedURL += `status=${value.target.value}&`
                break;

            case 'priority':
                updatedURL += `priority=${value.target.value}&`
                break;

            case 'reminder':
                updatedURL += `reminder=${value.target.value}&`
                break;

            case 'done':
                updatedURL += `search=${searchText}&`
                setSearchURL(updatedURL)
                break;

            default:
                // возвращаем значения по умолчанию, так как случай default работает на сбрасывание фильтра
                setSearchURL('http://127.0.0.1:8000/api/goal_create/?')
                updatedURL = searchURL
        }
    }


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

    const categoryChange = (event) => {
        setFilterCategory(event.target.value)
    }


    function openNav() {
        document.getElementById("goal-ops").style.padding = '32px';
        document.getElementById("goal-ops").style.width = '450px';
        document.getElementById("goal-edit-id").style.width = '0'
        document.getElementById("goal-edit-id").style.height = '0'
        document.getElementById("goal-create-id").style.width = '100%'
        document.getElementById("goal-create-id").style.height = '100%'
    }

    function openEditNav() {
        document.getElementById("goal-ops").style.padding = '32px';
        document.getElementById("goal-ops").style.width = '450px';
        document.getElementById("goal-create-id").style.width = '0'
        document.getElementById("goal-create-id").style.height = '0'
        document.getElementById("goal-edit-id").style.width = '100%'
        document.getElementById("goal-edit-id").style.height = '100%'
    }

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    function closeNav() {
      document.getElementById("goal-ops").style.width = '0';
      setTimeout(() => {
          document.getElementById("goal-ops").style.padding = '0';
      }, 100)
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
                placeholder='Search'
                className="home-textinput input"
                onClick={() => {
                    setSearchModalShow(true)
                }}
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
                  <span className="home-text">Sort by date</span>
                </button>
              </div>
              <button type="button" className="home-button button">
                <svg viewBox="0 0 1024 1024" className="home-icon14">
                  <path d="M768 426.667h-170.667v-170.667c0-47.104-38.229-85.333-85.333-85.333s-85.333 38.229-85.333 85.333l3.029 170.667h-173.696c-47.104 0-85.333 38.229-85.333 85.333s38.229 85.333 85.333 85.333l173.696-3.029-3.029 173.696c0 47.104 38.229 85.333 85.333 85.333s85.333-38.229 85.333-85.333v-173.696l170.667 3.029c47.104 0 85.333-38.229 85.333-85.333s-38.229-85.333-85.333-85.333z"></path>
                </svg>
                <span className="home-text">Add New list</span>
              </button>
            </div>
            <div className="home-separator"></div>
            <div className="home-container12">
              <span className="home-text10">Tags</span>
              <div className="home-container13">
                <Button type="button" className="home-button07 tag-button">
                  Tag 1
                </Button>
                <Button type="button" className="home-button08 tag-button">
                  Tag 2
                </Button>
                <button type="button" className="home-button09 tag-button">
                  <svg viewBox="0 0 1024 1024" className="home-icon16">
                    <path d="M810 554h-256v256h-84v-256h-256v-84h256v-256h84v256h256v84z"></path>
                  </svg>
                  <span className="home-text11">Add Tag</span>
                </button>
              </div>
            </div>
          </div>
          <div className="home-profile row">
            <button type="button" className="home-button button">
                  <svg viewBox="0 0 1024 1024" className="home-icon">
                    <path d="M448 128v-16c0-26.4-21.6-48-48-48h-160c-26.4 0-48 21.6-48 48v16h-192v128h192v16c0 26.4 21.6 48 48 48h160c26.4 0 48-21.6 48-48v-16h576v-128h-576zM256 256v-128h128v128h-128zM832 432c0-26.4-21.6-48-48-48h-160c-26.4 0-48 21.6-48 48v16h-576v128h576v16c0 26.4 21.6 48 48 48h160c26.4 0 48-21.6 48-48v-16h192v-128h-192v-16zM640 576v-128h128v128h-128zM448 752c0-26.4-21.6-48-48-48h-160c-26.4 0-48 21.6-48 48v16h-192v128h192v16c0 26.4 21.6 48 48 48h160c26.4 0 48-21.6 48-48v-16h576v-128h-576v-16zM256 896v-128h128v128h-128z"></path>
                  </svg>
                  <span className="home-text">Settings</span>
                </button>
              <button type="button" className="home-button button">
                  <svg viewBox="0 0 1024 1024" className="home-icon">
                    <path d="M384 853.333h-170.667c-11.776 0-22.4-4.736-30.165-12.501s-12.501-18.389-12.501-30.165v-597.333c0-11.776 4.736-22.4 12.501-30.165s18.389-12.501 30.165-12.501h170.667c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-170.667c-35.328 0-67.413 14.379-90.496 37.504s-37.504 55.168-37.504 90.496v597.333c0 35.328 14.379 67.413 37.504 90.496s55.168 37.504 90.496 37.504h170.667c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667zM793.003 469.333h-409.003c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667h409.003l-140.501 140.501c-16.683 16.683-16.683 43.691 0 60.331s43.691 16.683 60.331 0l213.333-213.333c4.096-4.096 7.168-8.789 9.259-13.824 6.4-15.445 3.328-33.92-9.259-46.507l-213.333-213.333c-16.683-16.683-43.691-16.683-60.331 0s-16.683 43.691 0 60.331z"></path>
                  </svg>
                  <span className="home-text">Log Out</span>
                </button>
          </div>
        </div>
        <div id="goal-container" className="home-goals-container">
          <div className="home-dashboard">
            <div className="home-goals-list">
              <h1 className="home-text14">Goals</h1>
              <Button type="button" onClick={openNav} className="home-button10 button">
                <svg viewBox="0 0 1024 1024" className="home-icon18">
                  <path d="M768 426.667h-170.667v-170.667c0-47.104-38.229-85.333-85.333-85.333s-85.333 38.229-85.333 85.333l3.029 170.667h-173.696c-47.104 0-85.333 38.229-85.333 85.333s38.229 85.333 85.333 85.333l173.696-3.029-3.029 173.696c0 47.104 38.229 85.333 85.333 85.333s85.333-38.229 85.333-85.333v-173.696l170.667 3.029c47.104 0 85.333-38.229 85.333-85.333s-38.229-85.333-85.333-85.333z"></path>
                </svg>
                <span className="home-text15">Add New Goal</span>
              </Button>
                <FlipMove>
                {goals.map(goal => (
                <div key={goal.id} className="home-container17" onClick={() => {
                    handleEditClick(goal.id)
                    openEditNav()
                }}>
                    <div className="home-container18">
                      <div className="home-container19">
                        <input id="doneCheckbox" type="checkbox"
                               className="home-checkbox1"
                               checked={goal.done}
                               onChange={event => handleDoneChange(goal.id, event)}
                               />

                          {goal.done ?
                              <button id="titleButton" type="button" className="home-button12-completed button">
                                {goal.title}
                              </button>
                              :
                              <button id="titleButton" type="button" className="home-button12 button">
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

                          <svg className="home-icon24" viewBox="-3.03 -3.03 81.86 81.86" xmlns="http://www.w3.org/2000/svg" fill="#808080" stroke="#808080" stroke-width="3.335376"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.909648"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#808080"></path> </g> </g></svg>
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
                  <div id="goal-edit-id" className="goal-edit-column">
                      <GoalEditOffCanvas
                        show={openEditNav}
                        showDeleteModal={showDeleteConfirmation}
                        handleClose={() => {
                            setEditModalShow(false);
                            setSelectedGoal(null); // Clear the selected goal when closing the modal
                        }}
                        goal={selectedGoal}
                        onSave={handleSaveEditedGoal}/>
                  </div>
                  <div id="goal-create-id" className="goal-create-column">
                  <GoalCreateOffCanvas/>
                  </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        <Modal show={searchModalShow} onHide={handleSearchClose}>
            <Modal.Header closeButton>
                <Modal.Title>Поиск цели</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Input fields for editing goal data */}
                <>
                <form encType="application/x-www-form-urlencoded">
                <div className="search-modal-wrapper">
                    <div className="box1">
                        <input className="search-modal-search"
                               placeholder="Search"
                               value={searchText}
                               onChange={(event) => {setSearchText(event.target.value)}}/>
                    </div>
                    <span className="box2">Фильтр</span>
                    <div className="search-modal-item">
                        <BasicSelect
                            apiEndpoint="http://127.0.0.1:8000/api/category/"
                            label="Категория"
                            onChange={(event) => {
                                handleURLchange('category', event);
                            }}/>
                    </div>

                    <div className="search-modal-item">
                        <CalendarDatePicker
                        onChange={(event) => handleURLchange('deadline', event)}/>
                    </div>
                    <div className="search-modal-item">
                        <MultipleSelect
                            apiEndpoint="http://127.0.0.1:8000/api/tag/"
                            label="Тег"
                            onChange={(event) => {handleURLchange('tag', event)}}/>
                    </div>
                    <div className="search-modal-item">
                        <BasicSelect
                            apiEndpoint="http://127.0.0.1:8000/api/status/"
                            label="Статус"
                            onChange={(event) => {handleURLchange('status', event)}}
                             />
                    </div>
                    <div className="search-modal-item">
                        <BasicSelect
                            apiEndpoint="http://127.0.0.1:8000/api/priority/"
                            label="Приоритет"
                            onChange={(event) => {handleURLchange('priority', event)}}
                        />
                    </div>
                    <div className="search-modal-item">
                        <MultipleSelect
                            apiEndpoint="http://127.0.0.1:8000/api/week_days/"
                            label="Напоминание"
                            onChange={(event) => {handleURLchange('reminder', event)}}
                        />
                    </div>
                    </div>
                    </form>
                    </>
            </Modal.Body>
            <Modal.Footer>
                <Button type={'reset'} variant="outline-secondary" onClick={() => {
                    handleSearchClose()
                    handleURLchange('reset', null)
                }}>
                    Сбросить
                </Button>
                <Button variant="primary" onClick={() => {
                    handleSearchClose()
                    handleURLchange('done', null)
                }}>
                    Поиск
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default Goals;