import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DashBoard({ marketplace, nft, user }) {
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    // Fetch properties from server
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:4000/allProperties"); // Update the API endpoint based on your backend
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };
    fetchProperties();
  }, []);

  const handleApprove = async (propertyId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/properties/${propertyId}`,
        { isApproved: true }
      );

      if (response.status === 200) {
        // Update the local state to reflect the change
        setProperties(
          properties.map((property) => {
            if (property._id === propertyId) {
              property.isApproved = true;
            }
            return property;
          })
        );
      } else {
        throw new Error("failed to approve property");
      }
    } catch (error) {
      console.error(`Failed to approve property with id ${propertyId}:`, error);
    }
  };

  const handleReject = async (propertyId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/properties/${propertyId}`,
        { isApproved: false }
      ); // Update the API endpoint based on your backend
      if (response.status === 200) {
        // Update the local state to reflect the change
        setProperties(
          properties.map((property) => {
            if (property._id === propertyId) {
              property.isApproved = false;
            }
            return property;
          })
        );
      } else throw new Error("approval failed");
    } catch (error) {
      console.error(`Failed to reject property with id ${propertyId}:`, error);
    }
  };
  return (
    <div>
      <header className="text-left mb-4 pb-2 border-bottom">
        <h4 className="text-uppercase">Admin Dashboard</h4>
      </header>
      <table className="table">
        <thead>
          <tr>
            
            <th>Document</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property._id}>
              
              <td>
                <a
                  href={`https://${property.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {property._id}
                </a>
              </td>
              <td>{property.isApproved ? "Approved" : "Not Approved"}</td>
              <td>
                <>
                  <button style={{marginRight:"25px"}}
                    className="btn btn-success mr-2"

                    onClick={() => handleApprove(property._id)}
                  >
                    Approve 
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(property._id)}
                  >
                    Reject
                  </button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
