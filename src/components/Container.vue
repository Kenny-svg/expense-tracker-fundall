
<script setup>
import Logo from "../assets/Fundall-Logo.svg";

</script>
<template>
    
    <div class="bg-white w-[90%] h-auto mx-auto rounded-md lg:rounded-[40px] border border-b-2 shadow p-4 lg:p-12 border-slate-300">
        <img class="md:w-20 md:p-0 p-2 w-24 absolute" :src="Logo" />
      <slot></slot> 
    </div>

  </template>
  