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
    <div class="pin-check-form">
      <label class="company-id-label" for="companyId">{{ t('companyId') }}</label>
      <input type="text" id="companyId" name="companyId" v-model="formData.company_id">
      <label class="customer-id-label" for="customerId">{{ t('customerId') }}</label>
      <input type="text" id="customerId" name="customerId" v-model="formData.customer_id">
      <label class="pin-label" for="pin">{{ t('pin') }}</label>
      <input type="text" id="pin" name="pin" v-model="formData.pin">
      <button class="check-button" type="button" v-on:click="onCheckButtonClick">{{ t('checkButton') }}</button>
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

.pin-check-form {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 100%;
  align-items: center;
}

input {
  margin: 0 0 10px 0;
  padding: 0;
  height: 20px;
  width: 250px;
}

button {
  margin: 10px 0 0 0;
  padding: 0;
  width: 100px;
  height: 25px;
}
</style>
