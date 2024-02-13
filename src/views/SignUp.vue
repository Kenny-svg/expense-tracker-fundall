<script setup>
import { reactive, ref, computed } from 'vue';
import Container from '../components/Container.vue';
import MainPageIcon from "../assets/mainpage-icon.svg";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import {useAuthStore} from "../store/authStore.js"
import { notify } from "@kyvg/vue3-notification";
import { useRouter } from 'vue-router';


const authStore = useAuthStore()

const router = useRouter();

const password = ref('');
const password_confirmation = ref('');
const validated = ref(false);
let validationMsg = ref("");
let isValid = ref(true)
const isLoading = computed(() => authStore.loading);

//registeration logic here
const signUp = async (values) => {
  validated.value = false;
  validationMsg.value = '';

  if (password.value === password_confirmation.value) {
    try {
      const response = await authStore.register(values);
      // If registration is successful, display a success notification and redirect
      notify({
        title: "Success",
        text: "Registration successful, please login",
        type: "success",
      });

      validated.value = true; // Set validated to true on successful registration
      router.push("/login"); // Redirect to the login page
    } catch (error) {
      // Handle any errors that occur during registration
      validationMsg.value = error.message || "An unexpected error occurred.";
      notify({
        title: "Failed",
        text: validationMsg.value,
        type: "error",
      });
    }
  } else {
    // Handle the case where passwords do not match
    validationMsg.value = "Passwords do not match.";
    notify({
      title: "Failed",
      text: validationMsg.value,
      type: "error",
    });
  }
};
const inputFocus = reactive({
  firstname: false,
  lastname: false,
  email: false,
  password: false,
  confirm_password: false
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
  firstname: yup.string().required("First Name is required"),
  lastname: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

});

const passwordsMatch = computed(() => {
  const match = password.value && password_confirmation.value && password.value === password_confirmation.value;
  isValid.value = match; 
  return match;
});

</script>


<template>
    <div class="md:h-screen flex items-center justify-center my-0 pb-10 pt-20 md:my-20">
    <Container>
        <div class="grid grid-cols-1 gap-10 mt-14 lg:mt-0 md:grid-cols-2 items-center ">
            <div class="hidden md:flex items-center justify-center">
                <div class="w-full md:w-[55%]">
                    <img class="md:w-[60%] mt-20 mx-auto" :src="MainPageIcon" />
                    <p class="font-extrabold text-3xl  mx-auto mt-10"><span class="text-primary">Welcome! </span>Let's get to know you.</p>
                    <p class="mx-auto mt-5 font-bold">Your first step toward a better financial lifestyle starts here.</p>
                </div>
            </div>
            <div class="">
                <Form @submit="signUp" :validation-schema="schema" class="border md:mt-0 mt-2 h-auto pt-8 items-center justify-center flex shadow-custom flex-col rounded">
                    <div class="lg:w-[80%] w-[90%] ">
                    <div class="flex gap-10 mb-6">
                        <div>
                            <label class="block mb-2 text-sm font-bold" :style="{ color: labelColor('firstname') }">First Name</label>
                            <Field
                            @focus="() => onFocus('firstname')"
                            @blur="() => onBlur('firstname')"
                             placeholder="Enter First Name"
                                name="firstname"
                                type="text"
                                class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-full px-4 p-2.5"
                            />
                            <ErrorMessage class="text-red-500" name="firstname" />
                        </div>
                        <div>

                            <label class="block mb-2 text-sm font-bold" :style="{ color: labelColor('lastname') }" >Last Name</label>
                            <Field
                            @focus="() => onFocus('lastname')"
                            @blur="() => onBlur('lastname')"
                             placeholder="Enter Last Name"
                                name="lastname"
                                type="text"
                                class=" border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary px-4 block w-full p-2.5"
                            />
                            <ErrorMessage class="text-red-500" name="lastname" />
                        </div>
                    </div>
                    <div class="mb-6">
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
 
                        <div class="mb-6">
                        <label  :style="{ color: labelColor('password_confirmation') }" class="block mb-2 text-sm font-bold "
                            >Comfirm Password</label
                        >
                        <Field
                        @focus="() => onFocus('password_confirmation')"
                            @blur="() => onBlur('password_confirmation')"
                        placeholder="Comfirm Password"
                            name="password_confirmation"
                            type="password"
                            v-model="password_confirmation"
                            class=" border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5"
                        />
                        <p v-if="!passwordsMatch && password_confirmation" class="text-red-500">Passwords do not match.</p>
                        </div>
                        <button type="submit" class="btn-primary rounded-md bg-primary text-lack font-bold uppercase w-full mb-2c py-4">
                            
                            <span v-if="isLoading">Registering...</span>
                            <span v-else>Sign up</span>
                            </button>
                            <p class="text-center mt-5 mb-5">Already have an account?<router-link to="/login" class="text-primary font-bold">Login Here</router-link></p>
                            </div>
                              
                    </Form>
                    <div class="flex justify-center">
                                <p class="text-secondary text-center w-[70%] mt-5">By clicking on Login, you agree to our <span class="text-primary"><router-link to="#">Terms & Conditions and Privacy Policy.</router-link></span></p>
                            </div>
                    
                  
            </div>
        </div>
    </Container>
</div>
</template>