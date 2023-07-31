// import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Header from './header';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <div className="App">
      <Header/>
    </div>
  );
}

export default App; 
