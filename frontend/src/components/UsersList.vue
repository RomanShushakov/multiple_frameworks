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
    <div class="users-list-container" v-if="users && users.length !== 0">
      <div name="users-label" class="user-name-label-container">{{ t('usersList') }}</div>
      <div name="users" v-for="user in users">{{ user }}</div>
    </div>
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

.user-name-label-container {
  font-size: 16px;
  font-weight: 600;
}
</style>
