import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { fetchShops, createShop, updateShop } from "../../api/apifile";



const ShopForm = ({ shopId, onSuccess }) => {
    const [formData, setFormData] = useState({
      shopName: '',
      balanceAmount: 0
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
  
    useEffect(() => {
      if (shopId) {
        setIsEditMode(true);
        const loadShop = async () => {
          setIsLoading(true);
          try {
            const shop = await fetchShops(shopId);
            setFormData({
              shopName: shop.shopName,
              balanceAmount: shop.balanceAmount
            });
          } catch (err) {
            setError(err.message || 'Failed to load shop data');
          } finally {
            setIsLoading(false);
          }
        };
        loadShop();
      }
    }, [shopId]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === 'balanceAmount' ? parseFloat(value) || 0 : value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!formData.shopName.trim()) {
        setError('Shop name is required');
        return;
      }
  
      if (formData.balanceAmount < 0) {
        setError('Balance amount cannot be negative');
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        let result;
        if (isEditMode) {
          result = await updateShop(shopId, formData);
        } else {
          result = await createShop(formData);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        setError(err.message || 'Failed to save shop data');
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isLoading && !isEditMode) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
  
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            {isEditMode ? 'Edit Shop' : 'Create New Shop'}
          </Card.Title>
          
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
  
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="shopName">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Enter shop name"
                required
                disabled={isLoading}
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="balanceAmount">
              <Form.Label>Balance Amount</Form.Label>
              <Form.Control
                type="number"
                name="balanceAmount"
                value={formData.balanceAmount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                disabled={isLoading}
              />
            </Form.Group>
  
            <div className="d-flex justify-content-end">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Saving...</span>
                  </>
                ) : (
                  isEditMode ? 'Update Shop' : 'Create Shop'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };
  
  export default ShopForm;



