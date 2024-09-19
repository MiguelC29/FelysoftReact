import axios from "axios";

class Request_Service {
    //static BASE_URL = "https://felysoftspring-production.up.railway.app/api"
    static BASE_URL = "http://localhost:8086/api"

    static getToken() {
        return localStorage.getItem('token');
    }

    static async sendRequest(method, parameters, url, op, toast, nameTable, mainUrl, setData, setLoading) {
        try {
            const token = this.getToken();
            await axios({
                method: method, url: this.BASE_URL + url, data: parameters,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    if(setLoading) {
                        setLoading(false); // Termina el cargando
                    }
                    const type = response.data['status'];
                    const msg = response.data['data'];
                    if (type === 'success') {
                        toast.current.show({ severity: 'success', summary: msg, detail: nameTable + (op === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                        this.getData(mainUrl, setData);
                    }
                    return response.data;
                })
                .catch((error) => {
                    if(setLoading) {
                        setLoading(false); // Termina el cargando
                    }
                    if (error.response.data.data === 'Datos Desahibilitados') {
                        toast.current.show({ severity: 'error', summary: 'Datos Desahibilitados', detail: error.response.data.detail, life: 3000 });
                    }
                    else if (error.response.data.data === 'El producto ya existe') {
                        toast.current.show({ severity: 'error', summary: 'Producto Existente', detail: error.response.data.data, life: 3000 });
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
        const token = this.getToken();
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

    static async sendRequestReserve(method, parameters, url, toast, mainUrl, setData,setLoading) {
        try {
            const token = localStorage.getItem('token');
            await axios({
                method: method, url: this.BASE_URL + url, data: parameters,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setLoading(false);
                    const type = response.data['status'];
                    const msg = response.data['data'];
                    if (type === 'success') {
                        toast.current.show({ severity: 'success', summary: msg, detail: 'Reserva Creada', life: 3000 });
                        this.getData(mainUrl, setData);
                    }
                    return response.data;
                })
                .catch((error) => {
                    setLoading(false);
                    toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'Reserva  NO Creada', life: 3000 });
                    console.log(error);
                });
        } catch (err) {
            throw err;
        }
    }

    static async sendRequestEnable(url, id, setData, toast, nameTable) {
        const enableUrl = this.BASE_URL + url + 'enable/' + id;
        const disabledUrl = url + 'disabled';
        const token = this.getToken();
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

    static async sendRequestSale(method, parameters, url, toast, navigate, location, setLoading) {
        try {
            const token = this.getToken();
            await axios({
                method: method, url: this.BASE_URL + url, data: parameters,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setLoading(false); // Termina el cargando
                    const type = response.data['status'];
                    const msg = response.data['data'];
                    if (type === 'success') {
                        const toastMessage = {
                            severity: 'success',
                            summary: msg,
                            detail: 'Venta Creada',
                            life: 3000
                        };

                        if (location.pathname !== '/carrito') {
                            // Pasamos los datos del toast a la ruta /carrito mediante navigate
                            navigate('/carrito', { state: { toastMessage } });
                        } else {
                            // Mostrar el toast si ya estás en la vista de carrito
                            if (!toast.current._lastMessage || toast.current._lastMessage !== toastMessage) {
                                toast.current.show(toastMessage);
                                toast.current._lastMessage = toastMessage; // Guardar el mensaje para evitar duplicados
                            }
                        }
                    }
                    return response.data;
                })
                .catch((error) => {
                    setLoading(false); // Termina el cargando
                    const errorMessage = error.response.data['data'] === 'No hay suficientes productos'
                        ? 'Venta NO Creada, no hay suficiente stock'
                        : 'Venta NO Creada';

                    toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: errorMessage, life: 3000 });
                    console.log(error);
                });
        } catch (err) {
            throw err;
        }
    }

    static async getData(url, setData) {
        try {
            const token = this.getToken();
            await axios.get(this.BASE_URL + url,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => {
                    //console.log(response);
                    setData(response.data.data);
                    return response.data;
                })
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    static async deleteData(url, id, setData, toast, setDeleteDataDialog, setTable, emptyData, nameTable, mainUrl) {
        const deleteUrl = this.BASE_URL + url + 'delete/' + id;
        const token = this.getToken();
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
        const token = this.getToken();
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
        const token = this.getToken();
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

    static async updateProfileImage(id, parameters, toast) {
        const changeImgUrl = this.BASE_URL + '/user/updateImageProfile/' + id;
        const token = this.getToken();
        await axios.put(changeImgUrl, parameters,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                let type = response.data['status'];
                if (type === 'success') {
                    toast.current.show({ severity: 'success', summary: 'Cambio imagen usuario', detail: 'Imagen de perfil actualizada', life: 3000 });
                }
                return response.data;
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'No se pudo actualizar la imagen de perfil', life: 3000 });
                console.error('Error actualizando imagen de perfil:', error);
            });
    }

    static async cancelReserves(url, id, setData, toast, setTable, mainUrl) {
        const cancelUrl = this.BASE_URL + url + 'cancel/' + id;
        const token = this.getToken();
        await axios.put(cancelUrl, {},
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                let type = response.data['status'];
                let msg = response.data['data'];
                if (type === 'success') {
                    toast.current.show({ severity: 'success', summary: 'Cancelación Exitosa', detail: msg, life: 3000 });
                    this.getData(mainUrl, setData);
                }
                return response.data;
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'No se pudo cancelar la reserva', life: 3000 });
                console.log(error);
            });
        setTable();
    }
}

export default Request_Service
