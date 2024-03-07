import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserCreateModal from '../modal/UserModal';
import Loader from '../modal/LoaderModal';
const editIcon = '/editIcon.png';
const deleteIcon = '/deleteIcon.png';


function Admin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    let username = state ? state.username : null;

    const [users, setUsers] = useState([]);
    const [createUser, setCreateUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState();



    function handleLogout() {
        if (location.state) {
            location.state.username = null;
            username = null;
        }
        window.location.replace('/admin/login');
    }

    useEffect(() => {
        if (!username) {
            handleLogout();
        } else {
            fetchUsers();
        }
    }, [username]);

    const fetchUsers = async () => {
        try {
            const userResponse = await fetch(`http://localhost:4000/api/fetch-all-users`);
            const usersList = await userResponse.json();
            setUsers(usersList.data);
            // console.log('usersss', users)
            setIsLoading(false)
        } catch (error) {
            //   setIsLoading(false)
            console.error('Error fetching messages:', error);
        }
    };

    const handleEdit = (user) => {
        // console.log('er', user)
        setSelectedUser(user)
    }
    const handleDelete = async (user) => {
        // console.log('er', user)
        try {
            //if need we can add confirmation dialog box before delete any users.
            await fetch('http://localhost:4000/api/admin/delete-user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user.username }),
            });
            alert(`${user.username} successfully deleted.`)
            fetchUsers();
        } catch (error) {
            // console.log('delete error', error)
        }
    }
    const onCreateUser = () => {
        setCreateUser(false);
        fetchUsers(); // Update messages after creating a group
    };

    return (
        <div>
            {isLoading && <Loader />}
            {createUser && <UserCreateModal onUserCreate={onCreateUser} onClose={() => setCreateUser(false)} />}
            {selectedUser && <UserCreateModal user={selectedUser} isUpdate={selectedUser && true} onUserCreate={onCreateUser} onClose={() => setSelectedUser(false)} />}
            <div style={{ maxHeight: '(100-40)vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'end', paddingRight: '20px', gap: '20px', flexDirection: 'row', height: '50px', alignItems: 'center', backgroundColor: 'lightskyblue' }}>
                    <p> Welcome, <strong>{username}</strong> </p>
                    <span>
                        <button style={{ padding: '10px' }} onClick={() => handleLogout()}> Logout </button>
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                    <button style={{ padding: '10px', paddingLeft: '30px', paddingRight: '30px', backgroundColor: 'lightblue' }} onClick={() => setCreateUser(true)}> CREATE USER </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                    <h2 style={{ textAlign: 'center' }}>All Users</h2>

                    <div style={{ maxHeight: '430px', overflowY: 'auto', justifyContent: 'center', marginBottom: '10%' }}>

                        <table style={{ borderCollapse: 'collapse', width: '70%', border: '1px solid black', margin: 'auto' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Sr.No</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Username</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Edit</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody style={{ marginBottom: '20px' }}>
                                {users.map((user, index) => (
                                    <tr key={index} style={{ border: '1px solid black', marginBottom: '20px' }}>
                                        <td style={{ width: '10%', border: '1px solid black', padding: '8px' }}>{index + 1}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{user?.username}</td>
                                        <td style={{ width: '20%', border: '1px solid black', textAlign: 'center', padding: '4px' }}><img src={editIcon} style={{ cursor: 'pointer' }} width={18} height={18} alt="Edit" onClick={() => handleEdit(user)} /></td>
                                        <td style={{ width: '20%', border: '1px solid black', textAlign: 'center', padding: '4px' }}><img src={deleteIcon} alt="Delete" style={{ cursor: 'pointer' }} width={18} height={18} onClick={() => handleDelete(user)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;