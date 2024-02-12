import { ref,watch, computed } from 'vue';
import { notify } from "@kyvg/vue3-notification";
import { useRouter } from 'vue-router';
const router = useRouter()

export function useExpensesStorage() {
  const picked = ref(new Date());
  const formattedTargetExpenses = ref('');
  const expenseItem2 = ref('');
  const expenseItem4 = ref('');
  const expenseItem6 = ref('');
  

  

  const formattedPickedDate = computed(() => {
    const date = picked.value;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear().toString().substr(-2);
  
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
  
    return `${month}/${day}/${year}`;
  });

  const totalExpenses = computed(() => {
    const total = [expenseItem2.value, expenseItem4.value, expenseItem6.value]
      .reduce((accumulator, currentValue) => {
        const parsedValue = parseFloat(currentValue.replace(/,/g, ''));
        return accumulator + (isNaN(parsedValue) ? 0 : parsedValue);
      }, 0);
    
    return total.toLocaleString();
  });
  

  const saveExpenses = () => {
    // Parse values to numbers for comparison and calculations
    const targetExpensesNumeric = parseFloat(formattedTargetExpenses.value.replace(/,/g, ''));
    let totalExpensesNumeric = parseFloat(totalExpenses.value.replace(/,/g, ''));
    
    if (!isFormValid.value) {
      notify({
        title: "Failed",
        text: "Please fill all the fields before saving.",
        type: "error",
      });
      return;
    }
  
    // Retrieve existing data to check for previously saved target and date
    const existingDataRaw = sessionStorage.getItem('savedExpenses');
    let existingData = existingDataRaw ? JSON.parse(existingDataRaw) : {};
  
    // If targetExpenses and date are already set, use those; otherwise, use current input
    let savedTargetExpenses = existingData.targetExpenses ? existingData.targetExpenses : targetExpensesNumeric;
    let savedDate = existingData.date ? existingData.date : formattedPickedDate.value;
  
    // Calculate new total expenses by adding today's expenses to previously saved total expenses
    totalExpensesNumeric += existingData.totalExpenses ? parseFloat(existingData.totalExpenses.replace(/,/g, '')) : 0;
  
    // Prevent saving if today's expenses exceed the target expenses
    if (savedTargetExpenses < totalExpensesNumeric) {
      notify({
        title: "Error",
        text: "Total expenses exceed the target monthly expenses.",
        type: "error",
      });
      return;
    }
  
    // Prepare data object to save
    const expensesDataToSave = {
      date: savedDate,
      targetExpenses: savedTargetExpenses.toString(),
      expenses: [...(existingData.expenses || []), ...[
        { item: 'Item 1', amount: expenseItem2.value },
        { item: 'Item 2', amount: expenseItem4.value },
        { item: 'Item 3', amount: expenseItem6.value }
      ]],
      totalExpenses: totalExpensesNumeric.toString()
    };
  
    // Save the updated data back to sessionStorage
    sessionStorage.setItem('savedExpenses', JSON.stringify(expensesDataToSave));
    
    notify({
      title: "Success",
      text: "Expenses saved successfully.",
      type: "success",
    });
  
    // Reload or update UI as needed
    window.location.reload();
  };
  
  

  const isFormValid = ref(false);

  // Watcher to check form validity
  watch([formattedTargetExpenses, expenseItem2, expenseItem4, expenseItem6, formattedPickedDate], () => {
    isFormValid.value = formattedTargetExpenses.value.trim() !== '' &&
                        expenseItem2.value.trim() !== '' &&
                        expenseItem4.value.trim() !== '' &&
                        expenseItem6.value.trim() !== '' &&
                        formattedPickedDate.value.trim() !== '';
  }, { immediate: true }); 


  return { picked, formattedTargetExpenses, expenseItem2, expenseItem4, expenseItem6, saveExpenses,};
}

