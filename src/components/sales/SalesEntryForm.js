import React, { useEffect, useState } from "react";

import { fetchShops, fetchProducts, createSale } from "../../api/apifile";
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { data } from "autoprefixer";

// import Pagination from 'react-bootstrap/Pagination';



const SalesEntryForm =() =>{
    const  [formData, setFormData] = useState({
        billNo: '',
        billDate: new Date(),
        shopId: '',
        productId: '',
        rate: 0,
        quantity: 1,
        amount: 0,
        paymentGiven: 0,
        prevBalance: 0,
        currentBalance: 0
    });

    const [shops, setShops] = useState([]);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() =>{
        const loadData = async () =>{
            try {
                const shopsResponse = await fetchShops();
                setShops(shopsResponse.data);

                const productsResponse  = await fetchProducts();
                setProducts(productsResponse.data);
                
            } catch (error) {

                setError('Failed to load initial data'); 
            }
        };
        loadData();
    }, []);

    useEffect(() =>{
        if (formData.quantity && formData.rate) {
            const amount = formData.quantity * formData.rate;
            setFormData(Prev =>({
                ...Prev,

                amount : amount
            }));
            
        }
    }, [formData.quantity, formData.rate]);


    useEffect(() =>{
        if(formData.prevBalance && formData.amount && formData.paymentGiven){
            const currentBalance = parseFloat(formData.prevBalance) + parseFloat(formData.amount) -parseFloat(formData.paymentGiven);
            setFormData(Prev =>({
                ...Prev, currentBalance : currentBalance
            }));
        }
    }, [formData.prevBalance, formData.amount, formData.paymentGiven]);

    const handleShopChange = async (e) => {
        const shopId = e.target.value;
        const selectedShop = shops.find(shop => shop.shopId == shopId);
        
        setFormData(prev => ({
          ...prev,
          shopId: shopId,
          prevBalance: selectedShop ? selectedShop.balanceAmount : 0
        }));
      };

      const handleProductChange = (e) => {
        const productId = e.target.value;
        const selectedProduct = products.find(product => product.productId == productId);
        
        setFormData(prev => ({
          ...prev,
          productId: productId,
          rate: selectedProduct ? selectedProduct.rate : 0
        }));
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const handleDateChange = (date) => {
        setFormData(prev => ({
          ...prev,
          billDate: date
        }));
      };

      const handleAddToCart = () => {
        if (!formData.productId || !formData.quantity) {
          setError('Please select a product and quantity');
          return;
        }

        const selectedProduct = products.find(p => p.productId == formData.productId);
    const newItem = {
      productId: formData.productId,
      productName: selectedProduct.productName,
      rate: formData.rate,
      quantity: formData.quantity,
      amount: formData.amount
    };

    
    setCartItems([...cartItems, newItem]);
    setTotalAmount(totalAmount + newItem.amount);

     // Reset product fields
     setFormData(prev => ({
        ...prev,
        productId: '',
        rate: 0,
        quantity: 1,
        amount: 0
      }));
    };

    const handleRemoveItem = (index) => {
        const updatedCart = [...cartItems];
        const removedItem = updatedCart.splice(index, 1)[0];
        setCartItems(updatedCart);
        setTotalAmount(totalAmount - removedItem.amount);
      };

      const handleSubmit = async () => {
        if (!formData.billNo || !formData.shopId || cartItems.length === 0) {
          setError('Please fill all required fields and add at least one product');
          return;
        }
        

        const saleData = {
            billNo: formData.billNo,
            billDate: formData.billDate,
            shopId: formData.shopId,
            totalAmount: totalAmount,
            paidAmount: formData.paymentGiven,
            prevBalance: formData.prevBalance,
            currentBalance: formData.currentBalance,
            salesDetails: cartItems.map(item => ({
              productId: item.productId,
              rate: item.rate,
              quantity: item.quantity,
              amount: item.amount
            }))
          };


          try {
            await createSale(saleData);
            setSuccess('Sale recorded successfully!');
            // Reset form
            setFormData({
              billNo: '',
              billDate: new Date(),
              shopId: '',
              productId: '',
              rate: 0,
              quantity: 1,
              amount: 0,
              paymentGiven: 0,
              prevBalance: 0,
              currentBalance: 0
            });
            setCartItems([]);
            setTotalAmount(0);
          } catch (err) {
            setError('Failed to save sale: ' + err.message);
          }
        };

        

  return (
    <div className="sales-entry-form">
      <h2>Sales Entry</h2>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="billNo">
              <Form.Label>Bill No</Form.Label>
              <Form.Control
                type="text"
                name="billNo"
                value={formData.billNo}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="billDate">
              <Form.Label>Bill Date</Form.Label>
              <DatePicker
                selected={formData.billDate}
                onChange={handleDateChange}
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="shopId">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                as="select"
                name="shopId"
                value={formData.shopId}
                onChange={handleShopChange}
                required
              >
                <option value="">Select Shop</option>
                {shops.map(shop => (
                  <option key={shop.shopId} value={shop.shopId}>{shop.shopName}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="prevBalance">
              <Form.Label>Previous Balance</Form.Label>
              <Form.Control
                type="number"
                name="prevBalance"
                value={formData.prevBalance}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="productId">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                as="select"
                name="productId"
                value={formData.productId}
                onChange={handleProductChange}
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="rate">
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="number"
                name="rate"
                value={formData.rate}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button variant="primary" onClick={handleAddToCart}>
              Add
            </Button>
          </Col>
        </Row>

        <div className="mt-3">
          <h5>Cart Items</h5>
          {cartItems.length === 0 ? (
            <p>No items added</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.rate}</td>
                      <td>{item.quantity}</td>
                      <td>{item.amount}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                    <td><strong>{totalAmount}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <Row>
          <Col md={4}>
            <Form.Group controlId="paymentGiven">
              <Form.Label>Payment Given</Form.Label>
              <Form.Control
                type="number"
                name="paymentGiven"
                value={formData.paymentGiven}
                onChange={handleInputChange}
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="currentBalance">
              <Form.Label>Current Balance</Form.Label>
              <Form.Control
                type="number"
                name="currentBalance"
                value={formData.currentBalance}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button variant="success" onClick={handleSubmit} className="mr-2">
              Save
            </Button>
            <Button variant="info" onClick={() => window.print()}>
              Print
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SalesEntryForm;
      
  