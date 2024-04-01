import axios from 'axios';

export default class pruebaUsuarios {
    baseUrl = "http://localhost:8086/api/user/"; 

    getAll() {
        return axios.get(this.baseUrl + "all").then(res => res.data.data);
    }
}
