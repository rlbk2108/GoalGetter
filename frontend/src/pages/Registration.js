import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registration.css'; // Подключение CSS-файла для дополнительных стилей
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Registration = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      first_name: first_name,
      last_name: last_name,
      login: login,
      email: email,
      password: password,
    };


    axios
      .post('http://127.0.0.1:8000/api/registration/', data)
      .then((response) => {
        console.log(response.data);
        setFirstName('');
        setLastName('');
        setLogin('');
        setEmail('');
        setPassword('');
        navigate('/successful_registration');
      })
      .catch((error) => {
        console.error(error);
      if (error.response.data === 'A user with this email already exists') {
      setErrorMessage('Пользователь с данной почтой уже существует');
      }
      else if (error.response.data === 'A user with this login already exists') {
      setErrorMessage('Пользователь с данным логином уже существует');
      }

      });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

   return (
    <div className="background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="transparent-bg">
              <div className="title-wrapper">
                <h2 className="welcome-text">Добро пожаловать в <span className="goal-getter">GoalGetter</span></h2>

              </div>
              <div className="form-group left-align-label">
                <label htmlFor="first_name" >
                  Имя
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group left-align-label">
                <label htmlFor="last_name">
                  Фамилия
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group left-align-label" >
                <label htmlFor="login">
                Логин
              </label>

                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>
              <div className="form-group left-align-label">
                <label htmlFor="email">
                  Электронная почта
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group password-field left-align-label">
                <label htmlFor="password">
                  Пароль
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <button type="submit" className="registration-btn">
                Зарегистрироваться
              </button>
              {errorMessage && <p className="mt-3 text-danger text-blue">{errorMessage}</p>}
              <div className="login-btn">
              <Link to="/login" className="text-button">Уже есть аккаунт? Тогда войдите</Link>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;