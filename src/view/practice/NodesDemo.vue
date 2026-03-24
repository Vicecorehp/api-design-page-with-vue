<script setup lang="ts">
import G6, { type Graph } from '@antv/g6'
import { onBeforeUnmount, onMounted } from 'vue'

let graph: Graph | null = null
const data = {
  nodes: [
    { id: 'node-1', style: { x: 100, y: 150 }, data: { label: '节点 1' } },
    { id: 'node-2', style: { x: 300, y: 150 }, data: { label: '节点 2' } },
  ],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2', data: { label: '连线' } }],
}

const initGraph = () => {
  // 创建 G6 实例
  graph = new G6.Graph({
    container: document.getElementById('g6-container') as HTMLElement,
    width: 800,
    height: 500,
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 交互模式
    },
    defaultNode: {
      type: 'rect',
      size: [120, 40],
      style: {
        fill: '#5B8FF9',
        stroke: '#5B8FF9',
        radius: 4,
      },
      labelCfg: {
        style: { fill: '#fff', fontSize: 12 },
        position: 'center',
      },
    },
    defaultEdge: {
      type: 'polyline',
      style: {
        stroke: '#aaa',
        lineWidth: 2,
        endArrow: true,
      },
      labelCfg: {
        autoRotate: true,
        style: { fontSize: 10 },
      },
    },
  })

  // 读取数据
  graph.data(data)
  graph.render()
}

onMounted(() => {
  // 组件挂载后初始化图表
  initGraph()
})

// 放大
const zoomIn = () => {
  if (graph === null) {
    return
  }
  const zoom = graph.getZoom()
  graph.zoomTo(zoom * 1.2)
}

// 缩小
const zoomOut = () => {
  if (graph === null) {
    return
  }
  const zoom = graph.getZoom()
  graph.zoomTo(zoom * 0.8)
}

// 重置缩放
const resetZoom = () => {
  if (graph === null) {
    return
  }
  graph.fitView(20)
}

onBeforeUnmount(() => {
  // 组件销毁前销毁图表实例
  if (graph) {
    graph.destroy()
  }
})
</script>

<template>
  <div class="g6-container">
    <!-- 可选：工具栏 -->
    <div class="toolbar">
      <button @click="zoomIn">放大</button>
      <button @click="zoomOut">缩小</button>
      <button @click="resetZoom">重置</button>
    </div>
    <!-- G6 画布容器 -->
    <div id="g6-container" ref="container"></div>
  </div>
</template>

<style scoped>
.g6-container {
  padding: 20px;
}

.toolbar {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.toolbar button {
  padding: 6px 12px;
  background-color: #5b8ff9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.toolbar button:hover {
  background-color: #3b6ecc;
}

#g6-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #fafafa;
}
</style>
