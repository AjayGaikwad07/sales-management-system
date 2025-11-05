import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom'; 
import { fetchProducts, createProduct, updateProduct } from '../../api/apifile';
import Loader from '../common/Loader';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    productName: '',
    rate: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const loadProduct = async () => {
        setLoading(true);
        try {
          const product = await fetchProducts(id);
          setFormData({
            productName: product.productName,
            rate: product.rate
          });
        } catch (err) {
          setError('Failed to load product data');
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rate' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/products'); // ✅ Changed here
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.productName && isEditMode) return <Loader />;

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="productName" className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="rate" className="mb-3">
            <Form.Label>Rate</Form.Label>
            <Form.Control
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Save'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;
