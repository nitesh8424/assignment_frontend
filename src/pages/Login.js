import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const CryptoJS = require("crypto-js");

const Login = ({ isLogin }) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleOnChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? 'admin' : '') : value;
    // console.log('newVa', newValue)
    setLoginData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  }

  async function login() {
    try {
      setError("");
      if (loginData.username == "" || loginData.password == "") {
        alert('please fill username and password')
        return
      }
      // console.log('loginData',loginData)
      const encryptedPassword = CryptoJS.AES.encrypt(loginData?.password, "@cky").toString();
      
      const response = await fetch(`http://localhost:4000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...loginData, password:encryptedPassword}),
      });

      const data = await response.json();
      // console.log('data',data)
      if (data.success) {
        localStorage.setItem('token', data.token);
        if (data.data.role == 'admin') {
          // console.log('admin',data.data)
          navigate('/admin', { state: { username: loginData.username } })
        } else {
          navigate('/user', { state: { username: loginData.username } })
        }
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError(error.message)
      console.error("Error creating group:", error);
    }
  }
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.4)', zIndex: '2', margin: 'auto', display: 'flex' }}>
      <div style={{ width: '500px', borderRadius: '10px', backgroundColor: 'white', padding: '10px', position: 'relative', height: '450px', margin: 'auto', border: '1px solid box', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ textAlign: 'center' }}>
           <h2> ASSIGNMENT </h2> <h2> LOGIN </h2> </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <table style={{ width: '90%', margin: '30px 0', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ fontSize: '20px', paddingRight: '10px', textAlign: 'right', fontWeight: 'bold' }}>Username:</td>
                <td>
                  <input
                    type="text"
                    style={{ fontSize: '18px', padding: '8px', width: '100%' }}
                    name="username"
                    onChange={(e) => handleOnChange(e)}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '20px', paddingRight: '10px', textAlign: 'right', fontWeight: 'bold' }}>Password:</td>
                <td>
                  <input
                    type="password"
                    style={{ margin: '20px 0', fontSize: '18px', padding: '8px', width: '100%' }}
                    name="password"
                    onChange={(e) => handleOnChange(e)}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="role"
                    onChange={(e) => handleOnChange(e)}
                    style={{ marginRight: '5px' }}
                  />
                  <label htmlFor="isAdmin">Login as Admin</label>
                </td>
              </tr>
            </tbody>
          </table>
          {error && <div style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>{error}</div>}
          <span style={{ justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
            <button
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                padding: '10px',
                paddingLeft: '20px',
                paddingRight: '20px',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
              onClick={() => login()}
            >
              Login
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login;