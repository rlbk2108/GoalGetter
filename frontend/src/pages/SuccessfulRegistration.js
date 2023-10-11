import React from 'react';
import Confetti from 'react-confetti';
import './SuccessfulRegistration.css'; // Подключаем файл стилей
import { Link } from 'react-router-dom';

const RegistrationSuccess = () => {
  return (
    <div className="registration-success">
      <div className="content">
        <h1>Вы успешно зарегистрировались!</h1>
        <p>Спасибо за регистрацию на нашем сайте. Мы рады приветствовать вас в нашем сообществе.</p>

      <Link to="/home" className="btn home-page-btn">
        На главную страницу
      </Link>
          </div>
      <Confetti width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
};

export default RegistrationSuccess;
