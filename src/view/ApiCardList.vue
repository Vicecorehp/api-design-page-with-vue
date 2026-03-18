<template>
  <div class="api-card-list-container">
    <!-- 搜索和筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索API名称或描述"
            :prefix-icon="Search"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="selectedMethod"
            placeholder="请求方法"
            clearable
            @change="handleSearch"
          >
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedStatus" placeholder="状态" clearable @change="handleSearch">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-col>
        <el-col :span="10" class="text-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新建API
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 卡片列表 -->
    <el-row :gutter="20" class="card-grid">
      <el-col
        v-for="api in apiList"
        :key="api.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="card-col"
      >
        <el-card class="api-card" shadow="hover" :body-style="{ padding: '0px' }">
          <!-- 卡片头部 -->
          <div class="card-header" :class="api.method.toLowerCase()">
            <el-tag :type="getMethodType(api.method)" size="small" effect="dark">
              {{ api.method }}
            </el-tag>
            <el-tag :type="api.status === 1 ? 'success' : 'info'" size="small" effect="plain">
              {{ api.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </div>

          <!-- 卡片内容 -->
          <div class="card-content" @click="openDetail(api)">
            <h3 class="api-name">{{ api.name }}</h3>
            <p class="api-path">{{ api.path }}</p>
            <p class="api-desc">{{ api.description || '暂无描述' }}</p>

            <!-- 标签信息 -->
            <div class="api-tags">
              <el-tag v-for="tag in api.tags" :key="tag" size="small" class="tag-item">
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 卡片操作按钮 -->
          <div class="card-footer">
            <el-button-group>
              <el-button size="small" @click.stop="openDetail(api)">
                <el-icon><View /></el-icon>详情
              </el-button>
              <el-button size="small" type="primary" @click.stop="openEdit(api)">
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button size="small" type="danger" @click.stop="handleDelete(api)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty v-if="apiList.length === 0 && !loading" description="暂无API数据" />

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[12, 24, 36, 48]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情/编辑对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="600px" destroy-on-close>
      <ApiForm
        v-if="dialog.visible"
        :api-data="dialog.currentApi"
        :mode="dialog.mode"
        @submit="handleFormSubmit"
        @cancel="dialog.visible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import ApiForm from './ApiForm.vue'
import { apiService } from '@/interface/apiService.ts' // 假设的API服务

// 搜索和筛选
const searchQuery = ref('')
const selectedMethod = ref('')
const selectedStatus = ref('')

// 列表数据
const apiList = ref([])
const loading = ref(false)

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0,
})

// 对话框状态
const dialog = reactive({
  visible: false,
  title: '',
  mode: 'view', // view, edit, add
  currentApi: null,
})

// 获取API列表
const fetchApiList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: searchQuery.value,
      method: selectedMethod.value,
      status: selectedStatus.value,
    }

    const response = await apiService.getApiList(params)
    apiList.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取API列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  fetchApiList()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.current = 1
  fetchApiList()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.current = page
  fetchApiList()
}

// 获取方法对应的标签类型
const getMethodType = (method) => {
  const types = {
    GET: 'success',
    POST: 'warning',
    PUT: 'primary',
    DELETE: 'danger',
  }
  return types[method] || 'info'
}

// 打开详情
const openDetail = (api) => {
  dialog.mode = 'view'
  dialog.title = 'API详情'
  dialog.currentApi = { ...api }
  dialog.visible = true
}

// 打开编辑
const openEdit = (api) => {
  dialog.mode = 'edit'
  dialog.title = '编辑API'
  dialog.currentApi = { ...api }
  dialog.visible = true
}

// 打开新增
const handleAdd = () => {
  dialog.mode = 'add'
  dialog.title = '新建API'
  dialog.currentApi = {
    name: '',
    path: '',
    method: 'GET',
    description: '',
    status: 1,
    tags: [],
  }
  dialog.visible = true
}

// 处理删除
const handleDelete = (api) => {
  ElMessageBox.confirm(`确定要删除API "${api.name}" 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await apiService.deleteApi(api.id)
        ElMessage.success('删除成功')
        fetchApiList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 处理表单提交
const handleFormSubmit = async (formData) => {
  try {
    if (dialog.mode === 'add') {
      await apiService.createApi(formData)
      ElMessage.success('创建成功')
    } else if (dialog.mode === 'edit') {
      await apiService.updateApi(formData.id, formData)
      ElMessage.success('更新成功')
    }
    dialog.visible = false
    fetchApiList()
  } catch (error) {
    ElMessage.error(dialog.mode === 'add' ? '创建失败' : '更新失败')
  }
}

// 监听筛选条件变化
watch([searchQuery, selectedMethod, selectedStatus], () => {
  handleSearch()
})

// 初始化加载
onMounted(() => {
  fetchApiList()
})
</script>

<style scoped>
.api-card-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.filter-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.text-right {
  text-align: right;
}

.card-grid {
  margin: 0 -10px;
}

.card-col {
  margin-bottom: 20px;
}

.api-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.api-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
}

.card-header.get {
  border-left: 4px solid #67c23a;
}

.card-header.post {
  border-left: 4px solid #e6a23c;
}

.card-header.put {
  border-left: 4px solid #409eff;
}

.card-header.delete {
  border-left: 4px solid #f56c6c;
}

.card-content {
  padding: 16px;
  flex: 1;
}

.api-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2f3d;
}

.api-path {
  margin: 0 0 8px 0;
  font-family: monospace;
  color: #409eff;
  font-size: 13px;
  background-color: #ecf5ff;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.api-desc {
  margin: 8px 0;
  color: #6c757d;
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.api-tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 4px;
}

.card-footer {
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
