import axios from "axios";

class Request_Service {
    static BASE_URL = "https://felysoftspring-production.up.railway.app/api"

    static async sendRequest(method, parameters, url, op, toast, nameTable, mainUrl, setData) {
        try {
            const token = localStorage.getItem('token');
            await axios({
                method: method, url: this.BASE_URL + url, data: parameters,
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
                    if (error.response.data.data === 'Datos Desahibilitados') {
                        toast.current.show({ severity: 'error', summary: 'Datos Desahibilitados', detail: error.response.data.detail, life: 3000 });
                    }
                    else if (error.response.data.error_message === 'Tipo Imagen Incorrecto') {
                        toast.current.show({ severity: 'error', summary: 'Imagen Incorrecta', detail: error.response.data.data, life: 3000 });
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: nameTable + ' NO ' + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                    }
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

    static async sendRequestEnable(url, id, setData, toast, nameTable) {
        const enableUrl = this.BASE_URL + url + 'enable/' + id;
        const disabledUrl = url + 'disabled';
        const token = localStorage.getItem('token'); // Retrieve the token from localstorage
        await axios.put(enableUrl, {},
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                let type = response.data['status'];
                let msg = response.data['data'];
                if (type === 'success') {
                    toast.current.show({ severity: 'success', summary: msg, detail: nameTable + ' Habilitado', life: 3000 });
                    this.getData(disabledUrl, setData);
                }
                return response.data;
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: nameTable + ' NO Habilitado', life: 3000 });
                console.log(error);
            });

        //setDeleteDataDialog(false);
        //setTable(emptyData);
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

    static async deleteAsociation(parameters, setData, toast, setDeleteDataDialog, setTable, emptyData, nameTable, mainUrl, urlEntity) {
        const deleteUrl = this.BASE_URL + urlEntity + 'deleteAssociation';
        const token = localStorage.getItem('token'); // Retrieve the token from localstorage
        await axios.put(deleteUrl, parameters,
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

    static async changeStateUser(url, id, setData, toast, setTable, emptyData, mainUrl) {
        const deleteUrl = this.BASE_URL + url + 'enabled_disabled/' + id;
        const token = localStorage.getItem('token'); // Retrieve the token from localstorage
        await axios.put(deleteUrl, {},
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                let type = response.data['status'];
                let msg = response.data['data'];
                if (type === 'success') {
                    toast.current.show({ severity: 'success', summary: 'Cambio estado usuario', detail: msg, life: 3000 });
                    this.getData(mainUrl, setData);
                }
                return response.data;
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'No se pudo cambiar el estado del usuario', life: 3000 });
                console.log(error);
            });
        setTable(emptyData);
    }
}

export default Request_Service
