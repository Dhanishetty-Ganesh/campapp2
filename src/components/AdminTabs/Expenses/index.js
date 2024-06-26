import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { RiArrowRightSLine } from "react-icons/ri";
import Footer from '../../Footer';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { Popup } from 'reactjs-popup';
import { MdDelete, MdExposureNeg1 } from 'react-icons/md';

import './index.css'; // Import CSS file

const Expenses = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item index
  const campCluster = Cookies.get("campId");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getVideos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://js-member-backend.vercel.app/getexpensesreportdata/${campCluster}`);
        const data = await response.json();
        const filteredList = data.result.filter(
          (ele) => ele.campCluster === campCluster && ele.addedByemail === Cookies.get("campuseremail")
        );
        setUsers(filteredList);
        setIsLoading(false);
      } catch (Err) {
        console.log(`Error Occurred : ${Err}`);
      }
    };

    // Call getVideos only once on mount
    getVideos();
  }, [campCluster]); // Empty dependency array means it runs only once on mount

  const postData = async (obj) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
      };
      const response = await fetch(`https://js-member-backend.vercel.app/addreportexpenseslist`, options);
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(`Error Occurred: ${err}`);
    }
  };

  function handleSave(userData) {
    postData(userData);
    const newData = [userData, ...users];
    setUsers(newData);
    setShowForm(false);
  }

  const getUrl = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://js-member-backend.vercel.app/upload', {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      return data.Location;
    } catch (error) {
      alert("File Upload Failed");
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
    }
  };

  const FormComponent = ({ onSave, onClose }) => {
    const [expensesDate, setExpensesDate] = useState('');
    const [purpose, setPurpose] = useState('');
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const [verifiedBy, setVerifiedBy] = useState('');
    const [expensesBill, setExpensesBill] = useState('');
    const [isUploading, setIsUploading] = useState(false); // Add state for uploading status

    const onChangeCopyOfTheBill = async (e) => {
      const file = e.target.files[0];
      setIsUploading(true); // Set uploading status to true
      const fileUrl = await getUrl(file);
      setExpensesBill(fileUrl);
      setIsUploading(false); // Set uploading status to false
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const currentDate = (new Date()).toLocaleDateString('en-GB');
      const currentTime = (new Date()).toLocaleTimeString();
      if (expensesBill) {
        onSave({
          id: uuidv4(),
          expensesDate: (new Date(expensesDate)).toLocaleDateString('en-GB'),
          purpose,
          item,
          amount,
          verifiedBy,
          copyOfTheBill: expensesBill,
          date: currentDate,
          time: currentTime,
          campCluster,
          addedByemail: Cookies.get("campuseremail")
        });
        // Reset input fields after submission
        setExpensesDate('');
        setPurpose('');
        setItem('');
        setAmount('');
        setVerifiedBy('');
        setExpensesBill('');
      } else {
        alert("Please wait file is uploading");
      }
    };

    const handleCancel = () => {
      onClose();
    };

    return (
      <>
        <div className="form-container active"> {/* Add overflow style */}
          <form className="d2d-form" onSubmit={handleSubmit}>
            <h1 className='popup-heading'>Daily Camp Expense</h1>
            <label htmlFor="expensesDate" className="form-label">Select Date:</label>
            <input
              type="date"
              id="expensesDate"
              placeholder='Enter the date'
              className="ytmcregister-user-input"
              value={expensesDate}
              onChange={(e) => setExpensesDate(e.target.value)}
              required
            />
            <label htmlFor="purpose" className="form-label">Purpose:</label>
            <input
              placeholder='Enter the Purpose'
              type="text"
              id="purpose"
              className="ytmcregister-user-input"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
            <label htmlFor="item" className="form-label">Item :</label>
            <input
              placeholder='Enter the Item'
              type="text"
              id="item"
              className="ytmcregister-user-input"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
            />
            <label htmlFor="amount" className="form-label">Amount :</label>
            <input
              type="text"
              placeholder='Enter Amount'
              id="amount"
              className="ytmcregister-user-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <label htmlFor="verifiedby" className="form-label">Verified By:</label>
            <input
              type="text"
              id="verifiedby"
              placeholder='Enter Verified By'
              className="ytmcregister-user-input"
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              required
            />
            <label htmlFor="copyofthebill" className="form-label">Copy of the Bill:</label>
            <input
              type="file"
              id="copyofthebill"
              placeholder='Enter the Copy of the Bill'
              className="ytmcregister-user-input"
              onChange={onChangeCopyOfTheBill}
              required
            />
            <div style={{ marginTop: '10px' }} className='cancel-submit-btn-container'>
              <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn-submit" disabled={isUploading}>Submit</button> {/* Disable button while uploading */}
            </div>
          </form>
        </div>
        <Footer />
      </>
    );
  };

  return (
    <>
      <div>
        <div className='main-header-container'>
          <h1 className='main-d2d'>Expenses</h1>
        </div>
        <div className='d2d-container'>
          <div className={showForm ? "overlay" : "overlay hidden"} onClick={() => setShowForm(false)}></div>
          {showForm && <FormComponent onSave={handleSave} onClose={() => setShowForm(false)} />}
          <div className="floating-button" onClick={() => setShowForm(!showForm)}>
            <span>New</span>
            <FaPlus className="plus-icon" />
          </div>
          <ul className={selectedItem !== null ? "userList " : "userList"}>
            {users.length === 0 ? (
              <div className='empty-list-container'>
                <li className="empty-list">The Expenses List is Empty. Click on the New to Add Expenses</li>
              </div>
            ) : (
              users.map((user, index) => (
                <li key={index} className="d2d-users-list" onClick={() => setSelectedItem(index)}>
                  <div className='d2d-list-column'>
                    <p className='list-d2d-name'>Date & Time: {user.date} & {user.time}</p>
                  </div>
                  <p><RiArrowRightSLine className='side-arrow' /></p>
                </li>
              ))
            )}
          </ul>
          {selectedItem !== null && (
            <div className="popup">
              <div className="popup-content">
                <span className="close" onClick={() => setSelectedItem(null)}>&times;</span>
                <ul className="userList">
                  <li className="users-list" style={{ height: '300px', overflowY: 'auto' }}>
                    <table className="userTable">
                      <thead>
                        <tr>
                          <th className="parameterHeader">Parameters</th>
                          <th className="valueHeader">Values</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="parameter">Expenses Date</td>
                          <td className="value">{users[selectedItem].expensesDate}</td>
                        </tr>
                        <tr>
                          <td className="parameter">Purpose</td>
                          <td className="value">{users[selectedItem].purpose}</td>
                        </tr>
                        <tr>
                          <td className="parameter">Item</td>
                          <td className="value">{users[selectedItem].item}</td>
                        </tr>
                        <tr>
                          <td className="parameter">Amount</td>
                          <td className="value">{users[selectedItem].amount}</td>
                        </tr>
                        <tr>
                          <td className="parameter">Verified By</td>
                          <td className="value">{users[selectedItem].verifiedBy}</td>
                        </tr>
                        <tr>
                          <td className="parameter">Copy of the Bill</td>
                          <td className="value">
                            <Popup
                              trigger={<button className='edit-Btn' type="button">View</button>}
                              modal
                              nested
                              contentStyle={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999' }}
                              overlayStyle={{ position: 'fixed', top: 0, left:0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '9998' }}
                            >
                              {close => (
                                <div className="modal rcyt-custom-popup">
                                  <div className="content rcyt-popup-cont">
                                    <h3 style={{ marginBottom: '5px' }}>Copy of the Bill</h3>
                                    <img src={users[selectedItem].copyOfTheBill} alt="copy of the bill" height="200" width="200" />
                                  </div>
                                  <div className="actions">
                                    <button className="button delete-Btn" onClick={() => {
                                      console.log('modal closed');
                                      close();
                                    }}>Close</button>
                                  </div>
                                </div>
                              )}
                            </Popup>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Expenses;
