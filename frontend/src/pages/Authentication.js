import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registration.css'; // Подключение CSS-файла для дополнительных стилей
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {useAuthStore} from "../store/auth";
import {login} from "../utils/auth";

const Authentication = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const navigate = useNavigate();


    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/home');
        }
    }, []);


    const resetForm = () => {
        setEmail('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await login(email, password);
        if (error) {
            alert(error);
        } else {
            navigate('/home');
            resetForm();
        }
    };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

   return (
    <div className="background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleLogin} className="transparent-bg">
              <div className="title-wrapper">
                <h2 className="welcome-text">Добро пожаловать в <span className="goal-getter">GoalGetter</span></h2>

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
                Войти
              </button>
              {errorMessage && <p className="mt-3 text-danger text-blue">{errorMessage}</p>}
              <div className="login-btn">
              <Link to="/login" className="text-button">Нет аккаута? Зарегистрируйтесь!</Link>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;