import React from 'react'

const Testimo = () => {
  return (
    <div>
        <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-4">What Customers Say</h2>

        <div className="row text-center">
          <div className="col-md-4">
            <blockquote>
              <p>"Fast delivery and amazing products!"</p>
              <footer>– Jane D.</footer>
            </blockquote>
          </div>
 
          <div className="col-md-4">
            <blockquote>
              <p>"My go-to online store for everything I need."</p>
              <footer>– Mark A.</footer>
            </blockquote>
          </div>

          <div className="col-md-4">
            <blockquote>
              <p>"Great prices and top quality items."</p>
              <footer>– Sarah O.</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default Testimo