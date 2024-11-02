<script setup>
// external imports
import { ref } from 'vue';

// internal imports
import TopBar from './components/TopBar.vue';
import PinCheckForm from './components/PinCheckForm.vue';

const usersList = ref([]);

const onUpdateUsersList = (users) => {
  usersList.value = users;
};

const onUsersListError = () => {
  alert("ERROR!!!");
};
</script>

<template>
  <!-- <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <TopBar />
  <PinCheckForm 
    @update-users-list="onUpdateUsersList($event.users)"
    @users-list-response-error="onUsersListError"
  />
  <div v-for="user in usersList">
    {{ user }}
  </div>
</template>

<style scoped></style>
