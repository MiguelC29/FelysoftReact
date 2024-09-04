import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8086/api"

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
            const { token, expirationTime, role } = response.data;            

            // Asegúrate de que expirationTime esté en formato ISO 8601
            if (!token || !expirationTime || !role) {
                throw new Error(response.data.error || 'Invalid login credentials');
            }

            // Asegúrate de que expirationTime esté en formato ISO 8601
            if (isNaN(Date.parse(expirationTime))) {
                throw new Error('Invalid expiration date');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiration', expirationTime); // Usa el formato recibido
            localStorage.setItem('role', role);
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

    static async verifyAccount(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/auth/verify-account/${token}`);
            return response.data;
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
        localStorage.removeItem('role');
        localStorage.removeItem('tokenExpiration');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return token && !this.isTokenExpired();
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
        const role = localStorage.getItem('role')
        return role === 'ADMINISTRATOR'
    }

    static isCustomer() {
        const role = localStorage.getItem('role')
        return role === 'CUSTOMER'
    }

    static isSalesPerson() {
        const role = localStorage.getItem('role')
        return role === 'SALESPERSON'
    }

    static isFinancialManager() {
        const role = localStorage.getItem('role')
        return role === 'FINANCIAL_MANAGER'
    }

    static isInventoryManager() {
        const role = localStorage.getItem('role')
        return role === 'INVENTORY_MANAGER'
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;