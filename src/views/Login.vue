<script setup>
import { reactive, ref, computed } from 'vue';
import Container from '../components/Container.vue';
import MainPageIcon from "../assets/Group.svg";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import {useAuthStore} from "../store/authStore.js"
import { notify } from "@kyvg/vue3-notification";
import { useRouter } from 'vue-router';


const authStore = useAuthStore()

const router = useRouter();

const password = ref('');
const isLoading = computed(() => authStore.loading);

//login logic here
const login = async (values) => {
      try {
        const response = await authStore.login(values);
            notify({
              title: "Success",
              text: "You are logged in!",
              type: "success",
            });
            router.push('/dashboard');

      } catch (error) {
        notify({
          title: "Failed",
          text: error.message,
          type: "error",
        });

      }
    };

const inputFocus = reactive({
  email: false,
  password: false,
});

// Function to set focus state true
const onFocus = (fieldName) => {
  inputFocus[fieldName] = true;
};

// Function to reset focus state
const onBlur = (fieldName) => {
  inputFocus[fieldName] = false;
};

// Function to get color based on focus state
const labelColor = (fieldName) => inputFocus[fieldName] ? "#4CE895" : "";


const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

});



</script>


<template>
    <div class="h-screen flex items-center justify-center pb-10 pt-10">
    <Container>
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 items-center ">
            <div class="hidden md:flex items-center justify-center">
                <div class="w-[50%]">
                    <img class="w-[60%] mt-20 mx-auto" :src="MainPageIcon" />
                    <p class="font-extrabold text-3xl  mx-auto mt-10"><span class="text-primary">Welcome back! </span>We miss you.</p>
                    
                </div>
            </div>
            <div class="">
                <Form @submit="login" :validation-schema="schema" class="border md:mt-0 mt-2 h-auto pt-8 items-center justify-center flex shadow-custom flex-col rounded">
                    <div class="justify-center w-[80%]">
                        <h1 class="text-[#1B2420] font-bold text-xl">Holla</h1>
                        <p class="text-[#30443C]">Sign in to the vibe!</p>
                    <div class="mb-6 mt-10">
                        <label :style="{ color: labelColor('email') }" class="block mb-2 text-sm font-bold"
                            >Email address</label
                        >
                        <Field
                        @focus="() => onFocus('email')"
                            @blur="() => onBlur('email')"
                        placeholder="Enter Email"
                            name="email"
                            type="email"
                            class=" border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5"
                        />
                        <ErrorMessage class="text-red-500" name="email" />
                        </div>

                        <div class="mb-6">
                        <label :style="{ color: labelColor('password') }" class="block mb-2 text-sm font-bold"
                            >Password</label
                        >
                        <Field
                        v-model="password"
                        @focus="() => onFocus('password')"
                            @blur="() => onBlur('password')"
                        placeholder="Enter Password"
                             name="password"
                            type="password"
                            class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5"
                        />
                        <ErrorMessage class="text-red-500" name="password" />
                        </div>
 
                       
                        <button type="submit" class="btn-primary rounded-md bg-primary text-lack font-bold uppercase w-full mb-2c py-4">

                            <span v-if="isLoading">Logging in...</span>
                            <span v-else>Log In</span>
                            </button>
                            <p class="text-center mt-5 mb-5">Don't have an account?<router-link to="signup" class="text-primary ">Register Here</router-link></p>
                            </div>
                              
                    </Form>
                    <div class="">
                                <p class="text-secondary text-center mt-5">By clicking on Login, you agree to our <span class="text-primary"><router-link to="#">Terms & Conditions and Privacy Policy.</router-link></span></p>
                            </div>
                    
                  
            </div>
        </div>
    </Container>
</div>
</template>