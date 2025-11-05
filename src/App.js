import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/shared/Navigation';
import SalesEntryForm from './components/sales/SalesEntryForm';
import SalesList from './components/sales/SalesList';
import ShopManagement from './components/shop/ShopManagement';
import ProductManagement from './components/product/ProductManagement';
import ProductForm from './components/product/ProductForm';

import Home from './components/pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ShopForm from './components/shop/ShopForm';

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sales-entry" element={<SalesEntryForm />} />
          <Route path="/sales-list" element={<SalesList />} />
          <Route path="/shops" element={<ShopManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/productform" element={<ProductForm/>}></Route>
          <Route path="/shopform" element={<ShopForm/>}></Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;