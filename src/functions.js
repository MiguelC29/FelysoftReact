import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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

export function modalDelte(nameTable, name, setTable, id, request, url) {
    MySwal.fire({
        title: '¿Seguro de eliminar ' + nameTable + ' ' + name + ' ?',
        icon: 'question',
        text: 'No se podrá dar marcha atrás',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            setTable(id);
            const durl =  url + 'delete/' + id;
            request('PUT', { id: id }, durl);
        } else {
            show_alert('El rol NO fue eliminado', 'info');
        }
    });
}