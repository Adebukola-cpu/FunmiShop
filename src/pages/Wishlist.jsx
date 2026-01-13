import React from "react";

const Wishlist = () => {
    return (
        <div className="container mt-5 text-center">
            <h2>My Wishlist ❤️</h2>
            <p className="text-muted mt-3">
                Products you save will appear here.
            </p>
        </div>
    );
};

export default Wishlist;


// const API_URL = 'http://localhost:5007/api/v1/products';

// const FeaturedProd = ({ onCartUpdate }) => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const fetchProducts = async () => {
//         try {
//             const res = await axios.get(API_URL);
//             setProducts(res.data); // backend returns array
//         } catch (error) {
//             console.error('Failed to load products:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddToCart = async (productId) => {
//         const token = localStorage.getItem('token');

//         if (!token) {
//             navigate('/login');
//             return;
//         }

//         try {
//             const res = await axios.post(
//                 'http://localhost:5007/api/v1/cart/add',
//                 { productId, quantity: 1 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (res.data.status) {
//                 onCartUpdate?.(res.data.cart.totalItems);
//                 alert('Product added to cart');
//             }
//         } catch (error) {
//             alert(error.response?.data?.message || 'Failed to add to cart');
//         }
//     };

//     const handleBuyNow = async (productId) => {
//         await handleAddToCart(productId);
//         navigate('/Cartitem');
//     };

//     if (loading) {
//         return (
//             <div className="text-center my-5">
//                 <div className="spinner-border text-primary" />
//             </div>
//         );
//     }

//     return (
//         <div className="container">
//             <h2 className="text-center mb-4">Featured Products</h2>

//             <div className="row">
//                 {products.length === 0 ? (
//                     <p className="text-center">No products available</p>
//                 ) : (
//                     products.map((product) => (
//                         <div className="col-md-3 mb-4" key={product._id}>
//                             <div className="card h-100 shadow-sm product-card">
//                                 <img
//                                     src={product.image}
//                                     className="card-img-top"
//                                     alt={product.productName}
//                                     style={{ height: '200px', objectFit: 'cover' }}
//                                 />

//                                 <div className="card-body text-center d-flex flex-column">
//                                     <h5 className="card-title">{product.productName}</h5>
//                                     <p className="text-muted small">{product.category}</p>
//                                     <p className="fw-bold">
//                                         ₦{product.productPrice.toLocaleString()}
//                                     </p>

//                                     <div className="mt-auto d-grid gap-2">
//                                         <button
//                                             className="btn btn-outline-primary btn-sm"
//                                             onClick={() => handleAddToCart(product._id)}
//                                         >
//                                             Add to Cart
//                                         </button>

//                                         <button
//                                             className="btn btn-primary btn-sm"
//                                             onClick={() => handleBuyNow(product._id)}
//                                         >
//                                             Buy Now
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FeaturedProd;