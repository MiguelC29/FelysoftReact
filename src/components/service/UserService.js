import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8086/api"

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
            const { token, expirationTime, role } = response.data;

            // Asegúrate de que expirationTime esté en formato ISO 8601
            if (!expirationTime || isNaN(Date.parse(expirationTime))) {
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

    static async register(parameters, toast, setData, navigate) {
        try {
            await axios({ method: 'POST', url: `${UserService.BASE_URL}/auth/register`, data: parameters })
                .then((response) => {
                    if (response.data.error === "Usuario Existente") {
                        throw new Error("Usuario Existente");
                    } else {
                        toast.current.show({ severity: 'success', summary: 'Registro usuario', detail: 'Usuario registrado. Inicie Sesión.', life: 3000 });
                        // Navegar primero
                        setTimeout(() => {
                            setData();

                            // Ejecutar setData después de la navegación
                            setTimeout(() => {
                                navigate('/login');
                            }, 10); // Puedes ajustar el tiempo si es necesario

                        }, 2300);
                    }
                    return response.data;
                })
                .catch((error) => {
                    if (error.message === "Usuario Existente") {
                        toast.current.show({ severity: 'error', summary: error.message, detail: "El usuario ya existe. Por favor inicie sesión", life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'Usuario no Registrado', life: 3000 });
                    }
                    console.log(error);
                });
            /*const type = response.data['status'];
            const msg = response.data['data'];
            if (type === 'success') {
                toast.current.show({ severity: 'success', summary: msg, detail: 'Usuario registrado', life: 3000 });
                // this.getData(mainUrl, setData);
            }*/
        } catch (err) {
            throw err;
        }
    }

    static async getYourProfile(token) {
        try {

            const response = await axios.get(`${UserService.BASE_URL}/auth/adminuser/get-profile`,
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