import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import UserService from '../service/UserService'
import { Link } from 'react-router-dom'

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({})

    useEffect(() => {
        fetchProfileInfo()
    }, [])

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token)
            setProfileInfo(response.user) //user
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    }

  return (
    <div className='profile-page-container'>
        <h2>Profile Information</h2>
        <p>Name: {profileInfo.names}</p>
        <p>Email: {profileInfo.email}</p>
        <p>Username: {profileInfo.user_name}</p>
        {/* Agregar los datos que se quieran mostrar */}
        {profileInfo.role === "ADMINISTRATOR" && (
            <button><Link to={`/update-user/${profileInfo.idUser}`}>Update This Profile</Link></button>
        )}
    </div>
  )
}
export default ProfilePage