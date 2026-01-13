import { useEffect, useState } from "react";
import axios from "axios";

const Deals = () => {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/products")
            .then((res) => {
                const filteredDeals = res.data.filter(
                    (p) => p.category === "Electronics"
                );
                setDeals(filteredDeals);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-danger mb-4">🔥 Deals</h2>

            <div className="row">
                {deals.map((deal) => (
                    <div key={deal._id} className="col-md-6 mb-4">
                        <div className="card border-danger shadow">
                            <img
                                src={deal.image}
                                alt={deal.productName}
                                className="card-img-top slide-image"
                                style={{ height: "250px", objectFit: "cover" }}
                            />

                            <div className="card-body text-center">
                                <h5>{deal.productName}</h5>
                                <p className="fw-bold text-danger">
                                    ₦{deal.productPrice.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Deals;
