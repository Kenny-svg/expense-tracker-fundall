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
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('userToken');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});


  
export const useAuthStore = defineStore('auth', {
    state: () => ({
        userToken: sessionStorage.getItem('userToken') || null,
        status: { loggedIn: !!sessionStorage.getItem('userToken') },
        loading: false,
        user: null,
        isLoggedIn: false
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
            this.isLoggedIn = true
            try {
              const response = await apiClient.post('/login', values);
              const token = response.data.success.user.access_token;
          
              sessionStorage.setItem("userToken", token);
              this.userToken = token;
              this.status.loggedIn = true;
              this.isLoggedIn = true
              
              apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
              return Promise.resolve(response.data);
            } catch (error) {
              console.error("Login error:", error);
              return Promise.reject(error.response.data.error);
            } finally {
              this.loading = false;
            }
          },

          async getUserData() {
            this.loading = true;
            try {
              const response = await apiClient.get('/base/profile');
              if (response.data.success && response.data.success.status === "SUCCESS") {
                this.user = response.data.success.data;
                return Promise.resolve(this.user);
              } else {
                console.error("Invalid response:", response);
                return Promise.reject(new Error("Invalid response from server"));
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              return Promise.reject(error);
            } finally {
              this.loading = false;
            }
          },
          async sendExpensesData(date, total) {
      
            const payload = [
              {
                date: date,
                amount: total,
              }
            ];
      
            try {
              const response = await apiClient.post('/base/expense', payload);
            } catch (error) {
              console.error('Failed to send expenses data:', error);
              throw error;
            }
          },
       
          
          
        
        
          
    }
})