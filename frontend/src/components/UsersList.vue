<script setup>
// external imports
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  users: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class=wrapper>
    <ul class="list-group" v-if="users && users.length !== 0">
      <li class="list-group-item user-name-label">{{ t('usersList') }}</li>
      <li class="list-group-item" v-for="user in users">{{ user }}</li>
    </ul>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 10px 0 0 0;
  width: 100%;
  align-items: center;
}

.users-list-container {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 100%;
  align-items: center;
}

.list-group {
  width: 30%;
}

.user-name-label {
  font-weight: 600;
}
</style>
