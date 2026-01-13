import { useEffect, useState } from "react";
import axios from "axios";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/products")
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h3 className="text-center mt-5">Loading products...</h3>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Shop</h2>

            <div className="row">
                {products.map((product) => (
                    <div key={product._id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={product.image}
                                alt={product.productName}
                                className="card-img-top slide-image"
                                style={{ height: "220px", objectFit: "cover" }}
                            />

                            <div className="card-body text-center">
                                <h5>{product.productName}</h5>
                                <p>₦{product.productPrice.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;