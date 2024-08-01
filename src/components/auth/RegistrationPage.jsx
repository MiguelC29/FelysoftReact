import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

function RegistrationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        numIdentification: '',
        typeDoc: '',
        names: '',
        lastNames: '',
        address: '',
        phoneNumber: '',
        gender: '',
        email: '',
        user_name: '',
        password: '',
        role: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Call the register method from userSevice

            const token = localStorage.getItem('token')
            await UserService.register(formData, token)

            setFormData({
                numIdentification: '',
                typeDoc: '',
                names: '',
                lastNames: '',
                address: '',
                phoneNumber: '',
                gender: '',
                email: '',
                user_name: '',
                password: '',
                role: ''
            })
            alert('User registered successfully')
            navigate('/admin/user-management')
        } catch (error) {
            console.error('Error registering user:', error)
            alert('An error ocurred while registering user')
        }
    }

  return (
    <div className='auth-container'>
        <h2>Registration</h2>
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Número de Identificación: </label>
                <input type="number" name='numIdentification' value={formData.numIdentification} onChange={handleInputChange} required />
            </div>
            <div className='form-group'>
                <label>Tipo de Documento: </label>
                <input type="text" name='typeDoc' value={formData.typeDoc} onChange={handleInputChange} required />
            </div>
            <div className='form-group'>
                <label>Nombres: </label>
                <input type="text" name='names' value={formData.names} onChange={handleInputChange} required />
            </div>
            <div className='form-group'>
                <label>Dirección: </label>
                <input type="text" name='address' value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className='form-group'>
                <label>Número de Celular: </label>
                <input type="tel" name='phoneNumber' value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>
            <div className='form-group'>
                <label>Género: </label>
                <input type="text" name='gender' value={formData.gender} onChange={handleInputChange} required />
            </div>
            <div className='form-group'>
                <label>Nombre de Usuario: </label>
                <input type="text" name='user_name' value={formData.user_name} onChange={handleInputChange} required />
            </div>
            <div className='form-group'>
                <label>Email: </label>
                <input type="email" name='email' value={formData.email} onChange={handleInputChange} required autoComplete="new-username" />
            </div>
            <div className='form-group'>
                <label>Password: </label>
                <input type="password" name='password' value={formData.password} onChange={handleInputChange} required autoComplete="new-password" />
            </div>
            <div className='form-group'>
                <label>Rol: </label>
                <input type="text" name='role' value={formData.role} onChange={handleInputChange} required />
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
  )
}
export default RegistrationPage;