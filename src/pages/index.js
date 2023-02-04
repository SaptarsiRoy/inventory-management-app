// This is the page that will be rendered at the root of your site.

// import useState hook
import { useState } from "react";

// import swr hook
import useSWR from "swr";

// import useSWRMutation hook
import useSWRMutation from "swr/mutation";

// import layout component
import Layout from "@/components/layout/Layout";

// import react bootstrap components
import {
  Container,
  Nav,
  Navbar,
  Form,
  Table,
  Button,
  Modal,
  InputGroup
} from "react-bootstrap";

// import Image component
import Image from "next/image";

// styles
import styles from "@/styles/Home.module.css";

// fetcher function
const fetcher = (...args) => fetch(...args).then((res) => res.json());

// function to handle product add, edit and delete
const handleProduct = async (product) => {
};

export default function Home() {
  // error state
  const [error, setError] = useState(null);

  // add product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // add product modal close handler
  const handleClose = () => setShowAddProductModal(false);

  // add product modal show handler
  const handleShow = () => setShowAddProductModal(true);

  // use swr hook to fetch data from api
  const { data, err } = useSWR("/api/products", fetcher);

  // use swr mutation hook to mutate data
  const { trigger } = useSWRMutation("/api/products", fetcher);

  // if data is loading
  if (!data)
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );

  // if error occurs
  if (err) {
    setError(err);
  }

  return (
    <>
      <Layout>
        <AddProductModal
          show={showAddProductModal}
          onHide={handleClose}
          submitHandler={handleClose}
        />
        <Navbar bg="dark" expand="lg" variant="dark" className={styles.navbar}>
          <Container>
            <Navbar.Brand href="#home" className={styles["navbar-brand"]}>
              ABC Stores
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link>Home</Nav.Link>
                <Nav.Link>Product</Nav.Link>
              </Nav>
              <Form className={styles.form}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  width={100}
                />
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className={styles["add-product-btn"]}>
          <Button onClick={handleShow}> Add Product </Button>
        </div>
        {error ? (
          <div>{error.message}</div>
        ) : (
          <Table striped borderless hover variant="light" className="mt-5">
            <thead>
              <tr>
                <th colSpan={1}>Sl No.</th>
                <th colSpan={5}>Name</th>
                <th colSpan={1}>Exp. Date</th>
                <th colSpan={2}>Price (Rs.)</th>
                <th colSpan={1}>Stock</th>
                <th colSpan={1}></th>
              </tr>
            </thead>
            <tbody>
              {data.map((product, index) => (
                <tr key={product._id}>
                  <td colSpan={1}>{index + 1}</td>
                  <td colSpan={5}>{product.name}</td>
                  <td colSpan={1}>
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </td>
                  <td colSpan={2}>{product.price}</td>
                  <td colSpan={1}>{product.stock}</td>
                  <td colSpan={1}>
                    <button className="btn">
                      {" "}
                      <Image
                        src="/edit-icon.svg"
                        width={20}
                        height={20}
                        alt="edit"
                        style={{ fill: "green" }}
                      />{" "}
                    </button>
                    <button className="btn">
                      {" "}
                      <Image
                        src="/delete-icon.svg"
                        width={20}
                        height={20}
                        alt="delete"
                        style={{ fill: "red" }}
                      />{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Layout>
    </>
  );
}

// add product modal
const AddProductModal = ({ show, onHide, submitHandler }) => {
  // Add product data state
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productExpiryDate, setProductExpiryDate] = useState("");

  // form validation state
  const [validated, setValidated] = useState(false);

  // function to clear form data
  const clearFormData = () => {
    setProductName("");
    setProductPrice("");
    setProductStock("");
    setProductExpiryDate(new Date().toISOString().slice(0, 10));
  };

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // check if form is valid
    if (productExpiryDate >= new Date().toISOString() && productStock > 0 && productPrice > 0 && productName !== "") {
      e.stopPropagation();
      setValidated(false);
      const new_product = {
        name: productName,
        price: productPrice,
        stock: productStock,
        expiryDate: productExpiryDate,
      }
      console.log(productName, productPrice, productStock, productExpiryDate);
      submitHandler();
      clearFormData();
    } else {
      setValidated(true);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add a New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit} id="modalForm"  >
          <Form.Group className="mb-3" controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter product name"
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a product name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductPrice">
            <Form.Label>Product Price</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Enter product price"
              onChange={(e) => setProductPrice(e.target.valueAsNumber)}
              value={productPrice}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a product price.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductStock">
            <Form.Label>Product Stock</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="number"
                placeholder="Enter product stock"
                onChange={(e) => setProductStock(e.target.valueAsNumber)}
                value={productStock}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a product stock.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductExpiryDate">
            <Form.Label>Product Expiry Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter product expiry date"
              defaultValue={productExpiryDate}
              onChange={(e) => setProductExpiryDate(new Date(e.target.valueAsDate).toISOString())}
              value={productExpiryDate.slice(0, 10)}
              min={new Date().toISOString().slice(0, 10)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a product expiry date in the future.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit" form="modalForm" >
          Add Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
