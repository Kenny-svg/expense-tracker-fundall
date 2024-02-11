<script setup>
import MainPageIcon from "../assets/mainpage-icon.svg"
import Container from "../components/Container.vue"
</script>
<template>
    <div class="h-screen flex items-center justify-center pb-10 pt-10">
        <Container>
                <header class="flex justify-end items-center">
                   
                <div class="flex gap-2 md:gap-4 items-center">
                    <router-link to="/login" class="font-bold text-xs md:text-sm">LOG IN</router-link>
                    <router-link to="/signup" class="font-bold bg-primary pl-3 pr-3 py-2 rounded-xl text-xs md:text-sm">SIGN UP</router-link>
                </div>
                </header>
                <main class="flex justify-between items-center flex-col py-14">
                    <img class="md:w-[14%]" :src="MainPageIcon" />
                    <h1 class="mt-14 font-bold text-2xl">Fundall Expense Tracker</h1>
                    <p class="text-xl mt-2 font-bold">Mini Project Frontend</p>
                    <p class="mt-5 font-bold">by Fagbenro Kehinde</p>
                </main>
        </Container>
    </div>
</template>