// ShopManagement.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ShopList from './ShopList'; // Verify this path is correct
import { fetchShops } from '../../api/apifile';
import PageHeader from '../common/PageHeader';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await fetchShops();
        setShops(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shops');
        setLoading(false);
      }
    };
    loadShops();
  }, []);

  const handleAddShop = () => {
    navigate('/shops/new');
  };

  const handleEditShop = (shopId) => {
    navigate(`/shops/edit/${shopId}`);
  };

   if (loading) return <Loader />;

  return (
    <Container>
      <PageHeader title="Shop Management">
        <Button variant="primary" onClick={handleAddShop}>
          Add New Shop
        </Button>
      </PageHeader>
      
      {error && <Alert message={error} variant="danger" />}
      
      <Row>
        <Col>
          {/* Make sure ShopList is properly imported and exported */}
          <ShopList 
            shops={shops} 
            onEdit={handleEditShop} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ShopManagement;