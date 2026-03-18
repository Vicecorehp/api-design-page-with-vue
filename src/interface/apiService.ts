const request: any = {};

export const apiService = {
  // 获取API列表
  getApiList(params) {
    // 模拟数据，实际使用时替换为真实API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          list: Array.from({ length: params.pageSize }, (_, i) => ({
            id: (params.page - 1) * params.pageSize + i + 1,
            name: `API ${(params.page - 1) * params.pageSize + i + 1}`,
            path: `/api/v1/users/${i + 1}`,
            method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
            status: Math.random() > 0.2 ? 1 : 0,
            tags: ['用户', '订单'].slice(0, Math.floor(Math.random() * 2) + 1),
            description: '这是一个示例API描述，用于展示功能',
            createTime: '2024-01-01 10:00:00',
            updateTime: '2024-01-02 15:30:00',
          })),
          total: 100,
        }
        resolve({ data: mockData })
      }, 500)
    })
  },

  // 获取单个API
  getApiDetail(id) {
    return request.get(`/apis/${id}`)
  },

  // 创建API
  createApi(data) {
    return request.post('/apis', data)
  },

  // 更新API
  updateApi(id, data) {
    return request.put(`/apis/${id}`, data)
  },

  // 删除API
  deleteApi(id) {
    return request.delete(`/apis/${id}`)
  },
}
