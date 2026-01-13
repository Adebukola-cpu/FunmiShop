import React from "react";

const Dashboard = () => {
    return (
        <div className="container mt-5">
            <h2 className="mb-4">Admin Dashboard</h2>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5>Total Products</h5>
                            <h3>120</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5>Total Orders</h5>
                            <h3>45</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5>Users</h5>
                            <h3>78</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;