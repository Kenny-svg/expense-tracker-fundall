<script setup>
import { ref, computed, onMounted } from 'vue';

const defaultExpenses = [
  { id: 1, description: 'Groceries', amount: 95.20, date: '2024-02-01' },
];

const expenses = ref([]);

const pageSize = ref(5);
const currentPage = ref(1);

const fetchExpensesFromSession = () => {
  const storedDataString = sessionStorage.getItem('savedExpenses');
  if (storedDataString) {
    try {
      const parsedData = JSON.parse(storedDataString);
      if (parsedData && parsedData.expenses) {
        expenses.value = parsedData.expenses.map(expense => ({
          ...expense,
          amount: parseFloat(expense.amount.replace(/,/g, '')) ,
          date: expense.date
        }));
      } else {
        console.error('Expenses data is not in the expected format');
        expenses.value = defaultExpenses;
      }
    } catch (error) {
      console.error('Error parsing expenses data from sessionStorage:', error);
      expenses.value = defaultExpenses;
    }
  } else {
    expenses.value = defaultExpenses;
  }
};


onMounted(() => {
  fetchExpensesFromSession();
});

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return expenses.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(expenses.value.length / pageSize.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>


<template>
    <div class="flex w-full md:w-[70%]">
      <div class="border shadow-custom w-full mt-5 mx-auto p-4 ">
        <!-- Expenses Table -->
        <div class="overflow-x-auto relative">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-700">
              <tr>
                <th></th>
                <th scope="col" class="py-3 px-6">Date</th>
                <th scope="col" class="py-3 px-6">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(expense, index) in paginatedExpenses" :key="expense.id" class="bg-white border-b">
            <td><div class="bg-primary rounded-full h-3 w-3 "></div></td>
            <td class="py-4 px-6">{{ expense.date }}</td>
                <td class="py-4 px-6 text-primary">{{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(expense.amount) }}</td>

              </tr>
            </tbody>
          </table>
        </div>
    
        <!-- Pagination Controls -->
        <div class="flex justify-center mt-4 items-center">
            <span class="mx-2"> <span class="border p-1 rounded">{{ currentPage }}</span> of  <span class="border p-1 rounded">{{ totalPages }}</span></span>
          <button
            @click="previousPage"
            :disabled="currentPage <= 1"
            class="h-5 w-5 items-center flex justify-center rounded-full bg-primary text-white  disabled:bg-gray-300"
          >
            &lt;
          </button>
          
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="h-5 w-5 items-center flex justify-center rounded-full mx-1 bg-primary text-white  disabled:bg-gray-300"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </template>
  
