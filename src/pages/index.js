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
  InputGroup,
  Pagination,
} from "react-bootstrap";

// import Image component
import Image from "next/image";

// styles
import styles from "@/styles/Home.module.css";

// import useDebounce hook


// views per page
const viewsPerPage = 10;

// function to get serial number based on page and index
const getSerialNumber = (page, index) => (page - 1) * viewsPerPage + index + 1;

// fetcher function
const fetcher = (...args) => fetch(...args).then((res) => res.json());

// fecther function for search
const searchFetcher = (...args) => fetch(...args).then((res) => res.json());

// function to handle product add, edit and delete
const handleProduct = async (url, { arg }) => {
  // get product data from arg
  const { product, method } = arg;

  // switch case to handle different request methods
  switch (method) {
    case "POST": {
      // post request to add product
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      return data;
    }
    case "PATCH": {
      // patch request to edit product
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      return data;
    }
    case "DELETE": {
      // delete request to delete product
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      return data;
    }
    default:
      return null;
  }
};

// function to handle search product
const handleSearchProduct = async (url, { arg }) => {
  // get product data from arg
  const { product } = arg;
  
  const res = await searchFetcher(`${url}?name=${product}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
};

export default function Home() {
  // set state for page
  const [page, setPage] = useState(1);

  // set state for search query
  const [searchQuery, setSearchQuery] = useState("");

  // error state
  const [error, setError] = useState(null);

  // add product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // edit product modal state
  const [showEditProductModal, setShowEditProductModal] = useState(false);

  // selected product state
  const [selectedProduct, setSelectedProduct] = useState({ name: "", price: "", stock: "" });

  // function to select product
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  // add product modal close handler
  const handleClose = () => setShowAddProductModal(false);

  // add product modal show handler
  const handleShow = () => setShowAddProductModal(true);

  // use swr hook to fetch data from api
  const { data, err, isLoading } = useSWR(
    `/api/products?page=${page}`,
    fetcher
  );

  // use swr mutation hook to mutate data
  const { trigger } = useSWRMutation("/api/products", handleProduct);

  // use swr mutation hook to mutate serach data
  const { trigger : searchTrigger } = useSWRMutation("/api/products/search", handleSearchProduct);

  // function to handle search
  const handleSearch = (e) => searchTrigger();

  // function to handle add product form submit
  const addNewProduct = (product) => trigger({ product, method: "POST" });

  // function to handle edit product form submit
  const editProduct = (product) => trigger({ product, method: "PATCH" });

  // function to create pagination items
  const createPaginationItems = () => {
    const items = [];
    if (data) {
      for (
        let number = 1;
        number <= Math.ceil(data.count / viewsPerPage);
        number++
      ) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === page}
            onClick={() => {
              console.log(number);
              setPage(number);
            }}
          >
            {number}
          </Pagination.Item>
        );
      }
    }
    return items;
  };

  // if data is loading
  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

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
          submitHandler={addNewProduct}
        />
        <EditProductModal
          show={showEditProductModal}
          onHide={() => setShowEditProductModal(false)}
          submitHandler={editProduct}
          product={selectedProduct}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
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
          <Table striped borderless hover variant="dark" className="mt-5">
            <thead>
              <tr>
                <th colSpan={1}>Sl No.</th>
                <th colSpan={5}>Name</th>
                <th colSpan={2}>Price (Rs.)</th>
                <th colSpan={1}>Stock</th>
                <th colSpan={1}></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product, index) => (
                <tr key={product._id}>
                  <td colSpan={1}>{getSerialNumber(page, index)}</td>
                  <td colSpan={5}>{product.name}</td>
                  <td colSpan={2}>{product.price}</td>
                  <td colSpan={1}>{product.stock}</td>
                  <td colSpan={1}>
                    <button className="btn">
                      <Image
                        src="/edit-icon.svg"
                        width={20}
                        height={20}
                        alt="edit"
                        style={{ fill: "green" }}
                        onClick={() => selectProduct(product)}
                      />
                    </button>
                    <button className="btn">
                      <Image
                        src="/delete-icon.svg"
                        width={20}
                        height={20}
                        alt="delete"
                        style={{ fill: "red" }}
                        onClick={() => trigger({ id: product._id, method: "DELETE" })}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className={styles.pagination}>
          <Pagination color="black">
            <Pagination.First onClick={() => setPage(1)} />
            <Pagination.Prev
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            />
            {createPaginationItems()}
            <Pagination.Next
              disabled={page === Math.ceil(data.count / viewsPerPage)}
              onClick={() => setPage(page + 1)}
            />
            <Pagination.Last
              onClick={() => setPage(Math.ceil(data.count / viewsPerPage))}
            />
          </Pagination>
        </div>
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
    if (
      productExpiryDate >= new Date().toISOString() &&
      productStock > 0 &&
      productPrice > 0 &&
      productName !== ""
    ) {
      e.stopPropagation();
      setValidated(false);
      const new_product = {
        name: productName,
        price: productPrice,
        stock: productStock,
        expiryDate: productExpiryDate,
      };
      submitHandler(new_product);
      clearFormData();
      onHide();
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
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          id="modalForm"
        >
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit" form="modalForm">
          Add Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// edit product modal
const EditProductModal = ({ show, onHide, product, submitHandler }) => {
  // Edit product data state
  const [productName, setProductName] = useState(product.name);
  const [productPrice, setProductPrice] = useState(product.price);
  const [productStock, setProductStock] = useState(product.stock);
  const [productExpiryDate, setProductExpiryDate] = useState(
    product.expiryDate
  );

  // form validation state
  const [validated, setValidated] = useState(false);

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // check if form is valid
    if (
      productExpiryDate >= new Date().toISOString() &&
      productStock > 0 &&
      productPrice > 0 &&
      productName !== ""
    ) {
      e.stopPropagation();
      setValidated(false);
      const updated_product = {
        name: productName,
        price: productPrice,
        stock: productStock,
        expiryDate: productExpiryDate,
      };
      submitHandler(updated_product);
      onHide();
    } else {
      setValidated(true);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          id="modalForm"
        >
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit" form="modalForm">
          Edit Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
