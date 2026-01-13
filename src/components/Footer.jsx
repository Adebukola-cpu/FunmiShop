import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className="footer bg-dark text-white pt-5 pb-4">
                <div className="container_foot d-flex justify-content-between px-3"> 
                    <div className='first'>
                        <h5>Company info</h5>
                        <p>About Temu</p>
                        <p>Temu – Shop Like a Billionaire</p>
                        <p>Affiliate & Influencer Program: Join to Earn</p>
                        <p>Contact us</p>
                        <p>Careers</p>
                        <p>Press</p>
                        <p>Temu's Tree Planting Program</p>
                    </div>

                    <div>
                        <h5>Customer service</h5>
                        <p>Return and refund policy</p>
                        <p>Intellectual property policy</p>
                        <p>Shipping info</p>
                        <p>Report suspicious activity</p>
                    </div>

                    <div>
                        <h5>Help</h5>
                        <p>Support center & FAQ</p>
                        <p>Safety center</p>
                        <p>Temu purchase protection</p>
                        <p>Sitemap</p>
                        <p>Partner with Temu</p>
                    </div>

                    <div>

                    </div>

                </div>
                <hr />
                <div className="container_reserve text-center mt-4">
                    <p>&copy; 2025 MyShop. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer