<template>
  <div class="user-info-vue-wrapper">
    <div class="header">
      <a href="./index.html" class="link-secondary">to the start page</a>
    </div>

    <div class="loading-circle" v-if="!userInfo"></div>
    <div class="user-info" v-else>
      <h3>
        Hello {{ userInfo.name }}
      </h3>
      <p>
        {{ userInfo.info }}
      </p>
      <button v-if="userInfo.role === 'boss'" 
              class="btn btn-outline-info btn-sm"
              v-on:click="toggle"
      >
        {{ isParticipantsShown ? "Hide tournament participants" : "Show tournament participants" }}
      </button>
      <div v-if="isParticipantsShown && participants" class="tournament-participants">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in participants">
              <td>{{ p.name }}</td>
              <td>{{ p.email }}</td>
              <td>
                <button class="btn btn-sm"
                        v-bind:class="{ 
                          'btn-danger': p.is_active, 
                          'btn-success': !p.is_active 
                        }"
                        v-on:click="toggleUserStatus(p.email)"
                >
                  {{ p.is_active ? "Deactivate" : "Activate" }}  
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    </div>

  </div>
</template>

<script>
  import "bootstrap/dist/css/bootstrap.css";
  import "bootstrap";

  export default {
    data: () => {
      return {
        userInfo: null,
        isParticipantsShown: false,
        participants: null,
      };
    },

    created() {
      this.getUserInfo(import.meta.env.VITE_USER_INFO_URL);
    },

    methods: {
      async getData(url) {
        const response = await fetch(url);
        return response;
      },

      async getUserInfo(url) {
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
            this.userInfo = await response.json();
          } else {
            this.getData("./login.html").then((response) => {
              window.location.href = response.url;
            });
          }
        });
      },

      async getParticipants(url) {
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
            this.participants = await response.json();
          }
        });
      },

      async updateUserStatus(url, user, status) {
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
      },

      toggle() {
        this.isParticipantsShown = !this.isParticipantsShown;
        if (this.isParticipantsShown && !this.participants) {
          this.getParticipants(import.meta.env.VITE_USERS_URL);
        }
      },

      async toggleUserStatus(email) {
        const user = this.participants.find((u) => u.email === email);
        if (user) {
          const newStatus = !user.is_active;
          this.updateUserStatus(import.meta.env.VITE_UPDATE_USER_STATUS_URL, user, newStatus);
        }
      }
    }
  }
</script>

<style>
  .user-info-vue-wrapper {
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
