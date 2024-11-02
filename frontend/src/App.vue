<script setup>
// external imports
import { ref } from 'vue';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";

// internal imports
import TopBar from './components/TopBar.vue';
import PinCheckForm from './components/PinCheckForm.vue';
import UsersList from './components/UsersList.vue';

const usersList = ref([]);

const onUpdateUsersList = (users) => {
  usersList.value = users;
};

const onUsersListError = () => {
  usersList.value = [];
  alert("ERROR!!!");
};
</script>

<template>
  <TopBar />
  <PinCheckForm 
    @update-users-list="onUpdateUsersList($event.users)"
    @users-list-response-error="onUsersListError"
  />
  <UsersList v-bind={users:usersList} />
</template>

<style scoped></style>
