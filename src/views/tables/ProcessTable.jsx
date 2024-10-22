import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table, Button, Collapse, Modal, Form } from 'react-bootstrap';

const ProcessTable = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedSKU, setSelectedSKU] = useState();
  const [newProduct, setNewProduct] = useState({
    SKU_ID: '',
    Product_Name: '',
    Product_Drawing_No: '',
    activate_route: false,
    UoM: '',
    processes: []
  });
  const [newProcess, setNewProcess] = useState({
    process_name: '',
    production_type: '',
    raw_material: [{ id: '', quantity: '' }],
    sku: [{ id: '', quantity: '', stage: '' }],
    scrap_yield: '',
    qty_ok: 0,
    qty_rejected: 0,
    qty_moved_to_hold: 0
  });

  // Fetch products and raw materials from the server
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/raw-materials');
      setRawMaterials(response.data);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
    }
  };

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        processes: newProduct.processes.map((process) => ({
          process_name: process.process_name,
          production_type: process.production_type,
          raw_material:
            process.raw_material.filter((raw_material) => raw_material.id && raw_material.quantity).length > 0
              ? process.raw_material.map((raw_material) => ({
                  id: raw_material.id,
                  quantity: raw_material.quantity
                }))
              : undefined,
          sku:
            process.sku.filter((sku) => sku.id && sku.quantity).length > 0
              ? process.sku.map((sku) => ({
                  id: sku.id,
                  quantity: sku.quantity,
                  stage: sku.stage
                }))
              : undefined,
          scrap_yield: process.scrap_yield,
          qty_ok: process.qty_ok,
          qty_rejected: process.qty_rejected,
          qty_moved_to_hold: process.qty_moved_to_hold
        }))
      };
      newProduct.processes = productData.processes;
      newProduct.processes.shift();
      await axios.post('http://localhost:4000/api/products', newProduct);
      fetchProducts();
      setNewProduct({
        SKU_ID: '',
        Product_Name: '',
        Product_Drawing_No: '',
        activate_route: false,
        UoM: '',
        processes: []
      }); // Reset the form
      setIsAddingProduct(false); // Close the form after submission
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleChangeCheck = (e) => {
    const { name, checked } = e.target;
    setNewProduct({ ...newProduct, [name]: checked });
  };

  const handleProcessChange = (e) => {
    const { name, value } = e.target;
    setNewProcess({ ...newProcess, [name]: value });
  };

  // Handling SKU changes
  const handleSKUChange = (index, key, value) => {
    console.log(index, key, value);
    const updatedSkus = [...newProcess.sku];
    updatedSkus[index][key] = value;
    if (key === 'id') {
      setSelectedSKU(products.find((sku) => sku._id === value));
    }
    setNewProcess({ ...newProcess, sku: updatedSkus });
  };

  const handleAddProcess = () => {
    setNewProduct({
      ...newProduct,
      processes: [...newProduct.processes, newProcess]
    });

    setNewProcess({
      process_name: '',
      production_type: '',
      raw_material: [{ id: '', quantity: '' }],
      sku: [{ id: '', quantity: '', stage: '' }],
      scrap_yield: '',
      qty_ok: 0,
      qty_rejected: 0,
      qty_moved_to_hold: 0
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchRawMaterials();
  }, []);

  useEffect(() => {
    console.log(newProduct);
  }, [newProduct]);

  const [show, setShow] = useState(false);
  const [product, setProduct] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    console.log(product);

    setProduct(product);
    setShow(true);
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Button onClick={() => setIsAddingProduct(!isAddingProduct)}>Add Product</Button>
            </Card.Header>
            <Collapse in={isAddingProduct}>
              <div id="add-product-collapse">
                <Card.Body>
                  <Form onSubmit={handleProductSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>SKU ID</Form.Label>
                          <Form.Control
                            type="text"
                            name="SKU_ID"
                            placeholder="Enter SKU ID"
                            value={newProduct.SKU_ID}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="Product_Name"
                            placeholder="Enter Product Name"
                            value={newProduct.Product_Name}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Product Drawing No.</Form.Label>
                          <Form.Control
                            type="text"
                            name="Product_Drawing_No"
                            placeholder="Enter Product Drawing No."
                            value={newProduct.Product_Drawing_No}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>UOM</Form.Label>
                          <Form.Control type="text" name="UoM" placeholder="Enter UOM" value={newProduct.UoM} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Activate Route Card</Form.Label>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            name="activate_route"
                            value={newProduct.activate_route}
                            label="No / Yes"
                            onChange={handleChangeCheck}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr />
                    <h5>Add Process</h5>

                    {newProduct.processes.map((process, index) => (
                      <div key={index}>
                        <h6>Process {index}</h6>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Process Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="process_name"
                                placeholder="Enter Process Name"
                                value={index !== 0 ? process.process_name : newProcess.process_name}
                                onChange={handleProcessChange}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Production Type</Form.Label>
                              <Form.Control
                                type="text"
                                name="production_type"
                                placeholder="Enter Production Type"
                                value={index !== 0 ? process.production_type : newProcess.production_type}
                                onChange={handleProcessChange}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Scrap Yield</Form.Label>
                              <Form.Control
                                type="text"
                                name="scrap_yield"
                                placeholder="Enter Scrap Yield"
                                value={index !== 0 ? process.scrap_yield : newProcess.scrap_yield}
                                onChange={handleProcessChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            {/* Raw Materials Section */}
                            <Form.Label>Raw Materials</Form.Label>
                            {newProcess.raw_material.map((material, index) => (
                              <div key={index} className="mb-3">
                                <Form.Select
                                  onChange={(e) => {
                                    const updatedMaterials = [...newProcess.raw_material];
                                    updatedMaterials[index].id = e.target.value;
                                    setNewProcess({ ...newProcess, raw_material: updatedMaterials });
                                  }}
                                >
                                  <option value="">Select Raw Material</option>
                                  {rawMaterials.map((rm) => (
                                    <option key={rm._id} value={rm._id}>
                                      {rm.Item_Name}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control
                                  type="number"
                                  placeholder="Quantity"
                                  value={material.quantity}
                                  onChange={(e) => {
                                    const updatedMaterials = [...newProcess.raw_material];
                                    updatedMaterials[index].quantity = e.target.value;
                                    setNewProcess({ ...newProcess, raw_material: updatedMaterials });
                                  }}
                                />
                              </div>
                            ))}
                            <Button
                              onClick={() =>
                                setNewProcess({ ...newProcess, raw_material: [...newProcess.raw_material, { id: '', quantity: '' }] })
                              }
                            >
                              Add Raw Material
                            </Button>
                            <Col md={6}>
                              {/* SKUs Section */}
                              <Form.Label>SKUs</Form.Label>
                              {newProcess.sku.map((skuItem, index) => (
                                <div key={index} className="mb-3">
                                  <Form.Select onChange={(e) => handleSKUChange(index, 'id', e.target.value)}>
                                    <option value="">Select SKU</option>
                                    {products.map((sku) => (
                                      <option key={sku._id} value={sku._id}>
                                        {sku.Product_Name}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  {selectedSKU ? (
                                    <Form.Select onChange={(e) => handleSKUChange(index, 'stage', e.target.value)}>
                                      <option value="">Select Stage</option>
                                      {selectedSKU.processes.map((process) => (
                                        <option key={process._id} value={process._id}>
                                          {process.process_name}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  ) : null}
                                  <Form.Control
                                    type="number"
                                    placeholder="Quantity"
                                    value={skuItem.quantity}
                                    onChange={(e) => handleSKUChange(index, 'quantity', e.target.value)}
                                  />
                                </div>
                              ))}
                              <Button
                                onClick={() =>
                                  setNewProcess({
                                    ...newProcess,
                                    sku: [...newProcess.sku, { id: '', quantity: '', stage: '' }]
                                  })
                                }
                              >
                                Add SKU
                              </Button>
                            </Col>
                          </Col>
                        </Row>
                      </div>
                    ))}

                    <Button variant="primary" onClick={handleAddProcess}>
                      Add Process
                    </Button>

                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Products</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>SKU ID</th>
                    <th>Product Name</th>
                    <th>Product Drawing No.</th>
                    <th>UOM</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.SKU_ID}</td>
                      <td>{product.Product_Name}</td>
                      <td>{product.Product_Drawing_No}</td>
                      <td>{product.UoM}</td>
                      <td>
                        <Button variant="primary" onClick={() => handleShow(product)}>
                          More Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Modal show={show} onHide={handleClose}>
                {product && (
                  <>
                    <Modal.Header closeButton>
                      <Modal.Title>{product.SKU_ID}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div>
                        <h5>Product Details:</h5>
                        <ul>
                          <li>
                            <strong>Product Name:</strong> {product.Product_Name}
                            <br />
                            <strong>Drawing No.:</strong> {product.Product_Drawing_No}
                            <br />
                            <strong>Uom:</strong> {product.UoM}
                            <br />
                          </li>
                        </ul>
                        <h5>Processes:</h5>
                        <ul>
                          {product.processes.map((process, index) => (
                            <li key={index}>
                              <strong>Process Name:</strong> {process.process_name}
                              <br />
                              <strong>Production Type:</strong> {process.production_type}
                              <br />
                              <strong>Scrap Yield:</strong> {process.scrap_yield}
                              <br />
                              <strong>Quantity Ok:</strong> {process.qty_ok}
                              <br />
                              <strong>Qty Rejected:</strong> {process.qty_rejected}
                              <br />
                              <strong>Qty Hold:</strong> {process.qty_moved_to_hold}
                              <br />
                              {process.lot.length > 0 && (
                                <>
                                  <strong>Lot:</strong>
                                  <ul>
                                    {process.lot.map((lot, idx) => {
                                      return (
                                        <li key={idx}>
                                          Number: {lot.number}, OK: {lot.qty_ok}, Rejected: {lot.qty_rejected}, Hold:{lot.qty_moved_to_hold}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </>
                              )}
                              {process.raw_material.length > 0 && (
                                <>
                                  <strong>Raw Materials:</strong>
                                  <ul>
                                    {process.raw_material.map((material, idx) => {
                                      const rawMaterial = rawMaterials.find((rm) => rm._id === material.id);
                                      return (
                                        <li key={idx}>
                                          Name: {rawMaterial ? rawMaterial.Item_Name : 'Unknown'}, Quantity: {material.quantity}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </>
                              )}
                              {process.sku.length > 0 && (
                                <>
                                  <strong>SKU:</strong>
                                  <ul>
                                    {process.sku.map((skuItem, idx) => {
                                      const product = products.find((p) => p._id === skuItem.id);
                                      return (
                                        <li key={idx}>
                                          Name: {product ? product.Product_Name : 'Unknown'}, Quantity: {skuItem.quantity}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Modal.Body>
                  </>
                )}

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ProcessTable;
