import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table, Form, Button } from 'react-bootstrap';

const OutsourceForm = () => {
  const [outsourceData, setOutsourceData] = useState({
    challan_no: '',
    date: '',
    item: '',
    lotNumber: 0,
    processing_stage: '',
    issue_material: [],
    qty_sent: '',
    vendor_name: ''
  });
  const [activeRoute, setActiveRoute] = useState(false);
  const [outsourceEntries, setOutsourceEntries] = useState([]);
  const [items, setItems] = useState([]); // To hold items (SKUs)
  const [processes, setProcesses] = useState([]); // To hold processes for selected SKU
  const [isFirstProcess, setIsFirstProcess] = useState(false); // Check if the selected process is the first

  useEffect(() => {
    // Fetch items (SKUs) on component mount
    axios.get('http://localhost:4000/api/products').then((response) => {
      setItems(response.data);
    });
  }, []);

  const handleItemChange = (e) => {
    const itemId = e.target.value;
    const selectedItem = items.find((val) => {
      return val._id === e.target.value;
    });
    if (selectedItem.activate_route) {
      setActiveRoute(true);
    } else {
      setActiveRoute(false);
    }
    setOutsourceData({ ...outsourceData, item: itemId });
    setProcesses(selectedItem.processes);
  };

  const handleProcessingStageChange = (e) => {
    const selectedProcessId = e.target.value;
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setOutsourceData({ ...outsourceData, processing_stage: selectedOptions });

    const processIndex = processes.findIndex((process) => process._id === selectedProcessId);
    if (processIndex === 0) {
      setIsFirstProcess(true); // First process, no previous step needed
    } else {
      setIsFirstProcess(false); // Not the first process, previous step required
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/outsource')
      .then((response) => {
        setOutsourceEntries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching outsource entries:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    outsourceData.issue_material = outsourceData.issue_material.length === 0 ? undefined : outsourceData.issue_material;
    axios
      .post('http://localhost:4000/api/outsource', outsourceData)
      .then((response) => {
        console.log(response);
        alert('Outsource entry created successfully');
      })
      .catch((error) => {
        console.error('Error creating outsource entry:', error);
      });
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title>Add Outsource Entry</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formChallanNo">
                <Form.Label>Challan No</Form.Label>
                <Form.Control
                  type="number"
                  value={outsourceData.challan_no}
                  onChange={(e) => setOutsourceData({ ...outsourceData, challan_no: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={outsourceData.date}
                  onChange={(e) => setOutsourceData({ ...outsourceData, date: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formItem">
                <Form.Label>Item (SKU)</Form.Label>
                <Form.Control as="select" value={outsourceData.item} onChange={handleItemChange} required>
                  <option value="">Select SKU</option>
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.Product_Name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {activeRoute ? (
                <Form.Group controlId="formLotNumber">
                  <Form.Label>Lot No.</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Lot"
                    value={outsourceData.lotNumber}
                    onChange={(e) => setOutsourceData({ ...outsourceData, lotNumber: e.target.value })}
                  />
                </Form.Group>
              ) : null}
              <Form.Group controlId="formProcessingStage">
                <Form.Label>Processing Stage</Form.Label>
                <Form.Control as="select" multiple value={outsourceData.processing_stage} onChange={handleProcessingStageChange} required>
                  <option value="">Select Processing Stage</option>
                  {processes.map((process) => (
                    <option key={process._id} value={process._id}>
                      {process.process_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Conditionally render Issue Material based on whether it's the first process */}
              {!isFirstProcess && (
                <Form.Group controlId="formIssueMaterial">
                  <Form.Label>Issue Material (Previous Step)</Form.Label>
                  <Form.Control
                    as="select"
                    value={outsourceData.issue_material}
                    onChange={(e) => setOutsourceData({ ...outsourceData, issue_material: e.target.value }, console.log(e.target.value))}
                  >
                    <option value="">Select Previous Step</option>
                    {processes.map((process) => (
                      <option key={process._id} value={process._id}>
                        {process.process_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}

              <Form.Group controlId="formQtySent">
                <Form.Label>Quantity Sent</Form.Label>
                <Form.Control
                  type="number"
                  value={outsourceData.qty_sent}
                  onChange={(e) => setOutsourceData({ ...outsourceData, qty_sent: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formVendorName">
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  type="text"
                  value={outsourceData.vendor_name}
                  onChange={(e) => setOutsourceData({ ...outsourceData, vendor_name: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" className="mt-2" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title>Outsource Entries</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Challan No</th>
                  <th>Date</th>
                  <th>Item (SKU)</th>
                  <th>Processing Stage</th>
                  <th>Issue Material (Previous Stage)</th>
                  <th>Quantity Sent</th>
                  <th>Vendor Name</th>
                </tr>
              </thead>
              <tbody>
                {outsourceEntries.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No outsource entries found
                    </td>
                  </tr>
                ) : (
                  outsourceEntries.map((entry) => (
                    <tr key={entry._id}>
                      <td>{entry.challan_no}</td>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.item?.Product_Name || 'N/A'}</td>
                      <td>{entry.processing_stage?.process_name || 'N/A'}</td>
                      <td>{entry.issue_material?.process_name || 'N/A'}</td>
                      <td>{entry.qty_sent}</td>
                      <td>{entry.vendor_name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OutsourceForm;
