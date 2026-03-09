<template>
    <div class="parent">
        <h3>父组件</h3>
        <div>用户信息：</div>
        <pre>{{ JSON.stringify(userInfo, null, 2) }}</pre>

        <!-- 传递整个对象 -->
        <UserInfoInput v-model:user-info="userInfo" />

        <!-- 或者分别传递对象属性 -->
        <UserInfoInput v-model:name="userInfo.name" v-model:age="userInfo.age" v-model:email="userInfo.email" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import UserInfoInput from '@/components/newbie/UserInfoInput.vue'

// 父组件的对象数据
const userInfo = ref({
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    address: '北京市'
})
</script>