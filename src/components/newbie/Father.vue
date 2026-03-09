<template>
    <section>
        <h2>父组件</h2>
        <button @click="toggleFromFather">Toggle From Father</button>
        <Child :title="title" :sayHello="sayHelloFromParent" ref="childRef" />
    </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Child from './Child.vue';

// state
const title = ref<string>('Banner');
// function
function sayHelloFromParent() {
    console.log('Hello from parent')
}
// ref
const childRef = ref<null | {
    hidden: Boolean,
    sayHelloFromChild: Function,
}>(null);
onMounted(() => {
    console.log('hidden from childRef', childRef.value?.hidden);
    childRef.value?.sayHelloFromChild();
});
function toggleFromFather() {
    if (childRef.value) {
        childRef.value.hidden = !childRef.value.hidden;
    }
}
</script>

<style scoped></style>