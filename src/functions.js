import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const MySwal = withReactContent(Swal);

export function show_alert(message, icon, foco = '') {
    onFocus(foco);
    MySwal.fire({
        title: message,
        icon: icon
    });
}

function onFocus(foco) {
    if (foco !== '') {
        document.getElementById(foco).focus();
    }
}

export function modalDelte(nameTable, name, setId, id, setTable, url) {
    MySwal.fire({
        title: '¿Seguro de eliminar ' + nameTable + ' ' + name + ' ?',
        icon: 'question',
        text: 'No se podrá dar marcha atrás',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            setId(id);
            const durl =  url + 'delete/' + id;
            sendRequest('PUT', { id: id }, durl, setTable, url);
        } else {
            show_alert((nameTable + ' NO fue eliminado').toUpperCase(), 'info');
        }
    });
}

export const getData = async (url, setData) => {
    await axios.get(url + 'all')
        .then((response) => {
            setData(response.data.data);
        })
}

export const getOneData = async (url, setData) => {
    await axios.get(url)
        .then((response) => {
            setData(response.data.data);
        })
}

export const sendRequest = (method, parameters, url, setData, mainUrl) => {
    axios({ method: method, url: url, data: parameters }).then((response) => {
        let type = response.data['status'];
        let msg = response.data['data'];
        show_alert(msg, type);
        if (type === 'success') {
            document.getElementById('btnCerrar').click();
            getData(mainUrl, setData);
        }
    })
        .catch((error) => {
            show_alert('Error en la solicitud', 'error');
            console.log(error);
        });
}

export const confirmAction = (op, actions) => {
    MySwal.fire({
        title: '¿Estás seguro?',
        icon: 'warning',
        text: 'Se ' + ((op === 1) ? 'guardarán' : 'actualizarán') + ' los datos ingresados.',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33"
    }).then((result) => {
        if (result.isConfirmed) {
            actions();
        }
    });
}

/* export const openModals = (op, id, name, setId, setName, setOperation, setTitle, tableName, cOnFocus) => {
    setId('');
    setName('');
    setOperation(op);
    switch (op) {
        case 1:
            setTitle('Registrar ' + tableName);
            break;
        case 2:
            setTitle('Editar ' + tableName);
            setId(id);
            setName(name);
            break;
        default:
            break;
    }
    window.setTimeout(() => { document.getElementById(cOnFocus).focus(); }, 500);
} */