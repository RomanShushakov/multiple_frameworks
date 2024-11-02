<script setup>
// external imports
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();

const emit = defineEmits(['updateUsersList', 'usersListResponseError']);

const formData = ref({
  company_id: '002',
  customer_id: '123456',
  pin: '123456',
});

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response;
}

const onCheckButtonClick = () => {
  const requestBody = { ...formData.value };

  postData(import.meta.env.VITE_CHECK_PIN_FORM_URL, requestBody)
    .then((response) => {
      if (response.ok) {
        response.json()
          .then((data) => {
            emit('updateUsersList', { users: data });
          })
      } else {
        emit('usersListResponseError');
      }
    });
};

</script>

<template>
  <div class=wrapper>
    <form>
      <div class="mb-3">
        <label for="companyId" class="form-label">{{ t('companyId') }}</label>
        <input type="text" class="form-control" id="companyId" v-model="formData.company_id">
      </div>
      <div class="mb-3">
        <label for="customerId" class="form-label">{{ t('customerId') }}</label>
        <input type="text" class="form-control" id="customerId" v-model="formData.customer_id">
      </div>
      <div class="mb-3">
        <label for="pin" class="form-label">{{ t('pin') }}</label>
        <input type="text" class="form-control" id="pin" v-model="formData.pin">
      </div>
      <div class="button-container">
        <button type="button" class="btn btn-primary" v-on:click="onCheckButtonClick">{{ t('checkButton') }}</button>
      </div>
    </form>
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

.button-container {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>
