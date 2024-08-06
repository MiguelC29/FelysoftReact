import axios from "axios";

class Request_Service {
    static BASE_URL = "http://localhost:8086/api"

    static async sendRequest(method, parameters, url, op, toast, nameTable, mainUrl, setData) {
        try {
            const token = localStorage.getItem('token');
            await axios({ method: method, url: this.BASE_URL + url, data: parameters, 
                headers: { Authorization: `Bearer ${token}` } 
                })
                .then((response) => {
                    const type = response.data['status'];
                    const msg = response.data['data'];
                    if (type === 'success') {
                        toast.current.show({ severity: 'success', summary: msg, detail: nameTable + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                        this.getData(mainUrl, setData);
                    }
                    return response.data;
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: nameTable + ' NO ' + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                    console.log(error);
                });
        } catch (err) {
            throw err;
        }
    }

    static async sendRequestAsociation(parameters, url, toast) {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(this.BASE_URL + url, parameters, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            let type = response.data['status'];
            let msg = response.data['data'];
            if (type === 'success') {
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: msg, life: 3000 });
            }
            return response.data;
    
        } catch (error) {
            if (error.response && error.response.data && error.response.data.data === 'Asociación existente') {
                let entity1 = error.response.data.entity1;
                let entity2 = error.response.data.entity2;
                // Si el error es de asociación existente, mostramos el mensaje personalizado
                toast.current.show({ 
                    severity: 'info', 
                    summary: 'Asociación Existente', 
                    detail: `La asociación entre ${entity1} y ${entity2} ya existe.`, 
                    life: 3000 
                });
            } else {
                // Para otros errores, mostramos un mensaje genérico de asociación fallida
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Error en la solicitud', 
                    detail: 'Asociación fallida', 
                    life: 3000 
                });
            }
            console.log(error);
        }
    }
    

    static async getData(url, setData) {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localstorage
            await axios.get(this.BASE_URL + url, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => {
                    console.log(response);
                    setData(response.data.data);
                    return response.data;
                })
        } catch (error) {
            console.error('Error fetching users: ', error);
        }
    }

    static async deleteData(url, id, setData, toast, setDeleteDataDialog, setTable, emptyData, nameTable, mainUrl) {
        const deleteUrl = this.BASE_URL + url + 'delete/' + id;
        const token = localStorage.getItem('token'); // Retrieve the token from localstorage
        await axios.put(deleteUrl, {},
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                let type = response.data['status'];
                let msg = response.data['data'];
                if (type === 'success') {
                    toast.current.show({ severity: 'success', summary: msg, detail: nameTable + ' Eliminado', life: 3000 });
                    this.getData(mainUrl, setData);
                }
                return response.data;
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: nameTable + ' NO Eliminado', life: 3000 });
                console.log(error);
            });

        setDeleteDataDialog(false);
        setTable(emptyData);
    }
}

export default Request_Service
