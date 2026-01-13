import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Addproduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "" // Added missing category field
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const convertImage = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Please upload a valid image (JPEG, PNG, GIF, WebP)' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setErrors(prev => ({ ...prev, image: '' }));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result = reader.result;
      setImage(result);
      setImagePreview(result);
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!form.category) newErrors.category = 'Category is required';
    if (!image) newErrors.image = 'Product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Prepare form data (could also use FormData for file uploads)
      const productData = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        image
      };

      const res = await axios.post(
        "http://localhost:5007/api/v1/add-product",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.status) {
        alert("Product added successfully!");
        navigate("/");
      } else {
        alert(res.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);

      let errorMessage = "Failed to add product";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);

      // Handle authentication errors
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertImage(file);
    }
  };

  const categories = [
    "Electronics",
    "Fashion",
    "Groceries",
    "Home & Living",
    "Beauty & Health",
    "Sports & Outdoors",
    "Books & Media",
    "Toys & Games",
    "Automotive"
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-primary text-white text-center py-3 rounded-top-4">
              <h3 className="mb-0">Upload Product</h3>
              <p className="mb-0 small">Fill in the product details below</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Product Name */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Product Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter product name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Product Description */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Description *</label>
                  <textarea
                    onChange={handleChange}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows="3"
                    placeholder="Enter product description"
                    name="description"
                    value={form.description}
                    disabled={loading}
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="row">
                  {/* Price */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">₦</span>
                      <input
                        type="number"
                        onChange={handleChange}
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        placeholder="0.00"
                        name="price"
                        value={form.price}
                        step="0.01"
                        min="0"
                        disabled={loading}
                      />
                    </div>
                    {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
                  </div>

                  {/* Quantity */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Quantity *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                      placeholder="Enter quantity"
                      onChange={handleChange}
                      name="quantity"
                      value={form.quantity}
                      min="0"
                      disabled={loading}
                    />
                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                  </div>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Category *</label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    value={form.category}
                    onChange={handleChange}
                    name="category"
                    disabled={loading}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Product Image *</label>
                  <input
                    type="file"
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={loading}
                  />
                  {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="mb-2">Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    </div>
                  )}

                  <div className="form-text">
                    Upload a product image (JPEG, PNG, GIF, WebP, max 5MB)
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 fw-bold rounded-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : (
                      'Upload Product'
                    )}
                  </button>
                </div>

                {/* Required fields note */}
                <div className="mt-3 text-muted small">
                  * Required fields
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Addproduct;