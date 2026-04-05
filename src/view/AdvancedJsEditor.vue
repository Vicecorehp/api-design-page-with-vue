<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import * as monaco from 'monaco-editor'
import { type CancellationToken, editor as Editor, languages, Position } from 'monaco-editor'
import IStandaloneCodeEditor = Editor.IStandaloneCodeEditor
import CompletionContext = languages.CompletionContext
import ITextModel = Editor.ITextModel
import CompletionList = languages.CompletionList
import ProviderResult = languages.ProviderResult

// Refs
const editorContainer = ref<HTMLElement | null>(null)
const consoleContent = ref<HTMLElement | null>(null)
const showConsole = ref<boolean>(true)

// 状态
let editor: IStandaloneCodeEditor | null = null
const consoleLogs = ref<Array<{
  type: string,
  message: string,
  time: string,
}>>([])
const statusText = ref('就绪')
const statusType = ref('idle')
const isDarkTheme = ref(true)
const charCount = ref(0)
const cursorPosition = reactive({ line: 1, column: 1 })

// 默认代码模板
const defaultCode = `// 🚀 JavaScript 在线编辑器
// 支持 ES6+ 语法，实时运行

// 1. 基础语法示例
const greeting = "Hello, Monaco Editor!";
console.log(greeting);

// 2. 函数定义
const calculateSum = (a, b) => {
  const result = a + b;
  console.log(\`计算结果: \${a} + \${b} = \${result}\`);
  return result;
};

calculateSum(10, 20);

// 3. 异步操作示例
const fetchData = async () => {
  console.log("开始异步操作...");

  // 模拟API调用
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "数据加载成功!", timestamp: new Date().toLocaleString() });
    }, 1000);
  });

  console.log(data);
  return data;
};

fetchData();

// 4. 数组和对象操作
const users = [
  { name: "张三", age: 25 },
  { name: "李四", age: 30 },
  { name: "王五", age: 28 }
];

const userNames = users.map(user => user.name);
console.log("用户列表:", userNames);

// 5. 错误处理示例
try {
  throw new Error("这是一个错误示例");
} catch (error) {
  console.error("捕获到错误:", error.message);
}

// 温馨提示: 修改代码后点击"运行代码"查看效果！`

// 获取日志图标
const getLogIcon = (type: string) => {
  const icons = new Map<string, string>([
    ['log', '📝'],
    ['error', '❌'],
    ['warn', '⚠️'],
    ['info', 'ℹ️']
  ])

  return icons.get(type) || '📝'
}

// 添加控制台日志
const addConsoleLog = (message: string, type = 'log') => {
  const time = new Date().toLocaleTimeString()
  consoleLogs.value.push({
    message: String(message),
    type,
    time
  })

  // 自动滚动到底部
  setTimeout(() => {
    if (consoleContent.value) {
      consoleContent.value.scrollTop = consoleContent.value.scrollHeight
    }
  }, 100)
}

// 初始化编辑器
const initEditor = () => {
  if (!editorContainer.value) return

  // 自定义主题
  monaco.editor.defineTheme('custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569cd6' },
      { token: 'string', foreground: 'ce9178' },
      { token: 'number', foreground: 'b5cea8' },
      { token: 'function', foreground: 'dcdcaa' }
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.lineHighlightBackground': '#2a2a2a',
      'editorCursor.foreground': '#aeafad'
    }
  })

  monaco.editor.defineTheme('custom-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      { token: 'keyword', foreground: '0000ff' },
      { token: 'string', foreground: 'a31515' }
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.lineHighlightBackground': '#eeeeee'
    }
  })

  editor = monaco.editor.create(editorContainer.value, {
    value: defaultCode,
    language: 'javascript',
    theme: isDarkTheme.value ? 'custom-dark' : 'custom-light',
    automaticLayout: true,
    fontSize: 14,
    fontFamily: 'Fira Code, Consolas, "Courier New", monospace',
    fontLigatures: true,
    lineNumbers: 'on',
    minimap: {
      enabled: true,
      maxColumn: 80
    },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    renderWhitespace: 'selection',
    tabSize: 2,
    acceptSuggestionOnEnter: 'on',
    suggestOnTriggerCharacters: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    snippetSuggestions: 'top',
    parameterHints: {
      enabled: true
    },
    formatOnPaste: true,
    formatOnType: false
  })

  // 监听内容变化
  editor.onDidChangeModelContent(() => {
    charCount.value = editor?.getValue().length as number
    updateStatus('编辑中...', 'editing')
    setTimeout(() => {
      if (statusText.value === '编辑中...') {
        updateStatus('就绪', 'idle')
      }
    }, 1000)
  })

  // 监听光标位置变化
  editor.onDidChangeCursorPosition((e) => {
    cursorPosition.line = e.position.lineNumber
    cursorPosition.column = e.position.column
  })

  // 设置代码提示
  setupCodeCompletion()
}

// 设置代码自动完成
const setupCodeCompletion = () => {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (
      _model: ITextModel, _position: Position,
      _context: CompletionContext, _token: CancellationToken): ProviderResult<CompletionList> => {
      const suggestions = [
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'console.log(${1:message});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: '输出到控制台',
          documentation: '在控制台打印信息'
        },
        {
          label: '箭头函数',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'const ${1:name} = (${2:params}) => {\n\t${3:// code}\n};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Arrow function',
          documentation: '创建箭头函数'
        },
        {
          label: 'Promise',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'new Promise((resolve, reject) => {\n\t${1:// async operation}\n})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Promise constructor',
          documentation: '创建Promise对象'
        },
        {
          label: 'async/await',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'const ${1:name} = async () => {\n\t${2:// async code}\n};',
          detail: 'Async function',
          documentation: '创建异步函数'
        },
        {
          label: 'try/catch',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try {\n\t${1:// code}\n} catch (error) {\n\tconsole.error(error);\n}',
          detail: 'Error handling',
          documentation: '错误处理块'
        }
      ]

      return { suggestions }
    }
  })
}

// 运行代码
const runCode = () => {
  clearConsole()
  const code = editor?.getValue()

  // 保存原始console方法
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  }

  // 重写console方法
  console.log = (...args) => {
    addConsoleLog(args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2)
      }
      return String(arg)
    }).join(' '), 'log')
    originalConsole.log(...args)
  }

  console.error = (...args) => {
    addConsoleLog(args.join(' '), 'error')
    originalConsole.error(...args)
  }

  console.warn = (...args) => {
    addConsoleLog(args.join(' '), 'warn')
    originalConsole.warn(...args)
  }

  console.info = (...args) => {
    addConsoleLog(args.join(' '), 'info')
    originalConsole.info(...args)
  }

  try {
    // 执行代码
    if (code != null) {
      const executeCode = new Function(code)
      executeCode()
    }
    updateStatus('运行成功 ✓', 'success')
  } catch (error: any) {
    addConsoleLog(`运行时错误: ${error.message}`, 'error')
    updateStatus('运行失败 ✗', 'error')
  } finally {
    // 恢复console方法
    console.log = originalConsole.log
    console.error = originalConsole.error
    console.warn = originalConsole.warn
    console.info = originalConsole.info
  }
}

// 格式化代码
const formatCode = () => {
  if (editor) {
    editor.getAction('editor.action.formatDocument')?.run()
    updateStatus('代码已格式化 ✓', 'success')
    setTimeout(() => {
      if (statusText.value === '代码已格式化 ✓') {
        updateStatus('就绪', 'idle')
      }
    }, 2000)
  }
}

// 清空控制台
const clearConsole = () => {
  consoleLogs.value = []
  updateStatus('控制台已清空', 'info')
  setTimeout(() => {
    if (statusText.value === '控制台已清空') {
      updateStatus('就绪', 'idle')
    }
  }, 2000)
}

// 切换主题
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  if (editor) {
    monaco.editor.setTheme(isDarkTheme.value ? 'custom-dark' : 'custom-light')
  }
  updateStatus(`已切换到${isDarkTheme.value ? '暗色' : '亮色'}主题`, 'info')
}

// 更新状态
const updateStatus = (text: string, type: string) => {
  statusText.value = text
  statusType.value = type
}

// 获取编辑器内容
const getValue = () => editor?.getValue() || ''

// 设置编辑器内容
const setValue = (value: string) => {
  if (editor) {
    editor.setValue(value)
    updateStatus('代码已更新', 'info')
  }
}

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + Enter 运行代码
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    runCode()
  }
  // Ctrl/Cmd + S 格式化
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault()
    formatCode()
  }
}

onMounted(() => {
  initEditor()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
  window.removeEventListener('keydown', handleKeydown)
})

// 暴露方法
defineExpose({
  getValue,
  setValue,
  runCode,
  formatCode,
  clearConsole,
  getEditor: () => editor
})
</script>

<template>
  <div class="advanced-editor">
    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="runCode" class="btn-run">
          <span>▶</span> 运行代码
        </button>
        <button @click="formatCode" class="btn-format">
          <span>✨</span> 格式化
        </button>
        <button @click="clearConsole" class="btn-clear">
          <span>🗑️</span> 清空控制台
        </button>
        <button @click="toggleTheme" class="btn-theme">
          <span>{{ isDarkTheme ? '☀️' : '🌙' }}</span>
          {{ isDarkTheme ? '亮色主题' : '暗色主题' }}
        </button>
      </div>
      <div class="toolbar-right">
        <span class="status" :class="statusType">
          {{ statusText }}
        </span>
      </div>
    </div>

    <div class="editor-layout">
      <div ref="editorContainer" class="editor"></div>

      <div class="console" v-show="showConsole">
        <div class="console-header">
          <span>控制台输出</span>
          <button @click="showConsole = false" class="close-btn">×</button>
        </div>
        <div class="console-content" ref="consoleContent">
          <div v-for="(log, index) in consoleLogs" :key="index" :class="['log-item', log.type]">
            <span class="log-icon">{{ getLogIcon(log.type) }}</span>
            <span class="log-message">{{ log.message }}</span>
            <span class="log-time">{{ log.time }}</span>
          </div>
          <div v-if="consoleLogs.length === 0" class="empty-console">
            暂无输出，点击"运行代码"查看结果
          </div>
        </div>
      </div>
    </div>

    <div class="status-bar">
      <span>行: {{ cursorPosition.line }}, 列: {{ cursorPosition.column }}</span>
      <span>语言: JavaScript</span>
      <span>字符数: {{ charCount }}</span>
    </div>
  </div>
</template>

<style scoped>
.advanced-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.toolbar {
  padding: 8px 16px;
  background: #2d2d2d;
  border-bottom: 1px solid #3e3e3e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-run {
  background: #4caf50;
  color: white;
}

.btn-run:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.btn-format {
  background: #2196f3;
  color: white;
}

.btn-format:hover {
  background: #0b7dda;
}

.btn-clear {
  background: #f44336;
  color: white;
}

.btn-clear:hover {
  background: #da190b;
}

.btn-theme {
  background: #9c27b0;
  color: white;
}

.btn-theme:hover {
  background: #7b1fa2;
}

.status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.idle {
  background: #4caf50;
  color: white;
}

.status.editing {
  background: #ff9800;
  color: white;
}

.status.success {
  background: #4caf50;
  color: white;
}

.status.error {
  background: #f44336;
  color: white;
}

.status.info {
  background: #2196f3;
  color: white;
}

.editor-layout {
  display: flex;
  flex: 1;
  gap: 1px;
  background: #1e1e1e;
  overflow: hidden;
}

.editor {
  flex: 2;
  height: 100%;
}

.console {
  flex: 1;
  background: #252526;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #3e3e3e;
}

.console-header {
  padding: 8px 12px;
  background: #2d2d2d;
  color: #ccc;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3e3e3e;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.console-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  font-family: 'Consolas', monospace;
  font-size: 12px;
}

.log-item {
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.log-item.log {
  background: rgba(206, 145, 120, 0.1);
  border-left: 3px solid #ce9178;
}

.log-item.error {
  background: rgba(244, 135, 113, 0.1);
  border-left: 3px solid #f48771;
}

.log-item.warn {
  background: rgba(204, 167, 0, 0.1);
  border-left: 3px solid #cca700;
}

.log-item.info {
  background: rgba(79, 193, 233, 0.1);
  border-left: 3px solid #4fc1e9;
}

.log-icon {
  font-size: 14px;
  user-select: none;
}

.log-message {
  flex: 1;
}

.log-time {
  font-size: 10px;
  color: #888;
  user-select: none;
}

.empty-console {
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
}

.status-bar {
  padding: 4px 12px;
  background: #2d2d2d;
  border-top: 1px solid #3e3e3e;
  color: #888;
  font-size: 11px;
  display: flex;
  gap: 20px;
}
</style>