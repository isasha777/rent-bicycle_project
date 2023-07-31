import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuthComponent.css';

const AuthComponent = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    axios
  .post('https://sf-final-project-be.herokuapp.com/api/auth/sign_in', {
    email,
    password,
  })
  .then(response => {
    const token = response.data.data.token; // Получаем токен из данных ответа
    const user = response.data.data.user; // Получаем информацию о пользователе из данных ответа

    localStorage.setItem('token', token); // Сохраняем токен в локальное хранилище
    localStorage.setItem('user', JSON.stringify(user)); // Сохраняем информацию о пользователе в локальное хранилище в формате JSON

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Устанавливаем заголовок авторизации по умолчанию

    setLoggedIn(true);
    setEmail(user.email); // Устанавливаем email из информации о пользователе
    setError('');

    // Update parent component state
    props.handleLoginState(true);
  })
  .catch(error => {
    console.error('Ошибка при входе:', error);
    setError('Неверный email или пароль.');
  });
  };

  const handleLogout = () => {
    // Сбрасываем токен в axios и localStorage при выходе из системы
    axios.defaults.headers.common['Authorization'] = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setLoggedIn(false);
    setEmail('');
    setPassword('');
    setError('');

    // Update parent component state
    props.handleLoginState(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Получаем токен из локального хранилища
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`; // Устанавливаем заголовок авторизации по умолчанию
    }

    const storedAuthState = JSON.parse(localStorage.getItem('authState'));
    if (storedAuthState && storedAuthState.isLoggedIn) {
      setLoggedIn(true);
      setEmail(storedAuthState.email);
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email) {
      setEmail(storedUser.email);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify({ isLoggedIn, email }));
  }, [isLoggedIn, email]);

  return (
    <header className='headerAuth'>
      <nav className='navAuth'>
        <ul className='ulauth'>
          {isLoggedIn ? (
            <li className='liauth'>
              <span className='spanauth'>Привет, {email}!</span>
              <button className='buttonauth' onClick={handleLogout}>
                Выйти
              </button>
            </li>
          ) : (
            <li className='liauth'>
              <input
                className='inputauth'
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className='inputauth'
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className='buttonauth' onClick={handleLogin}>
                Войти
              </button>
              {error && <div className='error'>{error}</div>}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default AuthComponent;


