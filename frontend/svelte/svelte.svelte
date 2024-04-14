<div class="user-info-svelte-wrapper">
  <div class="header">
    <a href="./index.html" class="link-secondary">to the start page</a>
  </div>

  {#if !userInfo}
  <div class="loading-circle"></div>
  {:else}
  <div class="user-info" v-else>
    <h3>
      Hello { userInfo.name }
    </h3>
    <p>
      { userInfo.info }
    </p>
    {#if userInfo.role === "boss"}
    <button class="btn btn-outline-info btn-sm"
            on:click={toggle}
    >
      { isParticipantsShown ? "Hide tournament participants" : "Show tournament participants" }
    </button>
    {/if}

    {#if isParticipantsShown && participants}
    <div class="tournament-participants">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {#each participants as p}
          <tr>
            <td>{ p.name }</td>
            <td>{ p.email }</td>
            <td>
              <button class={p.is_active ? "btn btn-sm btn-danger" : "btn btn-sm btn-success"}
                      on:click={toggleUserStatus(p.email)}
              >
                { p.is_active ? "Deactivate" : "Activate" } 
              </button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {/if}
  </div>
  {/if}
</div>

<script>
  import "bootstrap/dist/css/bootstrap.css";
  import "bootstrap";

  import { onMount } from "svelte";

  let userInfo = null;
  let isParticipantsShown = false;
  let participants = null;

  const getData = async (url) => {
    const response = await fetch(url);
    return response;
  };

  const getUserInfo = async (url) => {
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
        userInfo = await response.json();
      } else {
        getData("./login.html").then((response) => {
          window.location.href = response.url;
        });
      }
    });
  };

  onMount(() => {
		getUserInfo(import.meta.env.VITE_USER_INFO_URL);
	});

  const getParticipants = async (url) => {
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
        participants = await response.json();
      }
    });
  };

  const toggle = () => {
    isParticipantsShown = !isParticipantsShown;
    if (isParticipantsShown && !participants) {
      getParticipants(import.meta.env.VITE_USERS_URL);
    }
  };

  const updateUserStatus = async(url, user, status) => {
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
        participants = participants;
      }
    });
  };

  const toggleUserStatus = async (email) => {
    const user = participants.find((u) => u.email === email);
    if (user) {
      const newStatus = !user.is_active;
      updateUserStatus(import.meta.env.VITE_UPDATE_USER_STATUS_URL, user, newStatus);
    }
  };
</script>

<style>
  .user-info-svelte-wrapper {
    margin: 1rem 0 0 0;
    padding: 0;
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .header {
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    justify-content: start;
  }

  .link-secondary {
    margin: 0 0 0 2rem;
  }

  .user-info {
    margin: 0;
    padding: 1rem 2rem 0 2rem;
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .btn-outline-info {
    width: 250px; 
  }

  .tournament-participants {
    margin: 1rem 0 0 0;
    padding: 0;
    display: flex;
    width: 100%;
  }
</style>
