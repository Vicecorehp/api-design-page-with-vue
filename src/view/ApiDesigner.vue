<template>
  <el-drawer v-model="isDrawerVisible" size="60%" resizable>
    <template #header>
      <h3>The Saltwater Room(Instrumental) - Owl City</h3>
    </template>

    <template #default>
      <el-row :style="{ marginBottom: '20px' }">
        <el-col :span="12">
          <el-button type="primary" @click="onAddBtnClick">Add</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="apiTableData"
        :border="true"
        :preserve-expanded-content="preserveExpanded"
        style="width: 100%; height: 100%"
      >
        <el-table-column type="expand">
          <template #default="props">
            <ApiDetail :detailData="props.row" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" />
        <el-table-column label="方法" prop="method" />
        <el-table-column label="路径" prop="path" />
        <el-table-column label="操作" fixed="right">
          <template #default>
            <el-button link size="small" type="primary" @click="onEditBtnClick">编辑</el-button>
            <el-button link size="small" type="primary" @click="onDeleteBtnClick">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #footer>
      <el-row>
        <el-col :span="12">
          <el-button type="primary">Save</el-button>
          <el-button type="primary" @click="onCancelBtnClick">Cancel</el-button>
        </el-col>
      </el-row>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { ApiInfo } from '@/interface/ApiDefinition.ts'
import ApiDetail from '@/view/ApiDetail.vue'

const isDrawerVisible = ref(true)

const preserveExpanded = ref(true)

const apiTableData = ref<ApiInfo[]>([])

function getDefaultData() {
  apiTableData.value = [
    {
      name: 'name1',
      version: '1.0',
      uuid: 'uuid-test',
      path: '/test/01',
      method: 'GET',
      descriptionCn: '中文',
      descriptionEn: 'English',
      aliasEn: '中文',
      aliasCn: 'English',
    },
    {
      name: 'name2',
      version: '1.0',
      uuid: 'uuid-test',
      path: '/test/02',
      method: 'POST',
      descriptionCn: '中文',
      descriptionEn: 'English',
      aliasEn: '中文',
      aliasCn: 'English',
    },
  ]
}

onMounted(() => {
  getDefaultData()
})

const onAddBtnClick = () => {}

const onPreviewBtnClick = () => {}

const onEditBtnClick = () => {}

const onDeleteBtnClick = () => {}

const onCancelBtnClick = () => {
  isDrawerVisible.value = false
}
</script>

<style scoped></style>
