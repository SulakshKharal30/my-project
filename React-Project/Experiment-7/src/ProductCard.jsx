function ProductCard({product}){

  return (
  <div id ="product-card">
   <div>Name: {product.name}</div>
   <div>Price: ${product.price}</div>
   <div>Status: {product.status}</div>
 </div>  
  )
}
export default ProductCard
