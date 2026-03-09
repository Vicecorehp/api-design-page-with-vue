<template>
    <section>
        <h2>子组件: {{ title }}</h2>
        <button @click="toggle">Toggle</button>
        <div v-if="hidden">子组件内容</div>
    </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    title: String,
    sayHello: Function,
});

if (props.sayHello) {
    props.sayHello();
}

// state
const hidden = ref<Boolean>(true);
// function
function sayHelloFromChild() {
    console.log('Hello from child');
}

// 暴露子组件信息
defineExpose({
    hidden,
    sayHelloFromChild,
});

function toggle() {
    hidden.value = !hidden.value;
}
</script>

<style scoped></style>