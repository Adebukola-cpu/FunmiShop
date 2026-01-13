import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect
        setTimeout(() => {
            navigate("/home");
        }, 1500);
    }, [navigate]);

    return (
        <div style={styles.container}>
            <h2>👋 Logged Out</h2>
            <p>You have been logged out successfully.</p>
            <p>Redirecting to login...</p>
        </div>
    );
};

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
};

export default Logout;          