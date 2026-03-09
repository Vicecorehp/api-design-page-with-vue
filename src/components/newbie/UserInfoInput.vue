<template>
    <div class="child">
        <h4>子组件 - 编辑用户信息</h4>

        <!-- 方式1：直接修改整个对象 -->
        <el-input v-model="localUserInfo.name" placeholder="姓名" @input="updateUserInfo" />

        <el-input v-model.number="localUserInfo.age" type="number" placeholder="年龄" @input="updateUserInfo" />

        <el-input v-model="localUserInfo.email" placeholder="邮箱" @input="updateUserInfo" />

        <el-input v-model="localUserInfo.address" placeholder="地址" @input="updateUserInfo" />

        <!-- 显示当前编辑的值 -->
        <div class="preview">
            当前编辑：{{ localUserInfo }}
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 定义props接收父组件传递的对象
const props = defineProps({
    userInfo: {
        type: Object,
        default: () => ({})
    }
})

// 定义emits
const emit = defineEmits(['update:userInfo'])

// 创建本地副本，避免直接修改prop
const localUserInfo = ref({ ...props.userInfo })

// 监听props变化，更新本地数据
watch(() => props.userInfo, (newVal) => {
    localUserInfo.value = { ...newVal }
}, { deep: true })

// 更新父组件数据
const updateUserInfo = () => {
    emit('update:userInfo', { ...localUserInfo.value })
}
</script>