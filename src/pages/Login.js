import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ isLogin }) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleOnChange(e) {
    const { name, value } = e.target;
    setLoginData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function login() {
    try {
      setError("");
      if (loginData.username == "" || loginData.password == "") {
        alert('please fill username and password')
        return
      }
      if (window.location.pathname === '/admin/login') {
        loginData.role = 'admin';
      }
      // console.log('loginData',loginData)
      const response = await fetch(`http://localhost:4000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      // console.log('data',data)
      if (data.success) {
        if (data.data.role == 'admin') {
          // console.log('admin',data.data)
          navigate('/admin', { state: { username: loginData.username } })
        }else{
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
          {window.location.pathname === '/admin/login' && <h2> ADMIN </h2>}<h2> LOGIN </h2> </div>
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