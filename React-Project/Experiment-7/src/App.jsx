import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductCard from './ProductCard.jsx';

function App() {
  return (
   <div class="outer-div">
    <h2>Product List</h2>
    <div className='cart'>
    <ProductCard product={{ name:"Wireless mouse",price: 250,status: "Avaliable"}}/>
    <ProductCard product={{ name:"keyboard",price: 500,status: "Out Of Stock"}}/>
    <ProductCard product={{ name:"Laptop",price: 2500,status: "Avaliable"}}/>
   </div>
   </div>
  )
}

export default App
