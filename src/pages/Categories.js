// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// // import DataTable from '../components/DataTable';

// export default function Categories() {

//   const [categories, setCategories] = useState([]);
//   const headers = ["ID_CATEGORY", "CATEGORY"];

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = () => {
//     axios.get("http://localhost:8086/api/category/all")
//       .then((response) => {
//         setCategories(response.data.data)
//       })
//       .catch((e) => {
//         console.log(e);
//     })
//   }

//   return (
//     <div>
//       <h1>Categories</h1>
//       {/* <div className="container">
//         <Table>
//           <thead>
//             <tr>
//               <th scope='col'>#</th>
//               <th scope='col'>Nombre</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((category) => (
//               <>
//                 <tr>
//                   <th scope='row' key={category.idCategory}>{category.idCategory}</th>
//                   <td>{category.name}</td>
//                 </tr>
//               </>
//             ))}
//           </tbody>
//         </Table>
//       </div> */}
//       <DataTable headers={headers} data={categories}/>
//     </div>
//   )
// }