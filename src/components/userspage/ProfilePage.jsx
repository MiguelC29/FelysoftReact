import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import UserService from '../service/UserService'
import "../../css/perfilUsuario.css"

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
    const getGenderIcon = (gender) => {
        if (gender === "MASCULINO") {
            return <i className="fas fa-mars"></i>;
        } else if (gender === "FEMENINO") {
            return <i className="fas fa-venus"></i>;
        } else {
            return <i className="fas fa-genderless"></i>;
        }
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };
    const description = (role) => {
        const roleDescriptions = {
            "ADMINISTRATOR": "Administrador de Felysoft.",
            "INVENTORY_MANAGER": "Gerente de Inventario de Felysoft.",
            "FINANCIAL_MANAGER": "Gerente de Finanzas de Felysoft.",
            "SALESPERSON": "Vendedor de Felysoft.",
            "CUSTOMER": "Bienvenido A Su Perfil."
        };
        return roleDescriptions[role] || "USER";
    };

    return (
        <div className='profile-page-container'>
            <section className="seccion-perfil-usuario">
                <div className="perfil-usuario-header">
                    <div className="perfil-usuario-portada">
                        <div className="perfil-usuario-avatar">
                            {profileInfo.image ?
                                <img id='imagen-perfil'
                                    src={`data:${profileInfo.imageType};base64,${profileInfo.image}`}
                                    alt={`Imagen usuario ${profileInfo.names}`}
                                /> :
                                <img id='imagen-perfil'
                                    src="https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
                                    alt={`No cuenta con img de perfil`}
                                />}
                            <button type="button" className="boton-avatar">
                                <i className="far fa-image"></i>
                            </button>
                        </div>
                        <button type="button" className="boton-portada">
                            <i className="far fa-image"></i> Cambiar fondo
                        </button>
                    </div>
                </div>
                <div className="perfil-usuario-body">
                    <div className="perfil-usuario-bio">
                        <h3 className="titulo">{profileInfo.names} {profileInfo.lastNames} {getGenderIcon(profileInfo.gender)}</h3>
                        <p className="texto">
                            <h3>{description(profileInfo.role)}</h3>
                        </p>
                    </div>
                    <div className="perfil-usuario-footer">
                        <ul className="lista-datos">
                            <li><i className="icono fas fa-envelope"></i> Correo Electrónico: {profileInfo.email}</li>
                            <li><i className="icono fas fa-user"></i> Nombre de Usuario: {profileInfo.user_name}</li>
                            <li><i className="icono fas fa-phone"></i> Numero de Contacto: {profileInfo.phoneNumber}</li>
                            <li><i className="icono fas fa-map-marker-alt"></i> Dirección: {profileInfo.address}</li>
                        </ul>
                        <ul className="lista-datos">
                            <li><i className="icono fas fa-solid fa-passport"></i> Tipo Documento: {profileInfo.typeDoc}</li>
                            <li><i className="icono fas fa-regular fa-address-card"></i> Identificación: {profileInfo.numIdentification}</li>
                            <li><i className="icono fas fa-user-check"></i> Registro: {formatDate(profileInfo.dateRegister)} </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
    /* <h2>Profile Information</h2>
     <p>Name: {profileInfo.names}</p>
     <p>Email: {profileInfo.email}</p>
     <p>Username: {profileInfo.user_name}</p>
     { Agregar los datos que se quieran mostrar }
     {profileInfo.role === "ADMINISTRATOR" && (
         <button><Link to={`/update-user/${profileInfo.idUser}`}>Update This Profile</Link></button>
     )}*/
}
export default ProfilePage