import React, { useEffect, useState } from 'react'
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';

function UserManagementPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users data when the components mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localstorage
            const response = await UserService.getAllUsers(token);
            console.log(response);
            setUsers(response.users); // Assuming the list of users is under the key 'users'
        } catch (error) {
            console.error('Error fetching users: ', error);
        }
    }

    const deleteUser = async (userId) => {
        try {
            // Prompt for confirmation before deleting the user
            const confirmDelete = window.confirm('Are you sure you want to delete this user?');

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            if (confirmDelete) {
                await UserService.deleteUser(userId, token);
                // After deleting the user, fetch the updated list of users
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user: ', error);
        }
    }

  return (
    <div className='user-management-container'>
        <h2>User Management Page</h2>
        <button className='reg-button'><Link to="/register">Add User</Link></button>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Identificación</th>
                    <th>Nombres</th>
                    <th>Télefono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map(user => (
                        <tr key={user.idUser}>
                            <td>{user.idUser}</td>
                            <td>{user.typeDoc + " " + user.numIdentification}</td>
                            <td>{user.names + " " + user.lastNames}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className='delete-button' onClick={() => deleteUser(user.idUser)}>Delete</button>
                                <button><Link to={`/update-user/${user.idUser}`}>Update</Link></button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
  )
}
export default UserManagementPage
