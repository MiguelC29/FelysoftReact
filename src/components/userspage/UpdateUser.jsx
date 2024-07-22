import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../service/UserService';

function UpdateUser() {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [userData, setUserData] = useState({
        numIdentification: '',
        typeDoc: '',
        names: '',
        lastNames: '',
        address: '',
        phoneNumber: '',
        gender: '',
        email: '',
        user_name: '',
        role: ''
    });

    useEffect(() => {
        fetchUserDataById(userId); // Pass the userId to fetchUserDataById
    }, [userId]); // When ever there is a chane in userId, run this

    const fetchUserDataById = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getUserById(userId, token); // Pass userId to getUserById
            const { numIdentification, typeDoc, names, lastNames, address, phoneNumber, gender, email, user_name, role } = response.user;
            console.log(response);
            setUserData({ numIdentification, typeDoc, names, lastNames, address, phoneNumber, gender, email, user_name, role });
        } catch (error) {
            console.error('Error fetching user data: ', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const confirmDelete = window.confirm('Are you sure you want to update this user?');
            if(confirmDelete) {
                const token = localStorage.getItem('token');
                console.log(userData);
                await UserService.updateUser(userId, userData, token);
                // Redirect to profile page or display a success message
                navigate("/admin/user-management")
            }
        } catch (error) {
            console.error('Error updating user profile: ', error);
            alert(error);
        }
    }

  return (
    <div className='auth-container'>
        <h2>Update User</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Número de Identificación:</label>
                <input type="number" name='numIdentification' value={userData.numIdentification} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Tipo de Documento:</label>
                <input type="text" name='typeDoc' value={userData.typeDoc} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Nombres:</label>
                <input type="text" name='names' value={userData.names} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Dirección:</label>
                <input type="text" name='address' value={userData.address} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Número de Celular:</label>
                <input type="tel" name='phoneNumber' value={userData.phoneNumber} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Género:</label>
                <input type="text" name='gender' value={userData.gender} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Nombre de Usuario:</label>
                <input type="text" name='user_name' value={userData.user_name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Email:</label>
                <input type="email" name='email' value={userData.email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Rol:</label>
                <input type="text" name='role' value={userData.role} onChange={handleInputChange} />
            </div>
            <button type="submit">Update</button>
        </form>
    </div>
  )
}
export default UpdateUser