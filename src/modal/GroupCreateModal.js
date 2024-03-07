import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const GroupCreateModal = ({ userList, isUpdate, selectedGroup, onGroupCreate, onClose }) => {
    const location = useLocation();
    const { state } = location;


    // Now, state should contain the data passed during navigation
    const username = state ? state.username : null;
    // console.log('username', selectedGroup);
    let [groupData, setGroupData] = useState({
        groupName: selectedGroup?.groupName || "",
        username: username,
        members: selectedGroup ? [...selectedGroup?.members] : [],
    });
    // console.log('selectedGroup?.members', groupData?.members)
    const [createdGroup, setCreatedGroup] = useState(false);

    function handleOnChange(e) {
        const { name, value } = e.target;
        setGroupData((prevGroupData) => ({
            ...prevGroupData,
            [name]: value,
        }));
    }

    function handleUserSelection(user) {
        setGroupData((prevGroupData) => {
            const updatedMembers = prevGroupData.members.some((member) => member.username === user)
                ? prevGroupData.members.filter((member) => member.username !== user)
                : [...prevGroupData.members, { username: user }];

            return {
                ...prevGroupData,
                members: updatedMembers,
            };
        });
    }

    async function upsertGroup() {
        try {
            if (username) {
                // console.log('groupData', groupData)
                groupData = {
                    ...groupData,
                    members: groupData.members.map((member) => ({
                        ...member,
                        added_date: Date.now(),
                    })),
                };

                // console.log('groupData', groupData)
                const response = await fetch(`http://localhost:4000/api/user/${isUpdate ? 'update-group' : 'create-group'}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(groupData),
                });

                const data = await response.json();

                if (data.success) {
                    setCreatedGroup(true);
                    // setTimeout(() => {
                    //     onClose(true)
                    // },10);
                    onGroupCreate();
                } else {
                    setCreatedGroup(false);
                    console.error("Failed to create group:", data.message);
                }
            }
        } catch (error) {
            setCreatedGroup(false);
            console.error("Error creating group:", error);
        }
    }

    return (
        <div style={{ position: 'fixed', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.4)', zIndex: '2', margin: 'auto', display: 'flex' }}>
            <div style={{ width: '500px', borderRadius: '10px', backgroundColor: 'white', padding: '10px', position: 'relative', height: '450px', margin: 'auto', border: '1px solid box', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}> Create Group Modal</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label> Group Name </label>
                        <input type="text" name="groupName" value={groupData?.groupName} disabled={createdGroup} onChange={(e) => handleOnChange(e)} />
                    </div>
                    <div style={{ overflowY: 'auto', maxHeight: '230px' }}>
                        {userList.map((user) => (
                            <div key={user} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', paddingLeft: '20px', paddingRight: '20px', backgroundColor: groupData.members.some((member) => member.username === user) ? 'lightBlue' : 'lightgray' }}>
                                {user}
                                <button style={{ cursor: 'pointer' }} onClick={() => handleUserSelection(user)}>
                                    {groupData.members.some((member) => member.username === user) ? 'Unselect' : 'Select'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <span style={{ justifyContent: 'center', display: 'flex' }}>
                        <button style={{ padding: '10px', backgroundColor: 'lightcyan' }} onClick={() => upsertGroup()}> {isUpdate ? 'UPDATE GROUP' : 'CREATE GROUP'}</button>
                    </span>
                </div>
                <br />
                {createdGroup && <span> Successfully {isUpdate ? 'Updated' : 'Created'} Group {groupData.groupName}</span>}
                <div style={{ position: 'absolute', right: '10px', top: '5px', cursor: 'pointer' }} onClick={() => onClose()}>
                    X
                </div>
            </div>
        </div>
    );
}

export default GroupCreateModal;