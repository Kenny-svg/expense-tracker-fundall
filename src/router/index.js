import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import UserProfile from '../views/UserProfile.vue'
import Dashboard from '../views/Dashboard.vue'
import HomePage from "../views/HomePage.vue"
import NotFound from "../views/NotFound.vue"
import { useAuthStore } from '../store/authStore'

const routes = [
  {path: "/", component: HomePage, name: 'Home'},
  { path: '/signup', component: SignUp, name: 'Signup' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/profile', component: UserProfile, name: 'Ptofile' },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true }, },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.status.loggedIn) {
    next({ name: 'Login' });
  } else {
    next(); 
  }
});
export default router
