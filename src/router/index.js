import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import UserProfile from '../views/UserProfile.vue'
import Dashboard from '../views/Dashboard.vue'
import HomePage from "../views/HomePage.vue"
import NotFound from "../views/NotFound.vue"

const routes = [
  {path: "/", component: HomePage},
  { path: '/signup', component: SignUp },
  { path: '/login', component: Login },
  { path: '/profile', component: UserProfile },
  { path: '/dashboard', component: Dashboard },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
