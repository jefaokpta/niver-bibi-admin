<script setup>
import {onMounted, ref} from "vue";
import {httpClient} from "@/http/axios.js";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FilterMatchMode} from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const loading = ref(false)
const successAlert = ref(false)
const errorAlert = ref(false)
const participants = ref([]);
const participant = ref({
  name: '',
  phone: '',
  guests: []
})
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const toast = useToast();

onMounted(() => {
    loadTable()
});
const loadTable = () => {
  httpClient.get('participants').then((response) => {
    participants.value = response.data;
  });
}
const save = async () => {
  loading.value = true
  const response = await httpClient.post('participants', participant.value)
  loading.value = false
  if (response.status === 201) {
    successAlert.value = true
    participant.value = {
      name: '',
      phone: '',
      guests: []
    }
    hideSuccessAlert()
    loadTable()
  } else {
    errorAlert.value = true
  }
}
const addGuest = () => {
  participant.value.guests.push({
    name: '',
    isKid: false
  })
}
const hideSuccessAlert = () => {
  setTimeout(() => {
    successAlert.value = false
  }, 10000)
}
const copyToClipboard = (name, id) => {
  toast.add({severity:'info', summary:`Link de ${name} copiado 🎉`, detail: `Agora é só colar no Whatsapp amor! 😘`, life: 15000});
  navigator.clipboard.writeText(id).then(() => {
    console.log('Link copiado')
  }, (err) => {
    console.error('Erro ao copiar link', err)
  });
}

</script>

<template>
  <header>
    <h1 class="site-heading text-center text-faded d-lg-block">
      <span class="site-heading-upper text-primary mb-3">Chegou a hora de comemoramos juntos!</span>
      <span class="site-heading-lower">Bianca 10 anos!</span>
    </h1>
  </header>

  <section class="page-section about-heading">
    <div class="container">
      <div class="about-heading-content">
        <div class="row">
          <div class="col-xl-9 col-lg-10 mx-auto">
            <div class="bg-faded rounded p-5">
              <h2 class="section-heading mb-4">
                <span class="section-heading-lower">Cadastre Convidados</span>
              </h2>
              <form @submit.prevent="save" >
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="name" v-model="participant.name" placeholder="Seu Nome">
                  <label for="name">Nome</label>
                </div>
                <div class="form-floating mb-3">
                  <button type="button" class="btn btn-outline-primary" @click="addGuest">
                    <em class="fa-solid fa-plus"></em> Add Acompanhante
                  </button>
                </div>
                <div v-for="guest in participant.guests" >
                  <div class="input-group mb-3 guests">
                    <div class="form-floating mb-3 col-8">
                      <input type="text" class="form-control" v-model="guest.name" id="guestName" placeholder="Acompanhante">
                      <label for="guestName">Nome do acompanhante</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input checkbox-xl" v-model="guest.isKid" type="checkbox">
                      <label class="form-check-label" style="padding-left: 8px">
                        Menor de 10 anos?
                      </label>
                    </div>
                    <div class="form-floating mb-3">
                      <button type="button" class="btn btn-outline-primary">
                        <FontAwesomeIcon :icon="fas.faTrash" />
                      </button>
                    </div>
                  </div>
                </div>
                <button class="btn btn-success col-12" type="submit">
                  Salvar
                  <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
                <small class="form-text text-success" v-if="successAlert" >Dados salvos com sucesso 🥳 </small>
                <small class="form-text text-danger" v-if="errorAlert" >Deu falha ao salvar os dados </small>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-faded rounded p-1 mt-5">
        <DataTable v-model:filters="filters" :value="participants" paginator :rows="10" tableStyle="min-width: 50rem"
                   :globalFilterFields="['name']" data-key="id">
          <template #header>
            <div class="flex justify-end">
              <IconField>
                <FontAwesomeIcon :icon="fas.faSearch" />
                <InputText v-model="filters['global'].value" placeholder="Buscar" />
              </IconField>
            </div>
          </template>
          <Column field="name" sortable header="Nome"></Column>
          <Column field="isConfirmed" sortable header="Confirmado">
            <template #body="row">
              <span v-if="row.data.isConfirmed" class="badge bg-success">Sim</span>
              <span v-else class="badge bg-danger">Não</span>
            </template>
          </Column>
          <Column header="Link">
            <template #body="row">
              <button @click="copyToClipboard(row.data.name, row.data.id)" class="btn btn-outline-primary">
                <FontAwesomeIcon :icon="fas.faCopy" />
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
  <footer class="footer text-faded text-center py-5">
    <div class="container"><p class="m-0 small">Feito com ❤️ pelo papai <a href="https://www.linkedin.com/in/🤓-jefferson-alves-reis-00007361/">jefaokpta</a> 2024 </p></div>
  </footer>
  <Toast />
</template>

