import "./App.css";
import React, { Component, useMemo, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Table from "./components/Table";
import TimePicker from "react-bootstrap-time-picker";
import Axios from "axios";
import {
  TrashcanIcon,
  PencilIcon,
  DiffAddedIcon,
} from "@primer/octicons-react";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectOptions: [],
      loading: true,
      showEmployeeModal: false,
      id: "",
      fName: "",
      lName: "",
      idClock: "",
      clockingDate: "",
      startTime: "",
      endTime: "",
      
    };
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
  }

  async getUsersData() {
    const res = await Axios.get("http://localhost:8080/api/getEmployees");
    console.log(res.data);
    this.setState({ loading: false, users: res.data });
  }
  componentDidMount() {
    Axios.get(`http://localhost:8080/api/getEmployees`).then((res) => {
      const users = res.data;
      this.setState({ users });

      const data = res.data;
      const options = data.map((d) => ({
        value: d.emp_id,
        label: d.emp_id,
      }));
      this.setState({ selectOptions: options });
    });

    // this.getOptions();
  }

  async getOptions() {
    const res = await Axios.get("http://localhost:8080/api/getEmployees");
    const data = res.data;

    const options = data.map((d) => ({
      value: d.emp_id,
      label: d.emp_id,
    }));
    this.setState({ selectOptions: options });
  }

  // handleEdit() {}
  showModal = () => {
    this.setState({ showEmployeeModal: true });
  };

  closeModal = () => {
    this.setState({ showEmployeeModal: false });
  };

  handleEnterEmployee = (event) => {
    // event.preventDefault();

    Axios.post(`http://localhost:8080/api/setEmployees`, {
      fName: this.state.fName,
      lName: this.state.lName,
    }).then((res) => {
      console.log(res);
      console.log(res.data);
    });

    event.preventDefault();
    Axios.get(`http://localhost:8080/api/getEmployees`).then((res) => {
      const users = res.data;
      this.setState({ users });

      const data = res.data;
      const options = data.map((d) => ({
        value: d.emp_id,
        label: d.emp_id,
      }));
      this.setState({ selectOptions: options });
    });

    this.setState({ showEmployeeModal: false });
  };

  handleEmployeeChange = (event) => {
    this.setState({ fName: event.target.value, lName: event.target.value });
  };

  handleEmployeeClockingChange = (event) => {
    this.stateState({
      idClock: event.target.value,
      // clockingDate: event.target.value,
      // startTime: event.target.value,
      // endTime: event.target.value,
    });
  };

  handleStartTimeChange(startTime) {
    this.setState({ startTime });
  }


  render() {
    const userColumns = [
      {
        Header: "ID",
        accessor: "emp_id",
      },
      {
        Header: "First Name",
        accessor: "emp_fname",
      },
      {
        Header: "Last Name",
        accessor: "emp_lname",
      },
      {
        Header: "Action",
        Cell: (row) => (
          <div>
            <Button variant="primary">
              <PencilIcon size={16} />
            </Button>
            <Button variant="danger">
              <TrashcanIcon size={16} />
            </Button>
          </div>
        ),
      },
    ];

    const clockingColumns = [
      {
        Header: "ID",
        accessor: "emp_id",
      },
      {
        Header: "First Name",
        accessor: "emp_fname",
      },
      {
        Header: "Last Name",
        accessor: "emp_lname",
      },
      {
        Header: "Start Time",
        accessor: "emp_stime",
      },
      {
        Header: "End Time",
        accessor: "emp_etime",
      },
    ];
    return (
      <Container fluid>
        <Row>
          <Col lg="4">
            <h1>User Table</h1>
            <Button variant="success" onClick={() => this.showModal()}>
              <DiffAddedIcon size={24} />
              Add Employee
            </Button>
            <Table columns={userColumns} data={this.state.users} />
          </Col>
          <Col lg="2">
            <h1>Enter Clocking Details</h1>
            <Form>
              <Form.Label>Date:</Form.Label>
              <Form.Control
                type="date"
                name="date"
                // onChange={this.handleEmployeeClockingChange}
              ></Form.Control>
              <Form.Label>ID:</Form.Label>
              <Select
                name="idClock"
                options={this.state.selectOptions}
                // onChange={this.handleEmployeeClockingChange}
              />
              <Form.Label></Form.Label>
              <Form.Label>Start Time:</Form.Label>
              <TimePicker
                name="startTime"
                start="6:00"
                end="20:00"
                step={30}
                value={this.state.time}
                onChange={this.handleStartTimeChange}
              />
              <Form.Label>End Time:</Form.Label>
              <TimePicker
                name="endTime"
                start="6:00"
                end="20:00"
                step={30}
                // onChange={this.handleEmployeeClockingChange}
              />
              <Button variant="success">
                <DiffAddedIcon size={24} />
                Enter Details
              </Button>
            </Form>
          </Col>
          <Col lg="6">
            <h1>Clocking Table</h1>
            <Form>
              <Form.Label>Date:</Form.Label>
              <Form.Control type="date" name="viewDate"></Form.Control>
            </Form>
            <Table columns={clockingColumns} data={this.state.users} />
          </Col>
        </Row>

        <Modal
          show={this.state.showEmployeeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label>Enter First Name</Form.Label>
              <Form.Control
                type="text"
                name="fName"
                onChange={this.handleEmployeeChange}
              />
              <Form.Label>Enter Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lName"
                onChange={this.handleEmployeeChange}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleEnterEmployee}>
              Enter Employee
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
