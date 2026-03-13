<script setup lang="ts">
import { type PropType, reactive } from 'vue'
import type { ApiInfo } from '@/interface/ApiDefinition.ts'

const props = defineProps({
  detailData: {
    type: Object as PropType<ApiInfo>,
    required: true,
  },
})

const localDetailData = reactive<ApiInfo>({ ...props.detailData })
</script>

<template>
  <el-row :gutter="20" :style="{ padding: '10px' }">
    <el-col :span="12">
      <el-input v-model="localDetailData.name" :placeholder="'输入名称'" clearable>
        <template #prepend> 名称 </template>
      </el-input>
    </el-col>
    <el-col :span="12">
      <el-input v-model="localDetailData.path" :placeholder="'输入路径'" clearable>
        <template #prepend> 路径 </template>
      </el-input>
    </el-col>
  </el-row>

  <el-row>
    <el-input
      type="textarea"
      autosize
      disabled
      :placeholder="JSON.stringify(localDetailData, null, 2)"
    />
  </el-row>

  <el-row :gutter="20" :style="{ padding: '10px' }">
    <el-col :span="12"> </el-col>
    <el-col :span="12">
      <el-button type="primary">Save</el-button>
      <el-button type="primary">Delete</el-button>
    </el-col>
  </el-row>
</template>

<style scoped></style>
