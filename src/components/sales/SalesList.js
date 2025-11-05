import React, { useState, useEffect } from 'react';
// import { fetchSales, getSalesByShop, printAndSendBill } from '../../api';
import { fetchSales, getSalesByShop, printAndSendBill, fetchShops } from '../../api/apifile';
import { Table, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopFilter, setShopFilter] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const salesResponse = await fetchSales();
        setSales(salesResponse.data);
        setFilteredSales(salesResponse.data);
        
        const shopsResponse = await fetchShops();
        setShops(shopsResponse.data);
      } catch (err) {
        setError('Failed to load sales data');
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (shopFilter) {
      const filterSalesByShop = async () => {
        try {
          const response = await getSalesByShop(shopFilter);
          setFilteredSales(response.data);
        } catch (err) {
          setError('Failed to filter sales by shop');
        }
      };
      filterSalesByShop();
    } else {
      setFilteredSales(sales);
    }
  }, [shopFilter, sales]);

  const handlePrintAndSend = async (billNo) => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    try {
      await printAndSendBill(billNo, phoneNumber);
      setSuccess(`Bill ${billNo} sent to ${phoneNumber} successfully!`);
    } catch (err) {
      setError('Failed to send bill: ' + err.message);
    }
  };

  return (
    <div className="sales-list">
      <h2>Sales Records</h2>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="shopFilter">
            <Form.Label>Filter by Shop</Form.Label>
            <Form.Control
              as="select"
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
            >
              <option value="">All Shops</option>
              {shops.map(shop => (
                <option key={shop.shopId} value={shop.shopId}>{shop.shopName}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Date</th>
              <th>Shop</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.billNo}>
                <td>{sale.billNo}</td>
                <td>{new Date(sale.billDate).toLocaleDateString()}</td>
                <td>{sale.shop.shopName}</td>
                <td>{sale.totalAmount}</td>
                <td>{sale.paidAmount}</td>
                <td>{sale.currentBalance}</td>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    variant="info" 
                    size="sm"
                    onClick={() => handlePrintAndSend(sale.billNo)}
                  >
                    Send to WhatsApp
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SalesList;