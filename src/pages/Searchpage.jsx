import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Searchpage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;

        const fetchProducts = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5007/api/v1/products?search=${query}`
                );
                setProducts(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    if (loading) return <p className="text-center mt-5">Searching...</p>;

    return (
        <div className="container mt-4">
            <h4>
                Search results for: <strong>{query}</strong>
            </h4>

            {products.length === 0 ? (
                <p className="text-muted">No products found</p>
            ) : (
                <div className="row">
                    {products.map((product) => (
                        <div className="col-md-3 mb-4" key={product._id}>
                            <div className="card h-100">
                                <img
                                    src={product.productImage}
                                    className="card-img-top"
                                    alt={product.productName}
                                />
                                <div className="card-body">
                                    <h6>{product.productName}</h6>
                                    <p>₦{product.productPrice}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Searchpage
