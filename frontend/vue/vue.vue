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

    mounted() {
      console.log("Mounted");
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

      toggle() {
        this.isParticipantsShown = !this.isParticipantsShown;
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
    padding: 1rem 0 0 2rem;
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 250px; 
  }
</style>
