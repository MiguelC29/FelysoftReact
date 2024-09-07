import axios from "axios";
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

class UserService {
    static BASE_URL = "https://felysoftspring-production.up.railway.app/api"
    //static BASE_URL = "http://localhost:8086/api"

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
            const { token, expirationTime } = response.data;

            // Asegúrate de que expirationTime esté en formato ISO 8601
            if (!token || !expirationTime) {
                throw new Error(response.data.error || 'Invalid login credentials');
            }

            // Asegúrate de que expirationTime esté en formato ISO 8601
            if (isNaN(Date.parse(expirationTime))) {
                throw new Error('Invalid expiration date');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiration', expirationTime); // Usa el formato recibido
            return response.data;

        } catch (err) {
            throw err;
        }
    }

    static async register(parameters, toast, navigate, setLoading) {
        try {
            await axios({ method: 'POST', url: `${UserService.BASE_URL}/auth/register`, data: parameters })
                .then((response) => {
                    setLoading(false); // Termina el cargando
                    if (response.data.error === "Usuario Existente") {
                        throw new Error("Usuario Existente");
                    } else {
                        const Swal = require('sweetalert2');
                        Swal.fire({
                            title: "Registro exitoso!",
                            html: "Por favor verifica tu correo electrónico para activar tu cuenta.<br>Tienes 24 horas para activar tu cuenta.",
                            icon: "success"
                        })
                            .then((result) => {
                                if (result.isConfirmed) {
                                    navigate('/login');
                                }
                            });

                        return response.data;
                    }
                })
                .catch((error) => {
                    setLoading(false); // Termina el cargando
                    if (error.message === "Usuario Existente") {
                        toast.current.show({ severity: 'error', summary: error.message, detail: "El usuario ya existe. Por favor inicie sesión", life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'Usuario no Registrado', life: 3000 });
                    }
                    console.log(error);
                });
        } catch (err) {
            throw err;
        }
    }

    static async getYourProfile(token) {
        try {

            const response = await axios.get(`${UserService.BASE_URL}/auth/get-profile`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return response.data;

        } catch (err) {
            throw err;
        }
    }

    static async deleteUser(userId, token) {
        try {

            const response = await axios.put(`${UserService.BASE_URL}/user/delete/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return response.data;

        } catch (err) {
            throw err;
        }
    }

    static async changePassword(parameters, toast, handleLogout) {
        const url = this.BASE_URL + '/auth/changePassword';
        const token = localStorage.getItem('token'); // Retrieve the token from localstorage
        try {
            await axios({ method: 'PUT', url: url, data: parameters, headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    if (response.data.statusCode === 400 && response.data.message === 'Contraseña actual incorrecta') {
                        throw new Error("Contraseña incorrecta");
                    } else {
                        handleLogout();
                        return response.data;
                    }
                })
                .catch((error) => {
                    if (error.message === "Contraseña incorrecta") {
                        toast.current.show({ severity: 'error', summary: error.message, detail: "La contraseña ingresada no coincide con la actual.", life: 3000 });
                    } else {
                        console.error('Error cambiando la contraseña del usuario:', error);
                        toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'Ocurrió un error al cambiar la contraseña', life: 3000 });
                    }
                    console.log(error);
                });
        } catch (err) {
            throw err;
        }
    }

    static async verifyAccount(token, setLoading, navigate) {
        try {
            let title, message, icon;
            await axios.get(`${UserService.BASE_URL}/auth/verify-account/${token}`)
                .then((response) => {
                    setLoading(false); // Termina el cargando
                    if (response.data.message.includes("activada")) {
                        title = "Cuenta activa";
                        icon = "warning";
                        message = "La cuenta ya está activa.";
                    } else if (response.data.statusCode === 500 || response.data.statusCode === 404) {
                        title = "Error";
                        icon = "error";
                        message = response.data.message;
                    } else {
                        title = "Éxito";
                        icon = "success";
                        message = "Cuenta activada correctamente.";
                    }
                    
                    Swal.fire({
                        title: title,
                        text: message,
                        icon: icon,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/login');
                    });

                    return response.data;
                })
                .catch((error) => {
                    setLoading(false); // Termina el cargando
                    title = "Error";
                    icon = "error";
                    message = "Error al activar la cuenta. Intenta nuevamente.";

                    Swal.fire({
                        title: title,
                        text: message,
                        icon: icon,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/login');
                    });
                    console.log(error);
                });
        } catch (err) {
            throw err;
        }
    }

    static async verifyUser(email) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/auth/verify-user/${email}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async resetPassword(token, parameters) {
        try {
            const response = await axios({ method: 'PUT', url: `${UserService.BASE_URL}/auth/resetPassword/${token}`, data: parameters })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /* AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getRole() {
        const token = this.getToken();
        if (!token) {
            return null;
        }
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.role; // Asumiendo que el rol está en el payload del token
        } catch (error) {
            console.error("Invalid token", error);
            return null;
        }
    }

    static isAuthenticated() {
        return this.getToken() && !this.isTokenExpired();
    }

    static isTokenExpired() {
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        if (!tokenExpiration) {
            return true; // Si no hay fecha de expiración, considera el token como expirado
        }
        try {
            // Convertir la fecha de expiración a un objeto Date
            const expirationDate = new Date(tokenExpiration);
            // Comparar la fecha actual con la fecha de expiración
            return new Date() > expirationDate;
        } catch (error) {
            console.error("Invalid expiration date", error);
            return true; // Si hay un error al parsear la fecha, considera el token como expirado
        }
    }

    static isAdmin() {
        return this.getRole() === 'ADMINISTRATOR';
    }

    static isCustomer() {
        return this.getRole() === 'CUSTOMER';
    }

    static isSalesPerson() {
        return this.getRole() === 'SALESPERSON';
    }

    static isFinancialManager() {
        return this.getRole() === 'FINANCIAL_MANAGER';
    }

    static isInventoryManager() {
        return this.getRole() === 'INVENTORY_MANAGER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;