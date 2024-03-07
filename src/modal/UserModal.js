import React, { useState } from "react";

const UserCreateModal = ({ user, isUpdate = false, onUserCreate, onClose }) => {
  const [createdUser, setCreatedUser] = useState(false);
  // console.log('user',user)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: user?.password || "",
    confirmPassword: user?.password || "",
    mobileNumber: user?.mobileNumber || "",
    email: user?.email || "",
  });

  function handleOnChange(e) {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }



  async function upsertUser() {
    try {
      // await validation();
      delete formData.confirmPassword;
      // console.log('formData', formData)
      const response = await fetch(`http://localhost:4000/api/admin/${isUpdate ? 'edit-user' : 'create-user'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setCreatedUser(true);
        onUserCreate();
      } else {
        setCreatedUser(false);
        console.error('Failed to create User:', data.message);
      }
    } catch (error) {
      setCreatedUser(false);
      console.error('Error creating User:', error);
    }
  }

  async function validation() {
    const { username, password, confirmPassword, mobileNumber, email } = formData;

    // console.log('pass', password);
    // console.log('conf', confirmPassword)

    if (username == '' || password == '' || confirmPassword == '' || mobileNumber == '' || email == '') {
      alert('Please fill all required fields');
    } else if (password && password !== confirmPassword) {
      alert('Password and Confirm Password do not match');
    }
    return;
  }

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.4)', zIndex: '2', margin: 'auto', display: 'flex' }}>
      <div style={{ width: '500px', borderRadius: '10px', backgroundColor: 'white', padding: '10px', position: 'relative', height: '450px', margin: 'auto', border: '1px solid box', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <h2> {isUpdate ? 'Update' : 'Create'} User </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <table>
            <tbody>
              <tr>
                <td> Username </td>
                <td>  <input type="text" name="username" style={{ fontSize: '14px', padding: '8px', width: '80%' }} value={formData?.username} required onChange={(e) => handleOnChange(e)} /> </td>
              </tr>
              <tr>
                <td> Password </td>
                <td>  <input type="password" name="password" style={{ fontSize: '14px', padding: '8px', width: '80%' }} value={formData?.password} required onChange={(e) => handleOnChange(e)} /> </td>
              </tr>
              <tr>
                <td> Confirm Password </td>
                <td>  <input type="password" name="confirmPassword" style={{ fontSize: '14px', padding: '8px', width: '80%' }} value={formData?.confirmPassword} required onChange={(e) => handleOnChange(e)} /> </td>
              </tr>
              <tr>
                <td> Mobile Number </td>
                <td>  <input type="number" name="mobileNumber" style={{ fontSize: '14px', padding: '8px', width: '80%' }} value={formData?.mobileNumber} required onChange={(e) => handleOnChange(e)} /> </td>
              </tr>
              <tr>
                <td> Email ID </td>
                <td>  <input type="email" name="email" style={{ fontSize: '14px', padding: '8px', width: '80%' }} value={formData?.email} required onChange={(e) => handleOnChange(e)} /> </td>
              </tr>
            </tbody>
          </table>
          <span style={{ justifyContent: 'center', display: 'flex' }}>
            <button style={{ padding: '10px', backgroundColor: 'lightcyan' }} onClick={() => upsertUser()}> {isUpdate ? 'UPDATE USER' : 'CREATE USER'}</button>
          </span>
        </div>
        {createdUser && <p style={{ textAlign: "center" }}> Successfully {isUpdate ? 'Updated' : 'Created'} User {formData.username}</p>}
        <div style={{ position: 'absolute', right: '10px', padding: '10px', backgroundColor: "gray", borderRadius: '8px', top: '5px', cursor: 'pointer' }} onClick={() => onClose()}>
          X
        </div>
      </div>
    </div>
  )
}

export default UserCreateModal;