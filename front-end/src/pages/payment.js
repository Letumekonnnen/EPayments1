import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Input, Modal } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import "./payment.css";

const Payment = () => {
  const [serviceNo, setServiceNumber] = useState(localStorage.getItem('serviceNo'));
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [userbill, setUserBill] = useState(null);
  const [banks, setBanks] = useState([]);
  const [form] = Form.useForm();
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const formRef = useRef(null);

 
  const [bankAccount, setBankAccount] = useState({
    bankAccountNumber: "",
    bankName: "", // Add the bankName field
    account_holder_name: "",
    account_holder_type: "individual",
  });

  const [showBankAccountForm, setShowBankAccountForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Users/serviceNo/${serviceNo}`);
        setUser(response.data);
        console.log(response.data);

        // Assuming user has a valid service provider association
        const serviceProviderBIN = response.data.ServiceProviders[0].serviceProviderBIN;
        const userId = response.data.id;
        console.log(userId);
        console.log(serviceProviderBIN);

        const userBillResponse = await axios.get(`http://localhost:3000/bills/findOne`, {
          params: {
            userId: userId,
            serviceProviderBIN: serviceProviderBIN,
          }
        });
        setUserBill(userBillResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBanks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Agents"); // Replace with your actual endpoint
        setBanks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchBanks();
  }, []);

  const handlePayment = (billNumber, serviceProviderBIN) => {
    setShowBankAccountForm(true);
    // Handle the payment logic here
  };

  const handleDownload = (fileType) => {
    // Capture the modal container element
    const modalContainer = document.querySelector(".ant-modal-content");

    // Use html2canvas to convert the modal container to a canvas
    html2canvas(modalContainer).then((canvas) => {
      if (fileType === "picture") {
        // Convert the canvas to a base64-encoded PNG image
        const dataURL = canvas.toDataURL("image/png");

        // Create a temporary link element to trigger the download
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "modal.png";
        link.click();
      } else if (fileType === "pdf") {
        // Convert the canvas to a base64-encoded PNG image
        const dataURL = canvas.toDataURL("image/png");

        // Calculate the dimensions of the PDF document based on the canvas size
        const imgWidth = 210; // A4 page width (in mm)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create a new jsPDF instance
        const pdf = new jsPDF("p", "mm", "a4");

        // Add the image to the PDF document
        pdf.addImage(dataURL, "PNG", 0, 0, imgWidth, imgHeight);

        // Save the PDF file
        pdf.save("modal.pdf");
      } else {
        console.error("Invalid file type");
      }
    });
  };


  const handleBankAccountSubmit = async () => {
    try {
      // Generate random transaction number and get current date
      const randomNumber = Math.floor(Math.random() * 1000000000);
      const random = `TXN${randomNumber}`;
      const today = new Date().toISOString().split('T')[0];
  
      // Prepare payment data
      const paymentData = {
        TransactionNo: random,
        paymentDate: today,
        amount: userbill.TotalAmount,
        UserId: userbill.UserId,
        serviceProviderBIN: localStorage.getItem('serviceProviderBIN'),
        paymentMethod: "Credit card", // Add your payment method
        paymentDescription: `Payment for ${userbill.serviceDescription} services`,
        ReferenceNo: userbill.billNumber,
      };
  
      // Create and verify the PaymentMethod
      const paymentMethodResponse = await axios.post(
        "http://localhost:3000/payment",
        paymentData
      );
  
  
      // Update the bill status to "paid"
      const response = await axios.put(`http://localhost:3000/bills/${userbill.id}`, {
        billStatus: "paid",
        PaymentId: paymentMethodResponse.data.id,
      });
  
      if (response) {
        // Payment succeeded
        console.log("Paid");
        setDownloadModalVisible(true);
        setPayments(paymentData);
        console.log(payments);
      } else {
        // Payment failed
        console.log("Payment failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    setBankAccount({
      ...bankAccount,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="payment-container">
      <h1>Bill Detail</h1>

      {userbill ? (
        <div key={userbill.billNumber} className="bill-container">
          <div className="bill-header">
            <h2>Bill Number: {userbill.billNumber}</h2>
            <h3>Date Issued: {userbill.dateIssued}</h3>
          </div>
          <div className="bill-details">
            <div className="bill-section">
              <h4>Customer Information</h4>
              <p>Customer Name: {userbill.customerName}</p>
            </div>
            <div className="bill-section">
              <h4>Service Details</h4>
              <p>Description: {userbill.serviceDescription}</p>
              <p>Period: {userbill.servicePeriod}</p>
              <p>Charges: {userbill.serviceCharges}</p>
              <p>Additional Charges: {userbill.additionalCharges}</p>
            </div>
            <div className="bill-section">
              <h4>Payment Details</h4>
              <p>Amount Due: {userbill.amountDue}</p>
              <p>Due Date: {userbill.dueDate}</p>
              <p>Bill Status: {userbill.billStatus}</p>
              <p>Total Amount: {userbill.TotalAmount}</p>
            </div>
          </div>
          <Button
            className="pay-btn"
            onClick={() =>
              handlePayment(userbill.billNumber, userbill.serviceProviderBIN)
            }
          >
            Pay Now
          </Button>
        </div>
      ) : (
        <div className="no-bill">
          <h2>No bill available.</h2>
        </div>
      )}

{showBankAccountForm && (
  <div className="input-container">
    <h2>Bank Account Details</h2>
    <Input
      className="shorter-input"
      name="bankAccountNumber"
      value={bankAccount.bankAccountNumber}
      onChange={handleChange}
      placeholder="Bank Account Number"
    />
    <Input
      className="shorter-input"
      name="account_holder_name"
      value={bankAccount.account_holder_name}
      onChange={handleChange}
      placeholder="Account Holder Name"
    />
    <select
      className="bank-dropdown"
      name="AgentName"
      value={bankAccount.AgentName}
      onChange={handleChange}
    >
      <option value="">Select Bank</option>
      {banks.map((bank) => (
        <option key={bank.id} value={bank.agentName}>
          {bank.agentName}
        </option>
      ))}
    </select>
    <br />
    <Button className="pay" onClick={handleBankAccountSubmit}>
      Pay
    </Button>
  </div>
)}
<Modal
      title="Download File"
      visible={downloadModalVisible}
      onCancel={() => setDownloadModalVisible(false)}
      footer={null}
    >
      <Button type="primary" onClick={() => handleDownload("picture")}>
        Download as Picture
      </Button>
      <Button type="primary" onClick={() => handleDownload("pdf")}>
        Download as PDF
      </Button>

      {userbill && (
        <div className="payment-details">
          <h2>Payment Information:</h2>
          <p>TransactionNo: {payments.TransactionNo}</p>
          <p>Payment Method: Credit card</p>
          <p>
            Description: {payments.paymentDescription} 
          </p>
          <p>
            Reference Number:  {payments.ReferenceNo} 
          </p>
          <p>
           Total Amount:  {payments.amount} 
          </p>
          <p>
           Payment Date:  {payments.paymentDate} 
          </p>
          <p>
           Payer:  {payments.PayerId} 
          </p>
          <p> </p>
          <p>
           Payment Date:  {payments.paymentDate} 
          </p>
        </div>
      )}
    </Modal>
    </div>
  );
};

export default Payment;