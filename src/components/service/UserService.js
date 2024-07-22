import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8086/api"

    static async login(email, password) {
        try {
            
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email, password})
            return response.data;

        } catch(err) {
            throw err;
        }
    }

    static async register(userData, token) {
        try {
            
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        } catch(err) {
            throw err;
        }
    }

    static async getAllUsers(token) {
        try {
            
            const response = await axios.get(`${UserService.BASE_URL}/auth/admin/get-all-users`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        } catch(err) {
            throw err;
        }
    }

    static async getYourProfile(token) {
        try {
            
            const response = await axios.get(`${UserService.BASE_URL}/auth/adminuser/get-profile`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        } catch(err) {
            throw err;
        }
    }

    static async getUserById(userId, token) {
        try {
            
            const response = await axios.get(`${UserService.BASE_URL}/auth/admin/get-user/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        } catch(err) {
            throw err;
        }
    }

    static async deleteUser(userId, token) {
        try {
            
            const response = await axios.delete(`${UserService.BASE_URL}/auth/admin/delete/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        } catch(err) {
            throw err;
        }
    }

    static async updateUser(userId, userData, token) {
        try {
            
            const response = await axios.put(`${UserService.BASE_URL}/auth/admin/update/${userId}`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            return response.data;

        } catch(err) {
            throw err;
        }
    }

    /* AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMINISTRATOR'
    }

    static isCustomer() { // isUser
        const role = localStorage.getItem('role')
        return role === 'CUSTOMER' // for my case I'd try with a customer, later I need to try it with an user
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;