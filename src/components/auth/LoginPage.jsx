import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserService from '../service/UserService'
import { useAuth } from '../context/AuthProvider'

function LoginPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const { login } = useAuth(); // Usar el contexto de autenticación


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const userData = await UserService.login(email, password)
            if (userData.token) {
                localStorage.setItem('token', userData.token)
                localStorage.setItem('role', userData.role)
                login(); // Actualizar el estado de autenticación
                navigate('/profile', { replace: true }); // Navegar a /profile
            } else {
                setError(userData.error)
            }
        } catch (error) {
            console.log(error)
            setError(error)
            setTimeout(() => {
                setError('')
            }, 5000) // 5 seg
        }
    }

  return (
    <div className='auth-container'>
        <h2>Login</h2>
        { error && <p className='error-message'>{error}</p> }
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Email: </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='form-group'>
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default LoginPage;