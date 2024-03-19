import React from 'react'
import { Link } from 'react-router-dom'

export default function Menu() {
  return (
    <>
    <div>
      <h2>Menu</h2>
      <br/>
        <Link to="/categories">Categorías</Link>
    </div>
    </>
  )
}