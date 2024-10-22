import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';

const RecdFromOutsourceForm = () => {
  const [formData, setFormData] = useState({
    mrr: '',
    vendor_name: '',
    items_detail: []
  });

  const [challans, setChallans] = useState([]);
  const [outsourceData, setOutsourceData] = useState([]);
  const [vendors, setVendors] = useState([]);
  //   const [venhallans, setVendorChallans] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Fetch existing entries (GET call)
    axios.get('http://localhost:4000/api/recd_from_outsource').then((response) => {
      setEntries(response.data);
    });

    // Fetch vendors (if you have a vendor endpoint)
    axios
      .get('http://localhost:4000/api/outsource')
      .then((response) => {
        const uniqueVendors = Array.from(new Set(response.data.map((item) => item.vendor_name)));
        setOutsourceData(response.data);
        setVendors(uniqueVendors);
        console.log(uniqueVendors);
      })
      .catch((error) => {
        console.error('Error fetching vendors:', error);
      });
  }, []);

  const handleVendorChange = async (e) => {
    const vendorName = e.target.value;
    setFormData({ ...formData, vendor_name: vendorName });
    const filteredChallans = outsourceData.filter((data) => {
      return data.vendor_name === vendorName;
    });

    setChallans(filteredChallans);
    console.log(filteredChallans);
  };

  const handleAddChallan = () => {
    setFormData({
      ...formData,
      items_detail: [...formData.items_detail, { challan_no: '', items: '', work_done: [], unprocessed: 0 }]
    });
  };

  const handleWorkDoneChange = (index, workIndex, field, value) => {
    const updatedItemsDetail = [...formData.items_detail];
    updatedItemsDetail[index].work_done[workIndex] = {
      ...updatedItemsDetail[index].work_done[workIndex],
      [field]: value
    };
    setFormData({ ...formData, items_detail: updatedItemsDetail });
  };

  const handleChallanChange = (index, field, value) => {
    const updatedItemsDetail = [...formData.items_detail];
    updatedItemsDetail[index][field] = value;
    setFormData({ ...formData, items_detail: updatedItemsDetail });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/recd_from_outsource', formData);
      alert('Entry submitted successfully');
      setFormData({
        mrr: '',
        vendor_name: '',
        items_detail: []
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Add Recd From Outsource Entry</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="mrr">
                <Form.Label>MRR</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.mrr}
                  onChange={(e) => setFormData({ ...formData, mrr: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="vendor_name">
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control as="select" value={formData.vendor_name} onChange={handleVendorChange} required>
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor, index) => (
                    <option key={index} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {formData.items_detail.map((itemDetail, index) => (
                <div key={index} className="border p-2 my-2">
                  <Form.Group controlId={`challan_no_${index}`}>
                    <Form.Label>Challan No</Form.Label>
                    <Form.Control
                      as="select"
                      value={itemDetail.challan_no}
                      onChange={(e) => handleChallanChange(index, 'challan_no', e.target.value)}
                      required
                    >
                      {challans.map((challan, index) => (
                        <option key={index} value={challan.challan_no}>
                          {challan.challan_no}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {itemDetail.work_done.map((work, workIndex) => (
                    <div key={workIndex} className="border p-1 my-1">
                      <Form.Group controlId={`process_${index}_${workIndex}`}>
                        <Form.Label>Process</Form.Label>
                        <Form.Control
                          type="text"
                          value={work.process}
                          onChange={(e) => handleWorkDoneChange(index, workIndex, 'process', e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId={`item_processed_${index}_${workIndex}`}>
                        <Form.Label>Items Processed</Form.Label>
                        <Form.Control
                          type="number"
                          value={work.item_processed}
                          onChange={(e) => handleWorkDoneChange(index, workIndex, 'item_processed', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </div>
                  ))}

                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={() => handleWorkDoneChange(index, itemDetail.work_done.length, 'unprocessed', 0)}
                  >
                    Add Work Done
                  </Button>
                </div>
              ))}

              <Button variant="secondary" className="mt-3" onClick={handleAddChallan}>
                Add Challan
              </Button>

              <Button type="submit" variant="primary" className="mt-3">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Outsource Entries</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>MRR</th>
                  <th>Vendor Name</th>
                  <th>Challan No</th>
                  <th>Items</th>
                  <th>Work Done</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.mrr}</td>
                    <td>{entry.vendor_name}</td>
                    {entry.items_detail.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <td>{item.challan_no}</td>
                        <td>{item.items}</td>
                        <td>
                          {item.work_done.map((work, idx) => (
                            <div key={idx}>
                              {work.process}: {work.item_processed}
                            </div>
                          ))}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RecdFromOutsourceForm;
