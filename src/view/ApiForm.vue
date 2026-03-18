<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
    :disabled="mode === 'view'"
  >
    <el-form-item label="API名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入API名称" :readonly="mode === 'view'" />
    </el-form-item>

    <el-form-item label="请求路径" prop="path">
      <el-input v-model="formData.path" placeholder="例如：/api/users" :readonly="mode === 'view'">
        <template #prepend>https://api.example.com</template>
      </el-input>
    </el-form-item>

    <el-form-item label="请求方法" prop="method">
      <el-select v-model="formData.method" placeholder="请选择" :disabled="mode === 'view'">
        <el-option label="GET" value="GET" />
        <el-option label="POST" value="POST" />
        <el-option label="PUT" value="PUT" />
        <el-option label="DELETE" value="DELETE" />
      </el-select>
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-switch
        v-model="formData.status"
        :active-value="1"
        :inactive-value="0"
        active-text="启用"
        inactive-text="禁用"
        :disabled="mode === 'view'"
      />
    </el-form-item>

    <el-form-item label="标签">
      <el-select
        v-model="formData.tags"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="请输入标签后回车"
        :disabled="mode === 'view'"
      >
        <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
      </el-select>
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="formData.description"
        type="textarea"
        rows="4"
        placeholder="请输入API描述"
        :readonly="mode === 'view'"
      />
    </el-form-item>

    <!-- 仅查看模式下的额外信息 -->
    <el-form-item v-if="mode === 'view' && formData.createTime" label="创建时间">
      <span>{{ formData.createTime }}</span>
    </el-form-item>

    <el-form-item v-if="mode === 'view' && formData.updateTime" label="更新时间">
      <span>{{ formData.updateTime }}</span>
    </el-form-item>
  </el-form>

  <!-- 表单按钮 -->
  <div class="form-footer">
    <el-button v-if="mode !== 'view'" type="primary" @click="handleSubmit" :loading="submitting">
      提交
    </el-button>
    <el-button v-if="mode === 'view'" type="primary" @click="handleEdit"> 编辑 </el-button>
    <el-button @click="handleCancel">
      {{ mode === 'view' ? '关闭' : '取消' }}
    </el-button>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  apiData: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'add', // add, edit, view
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  path: '',
  method: 'GET',
  status: 1,
  tags: [],
  description: '',
  createTime: '',
  updateTime: '',
})

// 标签选项（可以来自API）
const tagOptions = ref(['用户', '订单', '商品', '支付'])

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入API名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  path: [
    { required: true, message: '请输入请求路径', trigger: 'blur' },
    { pattern: /^\/[a-zA-Z0-9\-_/{}]*$/, message: '请输入有效的路径（以/开头）', trigger: 'blur' },
  ],
  method: [{ required: true, message: '请选择请求方法', trigger: 'change' }],
}

// 监听传入数据变化
watch(
  () => props.apiData,
  (newVal) => {
    Object.assign(formData, newVal)
  },
  { immediate: true, deep: true },
)

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        emit('submit', { ...formData })
      } finally {
        submitting.value = false
      }
    } else {
      ElMessage.warning('请填写完整信息')
    }
  })
}

// 处理编辑（从查看模式切换到编辑模式）
const handleEdit = () => {
  emit('submit', { ...formData, mode: 'edit' })
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.form-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
