<script lang="ts" setup>
import { ref } from 'vue'

import { ElMessageBox } from 'element-plus'
import type { DrawerProps, CollapseModelValue } from 'element-plus'
import ApiBasicInfo from '@/components/api/ApiBasicInfo.vue'

const urls = [
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

const activeNames = ref(['1'])
const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}

const apiDrawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')

function cancelClick() {
  apiDrawer.value = false
}

function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to sumbit?`)
    .then(() => {
      apiDrawer.value = false
      alert('You confirmed')
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <div class="demo-collapse">
    <el-radio-group v-model="direction">
      <el-radio value="ltr">left to right</el-radio>
      <el-radio value="rtl">right to left</el-radio>
    </el-radio-group>
    <el-button type="primary" style="margin-left: 16px" @click="apiDrawer = true">
      with footer
    </el-button>
    <el-drawer v-model="apiDrawer" :direction="direction" size="50%" resizable>
      <template #header>
        <h4>API Design</h4>
      </template>
      <template #default>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="基本信息" name="1">
            <ApiBasicInfo />
          </el-collapse-item>
          <el-collapse-item title="Feedback" name="2">
            <div>
              Operation feedback: enable the users to clearly perceive their
              operations by style updates and interactive effects;
            </div>
          </el-collapse-item>
          <el-collapse-item title="Efficiency" name="3">
            <div>
              Simplify the process: keep operating process simple and intuitive;
            </div>
          </el-collapse-item>
          <el-collapse-item title="Controllability" name="4">
            <div>
              Decision making: giving advice about operations is acceptable, but do
              not make decisions for the users;
            </div>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">cancel</el-button>
          <el-button type="primary" @click="confirmClick">confirm</el-button>
        </div>
      </template>
    </el-drawer>

    <div class="demo-image__lazy">
      <el-image v-for="url in urls" :key="url" :src="url" lazy />
    </div>
  </div>
</template>

<style scoped>
.demo-image__lazy {
  margin-top: 3%;
  margin-bottom: 3%;
  height: 100%;
  overflow-y: auto;
}

.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}

.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}
</style>