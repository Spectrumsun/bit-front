import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import './index.css';

const baseURL = 'https://bit-60by.onrender.com/api/v1'

const NavBar = () => (
  <Navbar bg="dark" data-bs-theme="dark">
    <Container>
      <Navbar.Brand href="#home">Election Data</Navbar.Brand>
        <Nav className="me-auto">
      </Nav>
    </Container>
  </Navbar>
)

function LoadingUI() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

const App = () => {
  const [data, setData] = useState([]);
  const [wards, setWards] = useState([]);
  const [lgData, setLgData] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [createPg, setCreatPg] = useState({
    polling_unit_name: '',
    polling_unit_description: '',
    polling_unit_number: '',
    lat: '',
    long: '',
    ward_id: '',
    lga_id: '',
    entered_by_user: '',
  })  

  const fetchData = async() => {
    try {
      const response = await fetch(`${baseURL}/lga-results`);
      const data = await response.json();
      setData(data)
      setIsLoadingState(false);
    } catch (error) {
      console.log(error)
    }
  }

  const fetchWard = async() => {
    try {
      const response = await fetch(`${baseURL}/wards`);
      const data = await response.json();
      setWards(data.data)
      setIsLoadingState(false);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchLg = async() => {
    try {
      const response = await fetch(`${baseURL}/lga`);
      const data = await response.json();
      setLgData(data.data)
      setIsLoadingState(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchWard();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useState(() => {
    fetchLg()
  },[])

  const handleInput = (e) => {
    setCreatPg({
      ...createPg,
      [e.target.name]: e.target.value
    })
  };


  const handleSelect = (name, e) => {
    setCreatPg({ ...createPg, [name]: e.target.value })
  }

  const handleSubmit = async() => {
    const rawResponse = await fetch(`${baseURL}/new-unit`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createPg)
    });
    await rawResponse.json();
  };

  return (
    <div className="container">
      <NavBar />
      <br />
      <br />
      <DropdownButton id="dropdown-basic-button" title="Delta" size="lg" />
      <br />
      <br />
      {
        isLoadingState 
          ? <LoadingUI />
          : (
              <Tabs
                defaultActiveKey="Local Government"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Local Government" title="Local Government">
                <Accordion defaultActiveKey="0">
                {
                  data?.result?.map((result, index) => {
                    return (
                      <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>{result.name}</Accordion.Header>
                        <Accordion.Body>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Polling unit Name</th>
                              <th>Description</th>
                              <th>User</th>
                              <th>Unit number</th>
                              <th>Sum</th>
                            </tr>
                          </thead>
                          <tbody>
                          {
                            result.polling_units?.map((polling_unit, index) => {
                              return (
                                <tr key={index}>
                                  <td>{polling_unit.polling_unit_name}</td>
                                  <td>{polling_unit.polling_unit_description}</td>
                                  <td>{polling_unit.entered_by_user}</td>
                                  <td>{polling_unit.polling_unit_number}</td>
                                  <td>{polling_unit.sum}</td>
                                </tr>
                              )
                            })
                          }
                          </tbody>
                        </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })
                }
              </Accordion>
              <ListGroup>
              </ListGroup>
            </Tab>

            <Tab eventKey="Summed total Result" title="Summed total result">
                <Accordion defaultActiveKey="0">
                {
                  data?.result?.map((result, index) => {
                    return (
                      <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>{result.name}</Accordion.Header>
                        <Accordion.Body>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Total Polling unit</th>
                              <th>Total Sum</th>
                            </tr>
                          </thead>
                          <tbody>
                          <tr key={index}>
                            <td>{result.polling_units?.length}</td>
                            <td>{result.polling_units?.reduce((arr, curr) => arr + +curr.sum, 0)}</td>
                          </tr>
                          </tbody>
                        </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })
                }
              </Accordion>
              <ListGroup>
              </ListGroup>
            </Tab>
            <Tab eventKey="Add new Polling Unit" title="Add new Polling Unit">
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Polling unit name</Form.Label>
                <Form.Control type="text" onChange={handleInput} name="polling_unit_name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Entered by user</Form.Label>
                <Form.Control type="text" onChange={handleInput} name="entered_by_user" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Polling unit description</Form.Label>
                <Form.Control type="text" onChange={handleInput} name="polling_unit_description" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Polling unit number</Form.Label>
                <Form.Control type="text" onChange={handleInput} name="polling_unit_number" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Latitude</Form.Label>
                <Form.Control type="text" onChange={handleInput} name="lat" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Longitude</Form.Label>
                <Form.Control type="text"  onChange={handleInput} name="long" />
              </Form.Group>
              <Form.Select aria-label="lga_id" onChange={(e) => handleSelect('lga_id', e)}>
                <option>Select Local government</option>
                {
                  lgData?.map((lgDat, index) => <option key={index} value={lgDat.uniqueid}>{lgDat.lga_name}</option>)
                }
              </Form.Select>
              <br/>
              <Form.Select aria-label="Ward" onChange={(e) => handleSelect('ward_id', e)}>
              <option>Select Ward</option>
                {
                  wards?.map((ward, index) => <option key={index} value={ward.uniqueid}>{ward.ward_name}</option>)
                }
              </Form.Select>
            <br/>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            </Form>
            </Tab>
          </Tabs>
        )
      }
    </div>
  )
};

export default App;





