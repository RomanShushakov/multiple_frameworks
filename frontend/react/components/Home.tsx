import React, { useEffect, useState } from 'react';

type User = {
  name: string;
  email: string;
  role: string;
  info: string;
  password: string;
  is_active: boolean;
}

type Participant = {
  name: string;
  email: string;
  is_active: boolean;
}

const Home = () => {
    const [userInfo, userupdate] = useState({} as User);
    const [participants, setParticipants] = useState([] as Participant[]);
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
      getUserInfo(import.meta.env.VITE_USER_INFO_URL)
      getParticipants(import.meta.env.VITE_USERS_URL)
    }, []);

    function getUserInfo(url) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      if (import.meta.env.MODE === "development" && localStorage.getItem("token")) {
        headers["Authorization"] = localStorage.getItem("token");
      }
      fetch(url, {
        method: "GET",
        mode: "cors",
        headers,
      })
      .then(async (response) => {
        if (response.status === 200) {
          userupdate(await response.json());
        } else {
          getData("./login.html").then((response) => {
            window.location.href = response.url;
          });
        }
      });
    }

    async function getData(url) {
      const response = await fetch(url);
      return response;
    }

    function getParticipants(url) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      if (import.meta.env.MODE === "development" && localStorage.getItem("token")) {
        headers["Authorization"] = localStorage.getItem("token");
      }

      fetch(url, {
        method: "GET",
        mode: "cors",
        headers,
      })
      .then(async (response) => {
        if (response.status === 200) {
          const participants = await response.json();
          setParticipants(participants);
        }
      });
    }

    async function updateUserStatus(url, user, status) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      if (import.meta.env.MODE === "development" && localStorage.getItem("token")) {
        headers["Authorization"] = localStorage.getItem("token");
      }

      fetch(url, {
        method: "PATCH",
        mode: "cors",
        headers,
        body: JSON.stringify({ email: user.email, is_active: status }),
      })
      .then(async (response) => {
        if (response.status === 200) {
          user.is_active = status;
        }
      });
    }

    const toggleUserStatus = async (email) => {
      const user = participants.find((u) => u.email === email);
      if (user) {
        const newStatus = !user.is_active;
        updateUserStatus(import.meta.env.VITE_UPDATE_USER_STATUS_URL, user, newStatus);
        setParticipants(prevParticipants =>
          prevParticipants.map(participant =>
          participant.email === email ? { ...participant, is_active: newStatus } : participant
          )
        );
      }
    };

return (
    <>
    <div className="header">
        <a href="./index.html" className="link-secondary">to the start page</a>
    </div>
    {userInfo.name && (<div className="user-info">
      <h3>
        Hello { userInfo.name }
      </h3>
      <p>
        { userInfo.info }
      </p>
    </div>)}
    {userInfo.role === 'boss' && (
              <button className="btn btn-outline-info btn-sm" onClick={() => setShowTable(!showTable)}>
                { showTable ? "Hide tournament participants" : "Show tournament participants" }
              </button>
            )}
    { showTable && 
    (<div>
      <h3 className='mt-4'>
        Participants
      </h3>
      <div className="participants">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, index) => (
            <tr key={participant.email}>
              <td>{participant.name}</td>
              <td>{participant.email}</td>
              <td>
              <button className={participant.is_active ? "btn btn-sm btn-danger" : "btn btn-sm btn-success"} 
                onClick={() => toggleUserStatus(participant.email)}>
                { participant.is_active ? "Deactivate" : "Activate" } 
              </button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>)}
    </>
)
}

export default Home