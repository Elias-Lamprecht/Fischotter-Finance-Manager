<template>
     <div class="management">
          <h2 class="management__page-title">User Management</h2>
          <div class="management__page-header">
               <button @click="showModal = true" class="management__button">
                    Create User
               </button>
               <div class="management__delete-group">
                    <form
                         @submit.prevent="
                              UserStore.DeleteManyUsers(UserStore.selectedUsers)
                         "
                    >
                         <button
                              type="submit"
                              class="management__delete-button management__button"
                         >
                              Delete Selected Users
                         </button>
                    </form>
                    <form @submit.prevent="UserStore.DeleteDisabledUsers()">
                         <button
                              type="submit"
                              class="management__delete-button management__button"
                         >
                              Delete Disabled Users
                         </button>
                    </form>
                    <DeleteAllUsersForm />
               </div>
          </div>
          <div class="management__count-page-wrapper">
               <div class="management__count-wrapper">
                    <p>Total Users: {{ UserStore.totalUsers }}</p>
                    <p>Selected Users: {{ UserStore.selectedUsers.length }}</p>
               </div>
          </div>
          <div class="EntityList">
               <div class="EntityList__grid">
                    <div class="EntityList__row EntityList__row--user">
                         <div class="EntityList__header"><b>Select</b></div>
                         <div class="EntityList__header"><b>ID</b></div>
                         <div class="EntityList__header"><b>Username</b></div>
                         <div class="EntityList__header">
                              <b>Displayname</b>
                         </div>
                         <div class="EntityList__header"><b>Email</b></div>
                         <div class="EntityList__header"><b>Role</b></div>
                         <div class="EntityList__header"><b>Status</b></div>
                         <div class="EntityList__header"><b>Created At</b></div>
                         <div class="EntityList__header"><b>Actions</b></div>
                    </div>
                    <div
                         v-for="user in UserStore.users"
                         :key="user.id"
                         class="EntityList__row EntityList__row--user"
                         :class="{
                              selected: UserStore.selectedUsers.includes(
                                   user.id,
                              ),
                         }"
                    >
                         <div class="EntityList__list-item">
                              <input
                                   type="checkbox"
                                   :value="user.id"
                                   v-model="UserStore.selectedUsers"
                              />
                         </div>
                         <div class="EntityList__list-item">
                              <div class="input-wrapper">
                                   <input
                                        type="text"
                                        :value="user.id"
                                        disabled
                                   />
                              </div>
                         </div>
                         <div class="EntityList__list-item">
                              <input type="text" v-model="user.username" />
                         </div>
                         <div class="EntityList__list-item">
                              <input type="text" v-model="user.displayname" />
                         </div>
                         <div class="EntityList__list-item">
                              <input type="text" v-model="user.email" />
                         </div>
                         <div class="EntityList__list-item">
                              <select v-model="user.role">
                                   <option value="user">user</option>
                                   <option value="admin">admin</option>
                              </select>
                         </div>
                         <div class="EntityList__list-item">
                              <input type="checkbox" v-model="user.status" />
                         </div>
                         <div
                              class="EntityList__list-item EntityList__list-date-item"
                         >
                              {{
                                   new Date(user.created_at).toLocaleString(
                                        'en-UK',
                                        {
                                             year: 'numeric',
                                             month: 'long',
                                             day: 'numeric',
                                             hour: '2-digit',
                                             minute: '2-digit',
                                        },
                                   )
                              }}
                         </div>
                         <div class="EntityList__actions EntityList__list-item">
                              <button
                                   @click="UserStore.UpdateUser(user.id, user)"
                                   class="management__button management__update-button"
                              >
                                   <Upload class="icon" :size="20" />
                              </button>
                              <button
                                   @click="UserStore.DeleteUser(user.id)"
                                   class="management__button management__delete-button"
                              >
                                   <Trash class="icon" :size="20" />
                              </button>
                         </div>
                    </div>
               </div>
          </div>
          <nav class="management__page-control">
               <div>
                    <button
                         @click="PreviousPage"
                         :disabled="page === 1"
                         class="management__button"
                    >
                         Previous Page
                    </button>
               </div>
               <p class="management__page-control__current-page">{{ page }}</p>
               <div>
                    <button
                         @click="NextPage"
                         :disabled="page === UserStore.lastPage"
                         class="management__button"
                    >
                         Next Page
                    </button>
               </div>
          </nav>
          <CreateNewUserForm v-model:show="showModal" />
     </div>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
import { Trash, Upload } from 'lucide-vue-next';
import { useUserStore } from '@/stores/users';

const UserStore = useUserStore();

// COMPONENTS
import DeleteAllUsersForm from '@/components/management/users/DeleteAllUsersForm.vue';
import CreateNewUserForm from '@/components/management/users/CreateNewUserForm.vue';

const pageInput = ref(1);
let page = 1;

const showModal = ref(false);

onMounted(() => UserStore.fetchPagenizedUsers());

async function NextPage() {
     if (page < UserStore.lastPage) {
          page++;
          pageInput.value = page;
          await UserStore.fetchPagenizedUsers(page, 10);
     }
}

async function PreviousPage() {
     if (page > 1) {
          page--;
          pageInput.value = page;
          await UserStore.fetchPagenizedUsers(page, 10);
     }
}

async function GoToPage(page: number) {
     if (page < 1) return;
     if (page > UserStore.lastPage) return;

     page = pageInput.value;
     await UserStore.fetchPagenizedUsers(page, 10);
}
</script>
