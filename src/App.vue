<script setup lang="ts">
import AdvancedJsEditor from '@/view/AdvancedJsEditor.vue'
import { ref } from 'vue'

const editorRef = ref<InstanceType<typeof AdvancedJsEditor>>()
const loadExample = () => {
  const exampleCode = `// 示例：斐波那契数列
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log("斐波那契数列前10项:");
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`

  editorRef.value?.setValue(exampleCode)
}

const saveCode = () => {
  const code = editorRef.value?.getValue()
  if (code != null) {
    localStorage.setItem('saved-code', code)
  }
  alert('代码已保存到本地')
}

const clearAll = () => {
  if (confirm('确定要清空所有代码吗？')) {
    editorRef.value?.setValue('')
    editorRef.value?.clearConsole()
  }
}

// 从本地存储加载保存的代码
const loadSavedCode = () => {
  const savedCode = localStorage.getItem('saved-code')
  if (savedCode) {
    editorRef.value?.setValue(savedCode)
  }
}

// 页面加载时加载保存的代码
loadSavedCode()
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="app">
        <div class="header">
          <h1>JavaScript 在线编辑器</h1>
          <div class="actions">
            <button @click="loadExample">加载示例</button>
            <button @click="saveCode">保存代码</button>
            <button @click="clearAll">清空全部</button>
          </div>
        </div>

        <AdvancedJsEditor ref="editorRef" />
      </div>
    </div>
  </header>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 24px;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}
</style>
