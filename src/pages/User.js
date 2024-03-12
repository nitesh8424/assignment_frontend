import React, { useEffect, useState } from 'react';
import GroupCreateModal from '../modal/GroupCreateModal';
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
const editIcon = '/editIcon.png';
const deleteIcon = '/deleteIcon.png';

function User({ socket }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  let username = state ? state.username : null;

  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputGroupName, setInputGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [createGroup, setCreateGroup] = useState(false);
  const [modifiedGroup, setModifiedGroup] = useState();
  const [groupAdmin, setGroupAdmin] = useState('');

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.replace('/');
}

useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/');
    } else {
        // Send token to server for validation
        fetch('http://localhost:4000/api/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid token');
            }
            fetchMessages();
        })
        .catch(error => {
            console.error('Error validating token:', error);
            navigate('/'); 
        });
    }
}, []); 

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/fetch-groups?username=${username}`);
      const data = await response.json();
      const userResponse = await fetch(`http://localhost:4000/api/fetch-all-users`);
      const usersList = await userResponse.json();

      setGroupData(data.data);
      setUsers(usersList.data.map((user) => user.username));


      const updatedMessages = {};
      data.data.forEach((group) => {
        const { groupName, messages: groupMessages } = group;
        updatedMessages[groupName] = groupMessages;
      });
      // console.log('updatedMessages', updatedMessages)
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDelete = async (group) => {
    // console.log('er', group)
    try {
      const group_admin = groupData
        .filter(user => user?.groupName == group)
        .map(user => user?.group_admin);
      setGroupAdmin(...group_admin)
      // console.log('selectedGroup', selectedGroup)

      //if need we can add confirmation dialog box before delete any users.
      await fetch('http://localhost:4000/api/user/delete-group', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName: group, username: groupAdmin }),
      });
      alert(`${group} group is successfully deleted.`)
      fetchMessages();
    } catch (error) {
      console.log('delete error', error)
    }
  }

  useEffect(() => {
    joinRoom();
    socket.on('message', async (data) => {
      // console.log('data', data)
      if (data) {
        await handleMessage(data);
        // console.log(`Received message from ${data.sender}: ${data.message}`);
      }
    });
    return () => {
      socket.off('message');
    };
  }, [socket, messages]); // Trigger the joinRoom when messages change

  function joinRoom() {
    Object.keys(messages).forEach((group) => {
      socket.emit('joinRoom', group);
    });
  }

  const handleMessage = (item) => {
    setMessages((prevMessages) => {
      const { room, sender, message, message_date } = item;
      const newMessages = { ...prevMessages };

      if (!newMessages[room]) {
        newMessages[room] = [];
      }

      newMessages[room] = [...newMessages[room], { sender, message, message_date }];

      // console.log('updatedMessages', newMessages);

      return newMessages;
    });
  };


  const sendMessage = () => {
    socket.emit('sendMessage', {
      groupName: inputGroupName,
      username,
      message: inputMessage,
    });

    setInputMessage('');
  };

  const onCreateGroup = () => {
    setCreateGroup(false);
    fetchMessages(); // Update messages after creating a group
  };

  const handleEdit = (user) => {
    // console.log('er', user)
    const selected = groupData.filter((group) => group.groupName == user?.groupName)
    // console.log('selectedGroup', ...selected);
    setModifiedGroup(...selected)
  }

  return (
    <>
      {username && (
        <div>
          {createGroup && <GroupCreateModal userList={users} onGroupCreate={onCreateGroup} onClose={() => setCreateGroup(false)} />}
          {modifiedGroup && <GroupCreateModal userList={users} selectedGroup={modifiedGroup} isUpdate={modifiedGroup && true} onGroupCreate={onCreateGroup} onClose={() => setModifiedGroup(false)} />}
          <div>
            <div style={{ display: 'flex', justifyContent: 'end', paddingRight: '20px', gap: '20px', flexDirection: 'row', height: '50px', alignItems: 'center', backgroundColor: 'lightskyblue' }}>
              <p> Welcome, <strong>{username}</strong> </p>
              <span>
                <button style={{ padding: '10px' }} onClick={() => handleLogout()}> Logout </button>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <button style={{ padding: '10px', paddingLeft: '30px', paddingRight: '30px', backgroundColor: 'lightblue' }} onClick={() => setCreateGroup(true)}> CREATE GROUP </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '95%', maxHeight: '600px', overflowY: 'auto', padding: '20px' }}>
              <div style={{ width: '30%' }}>
                <div style={{ border: '1px solid black', overflowY: 'auto', maxHeight: '300px', padding: '10px' }}>
                  <h3>All Groups</h3>
                  {groupData.map((group, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'lightgray' : 'antiquewhite', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: "10px"
                      }}
                    >
                      <p
                        onClick={() => {
                          setSelectedGroup(group);
                          // console.log('messages', selectedGroup)
                          setInputGroupName(group?.groupName);
                        }}
                        style={{ cursor: 'pointer' }}>{group?.groupName}</p>

                      {group.group_admin === username && (
                        <img
                          key={group.groupName}  // Add a unique key to each element in the array
                          style={{ cursor: 'pointer' }}
                          src={deleteIcon}
                          width={24}
                          height={24}
                          onClick={() => handleDelete(group.groupName)}
                        />
                      )}
                    </div>

                  ))}
                </div>
                <div style={{ border: '1px solid black', overflowY: 'auto', maxHeight: '330px', padding: '10px' }}>
                  <h3>All Users</h3>
                  {users.map((user) => (
                    <div key={user} style={{ backgroundColor: 'lightgray' }} onClick={() => { }}>
                      <p style={{ padding: '5px' }}>{user}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: '60%', overflowY: 'auto', position: 'relative', maxHeight: '584px', border: '1px solid black' }}>
                <div className='chatBox' style={{ border: '1px solid black', display: 'flex', flexDirection: 'column', height: '86%', maxHeight: '86%', overflowY: 'auto', backgroundColor: 'lightgray' }}>
                  {selectedGroup && (
                    <div>
                      <div style={{ position: 'sticky' }}>
                        <span style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', fontSize: '25px', alignItems: 'center', top: 0, backgroundColor: 'lightgoldenrodyellow' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ borderRadius: '50%', width: '50px', height: '50px', display: 'flex', backgroundColor: selectedGroup ? 'lightblue' : 'gray', marginRight: '10px', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                              {selectedGroup && selectedGroup.groupName.slice(0, 2)}
                            </span>
                            {selectedGroup?.groupName}
                          </div>
                          {selectedGroup?.group_admin === username && <img style={{ float: 'right', cursor: 'pointer' }} src={editIcon} width={24} height={24} onClick={() => handleEdit(selectedGroup)} />}
                        </span>
                      </div>
                      <ul>
                        {messages[selectedGroup?.groupName].map((msg, index) => (
                          <div key={index} style={{ textAlign: msg.sender === username ? 'right' : 'left' }}>
                            <li style={{ listStyleType: 'none', margin: '5px', position: 'relative' }}>
                              <div style={{
                                backgroundColor: msg.sender === username ? 'lightcyan' : 'lightgreen',
                                padding: '8px',
                                borderRadius: '8px',
                                display: 'inline-block',
                                width: '250px',
                                overflow: 'hidden', // Hide overflowed content
                                wordWrap: 'break-word', // Allow long words to break and wrap
                              }}>
                                <p style={{ margin: 0 }}>
                                  <strong>{msg.sender}</strong>
                                </p>
                                <p style={{ margin: 0 }}>{msg.message}</p>
                                <p style={{ margin: 0, fontSize: '0.8em', color: 'gray' }}>{new Date(msg.message_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                              </div>
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '6px',
                                borderColor: `${msg.sender === username ? 'transparent transparent transparent lightblue' : 'transparent lightgreen transparent transparent'}`,
                                right: msg.sender === username ? '-12px' : 'auto',
                                left: msg.sender !== username ? '-12px' : 'auto',
                              }}></div>
                            </li>
                          </div>
                        ))}

                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', bottom: '0px', position: 'absolute', width: '90%', padding: '14px', justifyContent: 'center' }}>
                  <input
                    type="text"
                    value={inputMessage}
                    disabled={!selectedGroup}
                    style={{ fontSize: '16px', width: '80%', padding: '10px' }}
                    placeholder='Enter message here...'
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button disabled={!selectedGroup} style={{ backgroundColor: 'lightsalmon', padding: '10px', marginLeft: '10px' }} onClick={sendMessage}>Send</button>
                </div>
              </div>

            </div>
            <br /><br />
          </div>
        </div>
      )}
    </>
  );
}

export default User;