// import React from 'react';
// import { Table } from 'react-bootstrap';

// export default function DataTable(props) {

//   return (
//     <Table>
//       <thead>
//         <tr>
//           {props.headers.map((header, index) => (
//             <th key={index} scope='col'>{header}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {props.data.map((row, rowIndex) => (
//           <tr key={rowIndex}>
//             {Object.values(row).map((value, columnIndex) => (
//               <td key={columnIndex}>{value}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// }


import React from 'react';

export default function DataTable({ data, columns, renderRow, openModal, deleteItem }) {
    return (
        <div className="table-responsive">
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody className='table-group-divider'>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>{item[column.field]}</td>
                            ))}
                            <td>
                                <button onClick={() => openModal(2, item.id)} className='btn btn-warning'>
                                    Editar
                                </button>
                                &nbsp;
                                <button onClick={() => deleteItem(item.id)} className='btn btn-danger'>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}