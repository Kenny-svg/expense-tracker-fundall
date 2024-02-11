import {defineStore} from "pinia"
import axios from "axios"

const userToken = sessionStorage.getItem('userToken')
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_EXPENSE_TRACKER_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${userToken}` 
    }
});



  
export const useAuthStore = defineStore('auth', {
    state: () => ({
        userToken: localStorage.getItem('userToken') || null,
        status: { loggedIn: !!localStorage.getItem('userToken') },
        email: null,
        loading: false,
      }),

    actions: {
        async register(values) {
            this.loading = true; 
            try {
              const response = await apiClient.post('/register', values);
              return Promise.resolve(response);
            } catch (error) {
              return Promise.reject(error.response.data.error);
            } finally {
              this.loading = false; 
            }
          },
          async login(values) {
            this.loading = true;
            try {
              const response = await apiClient.post('/login', values);
              
              const token = response.data.success.user.access_token;
              console.log("Login success, token:", token);
              
              localStorage.setItem("userToken", token); 
              
              this.userToken = token;
              this.status.loggedIn = true;
              
              return Promise.resolve(response.data);
            } catch (error) {
              console.error("Login error:", error);
              return Promise.reject(error.response.data.error);
            } finally {
              this.loading = false;
            }
          }
          
    }
})