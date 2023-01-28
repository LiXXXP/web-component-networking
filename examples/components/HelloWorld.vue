<script setup lang="ts">
import { ref } from 'vue'
import UserApi, { User } from '../apis/user'
import { Response } from '~/components/index'

defineProps({
  msg: String
})

const count = ref(0)

async function testGetRequest() {
  const response: Response<User> = await UserApi.getTest({ userId: '1000001' })
  console.log(response)
}

async function testPostRequest() {
  const response: Response<User> = await UserApi.postTest({
    beginTime: '2022-02-01 00:00:00',
    endTime: '2022-02-28 23:59:59',
    plateNo: ''
  })
  console.log(response)
}

async function testAdminPostRequest() {
  const response: Response<User> = await UserApi.adminPostTest({
    beginTime: '2022-02-01 00:00:00',
    endTime: '2022-02-28 23:59:59',
    plateNo: ''
  })
  console.log(response)
}

async function testPostRequest401() {
  const response: Response<User> = await UserApi.postTest401({ userId: '1000001' })
  console.log(response)
}

async function testPostRequest403() {
  const response: Response<User> = await UserApi.postTest403({ userId: '1000001' })
  console.log(response)
}

async function testPostRequestErrorCode1() {
  const response: Response<User> = await UserApi.postTestErrorCode1({ userId: '1000001' })
  console.log(response)
}

async function testPostRequestErrorCode9() {
  const response: Response<User> = await UserApi.postTestErrorCode9({ userId: '1000001' })
  console.log(response)
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"> Vite Documentation </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <button @click="testGetRequest">get请求</button>
  <button @click="testPostRequest">post请求</button>
  <button @click="testAdminPostRequest">admin post请求</button>
  <button @click="testPostRequest401">401 post请求</button>
  <button @click="testPostRequest403">403 post请求</button>
  <button @click="testPostRequestErrorCode1">ErrorCode1 Post</button>
  <button @click="testPostRequestErrorCode9">ErrorCode9 Post</button>
</template>
<style scoped>
a {
  color: #42b983;
}
</style>
