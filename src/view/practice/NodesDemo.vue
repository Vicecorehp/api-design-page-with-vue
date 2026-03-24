<script setup lang="ts">
import { onMounted } from 'vue'
import { Graph } from '@antv/g6'

const initData = {
  nodes: [
    {
      id: 'node1',
      x: 100,
      y: 200,
      label: '起始点',
    },
    {
      id: 'node2',
      x: 300,
      y: 200,
      label: '目标点',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      label: '连线',
    },
  ],
}

onMounted(() => {
  const graph = new Graph({
    container: 'mountNode',
    width: 800,
    height: 600,
  })
  graph.data(initData);
  graph.render()
})
</script>

<template>
  <div id="mountNode"></div>
</template>

<style scoped></style>
