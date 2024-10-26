import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Collapse, Form } from 'react-bootstrap';
import axios from 'axios';

const BootstrapTable = () => {
  const [isBasic, setIsBasic] = useState(false);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    Item_ID: '',
    Item_Name: '',
    Item_Group: '',
    quantity: '',
    UoM: ''
  });

  const fetchRawMaterials = async () => {
    try {
      const response = await axios.get('https://project-management-backend-u9mm.onrender.com/api/raw-materials');
      setRawMaterials(response.data);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://project-management-backend-u9mm.onrender.com/api/raw-material', newMaterial);
      fetchRawMaterials();
      setNewMaterial({ Item_ID: '', Item_Name: '', Item_Group: '', quantity: '', UoM: '' });
      setIsBasic(false);
    } catch (error) {
      console.error('Error adding raw material:', error);
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Button onClick={() => setIsBasic(!isBasic)}>Add Raw Material</Button>
            </Card.Header>
            <Collapse in={isBasic}>
              <div id="basic-collapse">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Item ID</Form.Label>
                          <Form.Control
                            type="text"
                            name="Item_ID"
                            placeholder="Enter Id"
                            value={newMaterial.Item_ID}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Item Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="Item_Name"
                            placeholder="Enter Name"
                            value={newMaterial.Item_Name}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Item Group</Form.Label>
                          <Form.Control
                            type="text"
                            name="Item_Group"
                            placeholder="Enter a Group name"
                            value={newMaterial.Item_Group}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                          Submit
                        </Button>
                      </Form>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          placeholder="Enter Quantity"
                          value={newMaterial.quantity}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>UOM</Form.Label>
                        <Form.Control type="text" name="UoM" placeholder="Eg. Kg" value={newMaterial.UoM} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Raw Materials</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Quantity</th>
                    <th>UOM</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterials.map((material, index) => (
                    <tr key={index}>
                      <td>{material.Item_ID}</td>
                      <td>{material.Item_Name}</td>
                      <td>{material.Item_Group}</td>
                      <td>{material.quantity}</td>
                      <td>{material.UoM}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;
