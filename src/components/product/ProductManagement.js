import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Updated import
import ProductList from './ProductList';
import { fetchProducts } from '../../api/apifile';
import PageHeader from '../common/PageHeader';
import Loader from '../common/Loader';
import Alert from '../common/Alert';


const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Replaced useHistory with useNavigate

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    navigate('/products/new'); // Updated navigation
  };

  const handleEditProduct = (productId) => {
    navigate(`/products/edit/${productId}`); // Updated navigation
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <PageHeader title="Product Management">
        <Button variant="primary" onClick={handleAddProduct}>
          Add New Product
        </Button>
      </PageHeader>
      
      {error && <Alert message={error} variant="danger" />}
      
      <Row>
        <Col>
          <ProductList 
            products={products} 
            onEdit={handleEditProduct} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductManagement;