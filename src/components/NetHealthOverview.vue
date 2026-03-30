<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ExtensionCategory, Graph, Rect, type RectStyleProps, register } from '@antv/g6'
import DepartmentOverview from '@/components/DepartmentOverview.vue'

const nodeToDelete = ref<string>('')

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
      textBaseline: 'middle'
    }
  }

  // 状态显示（红色代表不健康、绿色代表健康）
  getStatusIcon(attributes?: Record<string, unknown>): Record<string, unknown> {
    return {
      x: 0,
      y: 0,
      text: attributes?.headerTitle || 'missing',
      fontSize: 12,
      fill: '#FFFFFF',
      textAlign: 'center',
      textBaseline: 'middle'
    }
  }

  override render(attributes?: Required<RectStyleProps>, container?: any) {
    super.render(attributes, container)
    this.upsert('subtitle', 'text', this.getHeaderTitle(attributes), container)
  }
}

const generateGwNode = (
  id: string,
  position: [number, number] = [100, 100],
  size: [number, number] = [100, 50],
  headerTitle?: string
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
      headerTitle: headerTitle + `[id = ${id}]`
    }
  }
}

const deleteNodeById = (): void => {
  if (!graph) {
    return
  }
  try {
    graph.removeNodeData([nodeToDelete.value])
  } catch (e) {
    console.error(e)
  }
  graph.render()
}

const switchExample = () => {

}

let graph: Graph

onMounted(() => {
  register(ExtensionCategory.NODE, 'gw-node', GwNode)
  graph = new Graph({
    container: 'container',
    data: {
      nodes: [
        generateGwNode('root', undefined, undefined, 'GW-1'),
        generateGwNode('id-2', [300, 100], undefined, 'GW-2')
      ],
      edges: []
    }
  })
  graph.render()
})
</script>

<template>
  <el-splitter style="height: 100vh">
    <el-splitter-panel size="30%">
      <el-row>
        <el-col :span="4">
          <el-input
            type="text"
            v-model="nodeToDelete"
            placeholder="输入待删除节点的ID"
            @keyup:enter="deleteNodeById"
            native />
        </el-col>
        <el-col :span="4">
          <el-button @click="deleteNodeById" type="primary">删除指定的节点</el-button>
        </el-col>
      </el-row>
      <div id="container" />
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <DepartmentOverview />
    </el-splitter-panel>
  </el-splitter>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}

.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
