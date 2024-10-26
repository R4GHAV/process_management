import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const ProductionFillingForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    item: '', // SKU
    lot: {
      number: 0,
      qty_ok: '',
      qty_rejected: '',
      qty_moved_to_hold: '',
      scrap_yield: ''
    },
    lotNumber: 0,
    processing_stage: '',
    issue_material: '',
    qty_ok: '',
    qty_rejected: '',
    qty_moved_to_hold: '',
    scrap_yield: ''
  });

  const [products, setProducts] = useState([]);
  const [activeRoute, setActiveRoute] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [previousProcesses, setPreviousProcesses] = useState([]);

  useEffect(() => {
    axios
      .get('https://project-management-backend-u9mm.onrender.com/api/products') // Adjust endpoint as necessary
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Update processes when SKU (item) changes
  useEffect(() => {
    if (formData.item) {
      const selectedProduct = products.find((product) => product.SKU_ID === formData.item);
      if (selectedProduct) {
        setProcesses(selectedProduct.processes);
        setPreviousProcesses(selectedProduct.processes); // Assuming all processes can be used for issue material
      }
    }
  }, [formData.item, products]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'item') {
      const selectedProduct = products.filter((product) => {
        return product.SKU_ID === value;
      });
      if (selectedProduct[0].activate_route) {
        setActiveRoute(true);
      } else {
        setActiveRoute(false);
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.lotNumber !== 0) {
      formData.lot.number = parseInt(formData.lotNumber);
      formData.lot.qty_ok = formData.qty_ok;
      formData.lot.qty_rejected = formData.qty_rejected;
      formData.lot.qty_moved_to_hold = formData.qty_moved_to_hold;
      formData.lot.scrap_yield = formData.scrap_yield;
      formData.qty_ok = 0;
      formData.qty_rejected = 0;
      formData.qty_moved_to_hold = 0;
      formData.scrap_yield = 0;
    }
    axios
      .post('https://project-management-backend-u9mm.onrender.com/api/production', formData) // Adjust endpoint as necessary
      .then((response) => {
        console.log('Production entry submitted', response.data);
        // Optionally clear the form or show success message
      })
      .catch((error) => {
        console.error('Error submitting production entry', error);
      });
  };

  return (
    <Row>
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Production Filling Form</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* Date Field */}
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </Form.Group>

              {/* SKU (Item) Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Item (SKU)</Form.Label>
                <Form.Select name="item" value={formData.item} onChange={handleInputChange} required>
                  <option value="">Select SKU</option>
                  {products.map((product) => (
                    <option key={product.SKU_ID} value={product.SKU_ID}>
                      {product.Product_Name} ({product.SKU_ID})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {activeRoute ? (
                <Form.Group className="mb-3">
                  <Form.Label>Lot No.</Form.Label>
                  <Form.Control
                    type="number"
                    name="lotNumber"
                    placeholder="Enter Lot"
                    value={formData.lotNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              ) : null}

              {/* Processing Stage Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Processing Stage</Form.Label>
                <Form.Select name="processing_stage" value={formData.processing_stage} onChange={handleInputChange} required>
                  <option value="">Select Process</option>
                  {processes.map((process) => (
                    <option key={process._id} value={process._id}>
                      {process.process_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Issue Material from Previous Stage */}
              {formData.processing_stage !== processes[0]?._id && (
                <Form.Group className="mb-3">
                  <Form.Label>Issue Material (Previous Stage)</Form.Label>
                  <Form.Select name="issue_material" value={formData.issue_material} onChange={handleInputChange} required>
                    <option value="">Select Previous Process</option>
                    {previousProcesses.map((process) => (
                      <option key={process._id} value={process._id}>
                        {process.process_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              {/* Quantity OK */}
              <Form.Group className="mb-3">
                <Form.Label>Quantity OK</Form.Label>
                <Form.Control type="number" name="qty_ok" value={formData.qty_ok} onChange={handleInputChange} required />
              </Form.Group>

              {/* Quantity Rejected */}
              <Form.Group className="mb-3">
                <Form.Label>Quantity Rejected</Form.Label>
                <Form.Control type="number" name="qty_rejected" value={formData.qty_rejected} onChange={handleInputChange} />
              </Form.Group>

              {/* Quantity Moved to Hold */}
              <Form.Group className="mb-3">
                <Form.Label>Quantity Moved to Hold</Form.Label>
                <Form.Control type="number" name="qty_moved_to_hold" value={formData.qty_moved_to_hold} onChange={handleInputChange} />
              </Form.Group>

              {/* Scrap Yield */}
              <Form.Group className="mb-3">
                <Form.Label>Scrap Yield</Form.Label>
                <Form.Control type="text" name="scrap_yield" value={formData.scrap_yield} onChange={handleInputChange} />
              </Form.Group>

              {/* Submit Button */}
              <Button variant="primary" type="submit">
                Submit Production Entry
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductionFillingForm;
