<script setup>
import Container from '../components/Container.vue';
import DashboardPic from "../assets/dashboard.svg"
import PaginatedTables from "../components/PaginatedTables.vue"
import { reactive, ref, watch, onMounted, computed } from "vue"
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from '../store/authStore'
import Datepicker from 'vue3-datepicker'

import { useExpensesStorage } from "../compossables/useExpensesStorage"



const targetExpenses = ref(''); 
const actualExpenses = computed(() => {
  return parseFloat(totalExpenses.value.replace(/,/g, '')) || 0;
});
const targetExpensesNumeric = computed(() => parseFloat(targetExpenses.value.replace(/,/g, '')) || 0);

const fillPercentage = computed(() => {
  if (targetExpensesNumeric.value === 0) return 0; 
  const percentage = (actualExpenses.value / targetExpensesNumeric.value) * 100;
  return Math.min(percentage, 100); 
});
console.log(fillPercentage)

const { picked, formattedTargetExpenses, expenseItem2, expenseItem4, expenseItem6, saveExpenses } = useExpensesStorage();


const expensesData = ref({}); // Initialize your reactive variable

const storedDataString = sessionStorage.getItem('savedExpenses'); // Retrieve the string from sessionStorage
console.log('Stored Data String:', storedDataString); // Logging the retrieved string

if (storedDataString) {
  try {
    // Attempt to parse the stored string into a JavaScript object
    expensesData.value = JSON.parse(storedDataString);
  } catch (error) {
    // Log error if parsing fails
    console.error('Error parsing expenses data from sessionStorage:', error);
    // Handle the error (e.g., resetting expensesData to default or showing an error message)
    expensesData.value = {}; // Resetting to default if parsing fails
  }
} else {
  console.log('No expenses data found in sessionStorage.');
}
const inputFocus = reactive({
  targetExpenses: false,
  date: false,
});

const onFocus = (fieldName) => {
  inputFocus[fieldName] = true;
};

const onBlur = (fieldName) => {
  inputFocus[fieldName] = false;
};

const labelColor = (fieldName) => inputFocus[fieldName] ? "#4CE895" : "";

const schema = yup.object().shape({
  targetExpenses: yup.string().required("Target Monthly Expenses is required"),
  date: yup.string().required("Date is required"),
});


watch(formattedTargetExpenses, (newValue, oldValue) => {
  const newValueWithoutCommas = newValue.replace(/,/g, '');
  const parsedValue = parseInt(newValueWithoutCommas, 10);
  if (!isNaN(parsedValue)) {
    formattedTargetExpenses.value = parsedValue.toLocaleString();
  }
});

const authStore = useAuthStore();
const loading = ref(true);

onMounted(async () => {
  try {
    await authStore.getUserData();
    loading.value = false;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});



function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}



// Function to format and update the value
function formatAndSetValue(value, setValue) {
  const numericValue = parseFloat(value.replace(/,/g, ''));
  if (!isNaN(numericValue)) {
    setValue(numericValue.toLocaleString());
  }
}

const debouncedFormatValue2 = debounce((value) => formatAndSetValue(value, v => expenseItem2.value = v), 300);
const debouncedFormatValue4 = debounce((value) => formatAndSetValue(value, v => expenseItem4.value = v), 300);
const debouncedFormatValue6 = debounce((value) => formatAndSetValue(value, v => expenseItem6.value = v), 300);

watch(expenseItem2, newValue => debouncedFormatValue2(newValue));
watch(expenseItem4, newValue => debouncedFormatValue4(newValue));
watch(expenseItem6, newValue => debouncedFormatValue6(newValue));


const totalExpenses = computed(() => {
  const total = [expenseItem2.value, expenseItem4.value, expenseItem6.value]
    .reduce((accumulator, currentValue) => {
      const parsedValue = parseFloat(currentValue.replace(/,/g, ''));
      return accumulator + (isNaN(parsedValue) ? 0 : parsedValue);
    }, 0);
  
  return total.toLocaleString();
});
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  let day = date.getDate();
  let month = date.getMonth() + 1; 
  let year = date.getFullYear().toString().substr(-2); 

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  return `${month}/${day}/${year}`;
}

const formattedPickedDate = computed(() => formatDate(picked.value));


watch(formattedPickedDate, (newPicked, oldPicked) => {
    console.log('Date picked:', newPicked);
    console.log(totalExpenses.value)
  
    authStore.sendExpensesData(newPicked, 200)
      .then(() => {
        console.log('Data sent successfully');
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
}, { deep: true });

//file upload

const imageSrc = ref(null);

// Handle file upload and set image source for preview
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Directly update imageSrc with the loaded data URL
      imageSrc.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please upload an image file.');
  }
};
  const handleSubmit = () => {
   if(files.value){
    const formData = new FormData();
    formData.append(`YOUR_KEY`, files.value);
   
    fetch('YOUR_ENDPOINT_URL', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
      }
   }
   const isLoggedIn = computed(() => authStore.isLoggedIn);



const user = computed(() => authStore.user);
</script>

<template>
  <div class="md:h-screen flex items-center justify-center pb-10 pt-20 my-20 ">
    <Container>
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="mt-20 hidden md:block">
            <div class="flex gap-5">
                <div class="flex flex-col justify-center items-center">
    <!-- Upload container -->
    <label class="bg-gray-300 p-8 rounded-lg cursor-pointer relative overflow-hidden">
      <!-- Conditionally display upload instructions or the image -->
      <div v-if="!imageSrc" class="absolute inset-0 flex flex-col justify-center items-center">
        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
  <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
</svg>
</span>
      </div>
      <img v-if="imageSrc" :src="imageSrc" class="absolute inset-0 w-full h-full object-cover" alt="Uploaded image preview" />
      <input type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
    </label>
  </div>

                        <div>
                    <h1 class="text-xl text-[#30443C] font-bold">{{user?.firstname}} {{ user?.lastname }}</h1>
                    <h2>{{ user?.email }}</h2>
                </div>
            </div>
            <div class="mt-10">
                <h1 class="text-xl text-[#30443C]">Target Monthly Expenses</h1>
                <h2 class="font-bold text-[#30443C] mt-4 text-xl">&#8358;<span>{{ expensesData?.targetExpenses }}</span></h2>
            <div class="w-full md:w-[70%] bg-gray-200 rounded-full dark:bg-gray-700 mt-4">
            <div  class="bg-primary text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-l-full" :style="{ width: `${fillPercentage}%` }"></div>
            </div>
            
        </div>
        <div class="flex justify-sart mt-4">

            <PaginatedTables />
        </div>
        </div>
        <div class="bg-[#F2F3F7] border px-5 py-10 rounded relative shadow-custom">
          <div class="flex justify-between bg-white rounded p-3 relative">
            <div>
              <h1 class="text-primary font-bold text-xl">Welcome back, <span class="text-black"> {{ user?.firstname }}</span> </h1>
              <p class="text-sm text-[#30443C]">Now, let’s get your expenses for this month</p>
            </div>
            <div>
              <img :src="DashboardPic" class=" absolute md:block hidden right-2 -mt-10 w-34 h-24" />
            </div>
          </div>
          <div>
            <Form :validation-schema="schema" class="ml-4">
              <div>
                <label class="block mb-2 text-sm font-bold mt-7" :style="{ color: labelColor('targetExpenses') }">Target Monthly Expenses</label>

                <Field
                  @focus="() => onFocus('targetExpenses')"
                  @blur="() => onBlur('targetExpenses')"
                  placeholder="123,456"
                  v-model="formattedTargetExpenses"
                  name="targetExpenses"
                  type="tel"
                  class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-[75%] mt-2 p-2.5"
                />
                <ErrorMessage class="text-red-500" name="targetExpenses" />
              </div>

              <div>
                <label class="block mb-2 text-sm font-bold mt-7" :style="{ color: labelColor('date') }">Date</label>

                <datepicker
                    v-model="picked"
                    class="order border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-[75%] mt-2 p-2.5"
                    
                />
              </div>
              <div class="mt-5">

                  <label >Today's Expenses</label>
              </div>

<div class="flex gap-4 ">
        <Field
          @focus="() => onFocus('item1')"
          @blur="() => onBlur('item1')"
          placeholder="Pizza"
          name="item1"
          type="text"
          class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-full mt-2 p-2.5"
        />
        <ErrorMessage class="text-red-500" name="item1" />

        <Field
          @focus="() => onFocus('item2')"
          @blur="() => onBlur('item2')"
          placeholder="10,000"
          v-model="expenseItem2"
          name="item2"
          type="tel"
          class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-[70%] mt-2 p-2.5"
        />
        <ErrorMessage class="text-red-500" name="item2" />
      </div>

      <div class="flex gap-4 ">
        <Field
          @focus="() => onFocus('item3')"
          @blur="() => onBlur('item3')"
          placeholder="Textbook"
          name="item3"
          type="text"
          class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-full mt-2 p-2.5"
        />
        <ErrorMessage class="text-red-500" name="item3" />

        <Field
          @focus="() => onFocus('item4')"
          @blur="() => onBlur('item4')"
          placeholder="10,000"
          v-model="expenseItem4"
          name="item4"
          type="tel"
          class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-[70%] mt-2 p-2.5"
        />
        <ErrorMessage class="text-red-500" name="item4" />
      </div>


      <div class="flex gap-4 ">
        <Field
          @focus="() => onFocus('item5')"
          @blur="() => onBlur('item5')"
          placeholder="Tuition fee"
          name="item5"
          type="text"
          class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-full mt-2 p-2.5"
        />
        <ErrorMessage class="text-red-500" name="item5" />

        <Field
          @focus="() => onFocus('item6')"
          @blur="() => onBlur('item6')"
          placeholder="10,000"
          v-model="expenseItem6"
          name="item6"
          type="tel"
          class="border border-secondary text-[#30443C] text-sm rounded focus:ring-primary focus:border-primary block w-[70%] mt-2 p-2.5"
        />
        <ErrorMessage class="text-red-500" name="item6" />
      </div>
      <div class="flex gap-2 justify-end items-center mt-4">
        <span class="font-bold">Total Actual Expenses: &#x20A6;</span><input class="w-[20%]" :value="totalExpenses" readonly type="text" />
      </div>
      <div class="flex justify-center">
          <button @click="saveExpenses" class="bg-primary font-bold px-4 py-1 rounded-md mt-4">SAVE TODAY’S EXPENSES</button>
      </div>
            </Form>
          </div>
        </div>
        <div class="mt-20 md:hidden block">
            <div class="flex gap-5">
                <div class="bg-gray-300 p-8 rounded-lg">A1</div>
                <div>
                    <h1 class="text-xl text-[#30443C] font-bold">{{user?.firstname}} {{ user?.lastname }}</h1>
                    <h2>{{ user?.email }}</h2>
                </div>
            </div>
            <div class="mt-10">
                <h1 class="text-xl text-[#30443C]">Target Monthly Expenses</h1>
                <h2 class="font-bold text-[#30443C]">789,000</h2>
            <div class="w-full md:w-[70%] bg-gray-200 rounded-full dark:bg-gray-700">
            <div class="bg-primary text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-l-full" style="width: 30%"></div>
            </div>
            
        </div>
        <div class="flex justify-sart mt-4">

            <PaginatedTables />
        </div>
        </div>
      </div>
    </Container>
  </div>
</template>
