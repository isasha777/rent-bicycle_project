import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './employeelist.css';

const EmployeeList = () => {
  const initialEmployees = JSON.parse(localStorage.getItem('employees')) || [];
  
  const [employees, setEmployees] = useState(initialEmployees);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('newEmployeeId');
    if (storedId) {
      setSelectedEmployee((prevState) => ({ ...prevState, id: storedId }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const handleShowDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handleAddEmployee = () => {
    const newEmployee = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      password: 'value'
    };

    setEmployees([...employees, newEmployee]);
    handleShowDetails(newEmployee);
  };

  const handleDeleteEmployee = (id) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id);
    setEmployees(updatedEmployees);

    if (selectedEmployee && selectedEmployee.id === id) {
      setShowDetails(false);
      setSelectedEmployee(null);
    }
  };

  const handleInputChange = (event, key) => {
    const updatedEmployee = { ...selectedEmployee, [key]: event.target.value };
    setSelectedEmployee(updatedEmployee);

    const updatedEmployees = employees.map((employee) =>
      employee.id === updatedEmployee.id ? updatedEmployee : employee
    );
    setEmployees(updatedEmployees);
  };

  const handleAddEmployeeToServer = () => {
    const authToken = '3bba3e3a-320e-497c-845f-823e2e49ce3b';
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const newEmployeeData = {
      email: selectedEmployee.email,
      password: selectedEmployee.password,
    };
  
    axios
      .post('https://sf-final-project-be.herokuapp.com/api/officers', newEmployeeData, config)
      .then((response) => {
        console.log('Сотрудник успешно добавлен на сервер:', response.data);
        const newId = response.data.data._id;
        setSelectedEmployee({ ...selectedEmployee, id: newId });
  
        // Update the employee in the employees array as well
        const updatedEmployees = employees.map((employee) =>
          employee.id === selectedEmployee.id ? { ...employee, id: newId } : employee
        );
        setEmployees(updatedEmployees);
  
        localStorage.setItem('newEmployeeId', newId);
      })
      .catch((error) => {
        console.error('Ошибка при добавлении сотрудника:', error);
      });
  };
  

  const handleDeleteEmployeeFromServer = () => {
    const authToken = '3bba3e3a-320e-497c-845f-823e2e49ce3b';
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    axios
      .delete(`https://sf-final-project-be.herokuapp.com/api/officers/${selectedEmployee.id}`, config)
      .then((response) => {
        console.log('Сотрудник успешно удален:', response.data);
        const updatedEmployees = employees.filter((employee) => employee.id !== selectedEmployee.id);
        setEmployees(updatedEmployees);
        if (selectedEmployee) {
          setShowDetails(false);
          setSelectedEmployee(null);
        }
      })
      .catch((error) => {
        console.error('Ошибка при удалении сотрудника:', error);
      });
  };

  return (
    <div>
      <h1>Список сотрудников</h1>
      <ul className='employee-list'>
        {employees.map((employee) => (
          <li key={employee.id} onClick={() => handleShowDetails(employee)}>
            {employee.firstName} {employee.lastName}
            <button onClick={() => handleDeleteEmployee(employee.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddEmployee}>Добавить сотрудника</button>

      {showDetails && selectedEmployee && (
        <div className='employee-details'>
          <h2>Детальная информация</h2>
          <p>
            Имя: <input value={selectedEmployee.firstName} onChange={(e) => handleInputChange(e, 'firstName')} />
          </p>
          <p>
            Фамилия: <input value={selectedEmployee.lastName} onChange={(e) => handleInputChange(e, 'lastName')} />
          </p>
          <p>
            Email: <input value={selectedEmployee.email} onChange={(e) => handleInputChange(e, 'email')} />
          </p>
          <p>
            Пароль: <input value={selectedEmployee.password} onChange={(e) => handleInputChange(e, 'password')} />
          </p>
          <p>ID: {selectedEmployee.id}</p>
          <button onClick={() => setShowDetails(false)}>Закрыть</button>
          <button onClick={handleAddEmployeeToServer}>Добавить на сервер</button>
          <button onClick={handleDeleteEmployeeFromServer}>удалить сотрудника</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

