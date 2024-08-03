import { useState, useEffect } from "react";
import { Button, Modal } from 'react-bootstrap';

const Clients = () => {
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [residency, setResidency] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [residencyid, setresidency] = useState(0); 
  const makeAddModalAppear = () => setShowAddModal(!showAddModal);
  
  const makeUpdateModalAppear = (client) => {
    setSelectedClient(client);
    setClientName(client.clientName);
    setResidency(client.residency);
    setresidency(client.id);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setSelectedClient(null);
  };

  const getClients = async () => {
    const response = await fetch("http://localhost:5049/api/ClientApi/GetClients");
    const result = await response.json();
    setClient(result);
    setLoading(false);
  };

  const saveClient = async () => {
    const dataToSend = {
      "clientName": clientName,
      "residency": residency
    };

    await fetch("http://localhost:5049/api/ClientApi/SaveClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSend)
    });
    getClients();
    makeAddModalAppear();
  };

  const updateClient = async () => {
    const dataToSend = {
      ...selectedClient,
      clientName,
      residency
    };

    await fetch(`http://localhost:5049/api/ClientApi/UpdateClient?Id=${residencyid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSend)
    });
    getClients();
    handleUpdateModalClose();
  };

  const deleteClient = async (id) => {
    await fetch(`http://localhost:5049/api/ClientApi/DeleteClient?Id=${id}`, {
      method: "DELETE",
    });
    getClients();
  };

  useEffect(() => {
    getClients();
  }, []);

  if (loading) return <center><h1>Loading</h1></center>;

  return (
    <>
      <Modal show={showAddModal} onHide={makeAddModalAppear}>
        <Modal.Header closeButton>
          New Client Info
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Residency"
            value={residency}
            onChange={(e) => setResidency(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveClient}>Save Client</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          Update Client Info
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <input
            type="text"
            value={residency}
            onChange={(e) => setResidency(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateClient}>Save</Button>
        </Modal.Footer>
      </Modal>

      <div className="add-btn">
        <Button className='mb-2' onClick={makeAddModalAppear}>Add New Client</Button>
      </div>
      <ul className="cards">
        {client.map((c) => (
          <li key={c.id}>
            <div className="client-info">
              <span>{c.clientName}</span>, <span>{c.residency}</span>
            </div>
            <div className="btn-cta">
              <Button onClick={() => makeUpdateModalAppear(c)}>Update</Button>
              <Button onClick={() => deleteClient(c.id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Clients;
