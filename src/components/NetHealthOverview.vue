<script setup lang="ts">
import { onMounted } from 'vue'
import { ExtensionCategory, Graph, Rect, type RectStyleProps, register } from '@antv/g6'

class GwNode extends Rect {
  // 大标题
  getHeaderTitle(attributes?: Record<string, unknown>): Record<string, unknown> {
    return {
      x: 0,
      y: 0,
      text: attributes?.headerTitle || 'missing',
      fontSize: 12,
      fill: '#FFFFFF',
      textAlign: 'center',
      textBaseline: 'middle',
    }
  }

  override render(attributes?: Required<RectStyleProps>, container?: any) {
    super.render(attributes, container)
    this.upsert('subtitle', 'text', this.getHeaderTitle(attributes), container)
  }
}

const getGwNode = (
  id: string,
  position: [number, number] = [100, 100],
  size: [number, number] = [100, 50],
  headerTitle?: string,
): any => {
  return {
    id: id,
    type: 'gw-node',
    style: {
      x: position[0],
      y: position[1],
      size: size,
      radius: 10,
      fill: 'grey',
      headerTitle: headerTitle,
    },
  }
}

const deleteNodeById = (id: string): void => {
  if (!graph) {
    return;
  }
  graph.getNodeData().pop();
}

let graph: Graph;

onMounted(() => {
  register(ExtensionCategory.NODE, 'gw-node', GwNode)
  graph = new Graph({
    container: 'container',
    data: {
      nodes: [
        getGwNode('id-1', undefined, undefined, 'GW-1'),
        getGwNode('id-2', [300, 100], undefined, 'GW-2'),
      ],
      edges: [],
    },
  })
  graph.render()
})
</script>

<template>
  <el-row>
    <el-button @click="" type="primary">deleteNodeById</el-button>
    <div id="container"/>
  </el-row>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>
