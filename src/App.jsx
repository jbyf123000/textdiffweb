import { useEffect, useMemo, useRef, useState } from 'react'
import { DiffEditor, Editor } from '@monaco-editor/react'
import './App.css'

const LEFT_SAMPLE = `lome neral sivo tana merik falo derin suta navo kelin rava
temo sali nera veko lami saro tiven mora nesi kala reno
fari luno sevi naren kivo tala meso riven lora denu pami
sona meli taro venu kisa reli fano meva liso taner sovi
nami telo ravin sume kera noli fesi mavor lenti saro kine
vema sira tono lemi kavo nira felo rami suta naven dilo`

const RIGHT_SAMPLE = `lome neral sivo tana merik falo derin suta navo kelin rava
temo sali nera veko lami saro tiven mora nesi kalo reno
fari luno sevi naren kivo tala meso riven lona denu pami
sona meli taro venu kisa reli fano meva liso taner sovi
nami telo ravin sume kera noli fesi mavor lenti saro kina
vema sira tono lemi kavo nira felo rami suta naven dilo`

function getLineCount(text) {
  return text === '' ? 1 : text.split('\n').length
}

function getCharCount(text) {
  return text.length
}

function App() {
  const diffEditorRef = useRef(null)
  const toastTimerRef = useRef(null)

  const [originalText, setOriginalText] = useState(LEFT_SAMPLE)
  const [modifiedText, setModifiedText] = useState(RIGHT_SAMPLE)
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 980)
  const [diffStats, setDiffStats] = useState({ blocks: 0, changedLines: 0 })
  const [toast, setToast] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 980)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const leftStats = useMemo(
    () => ({
      lines: getLineCount(originalText),
      chars: getCharCount(originalText),
    }),
    [originalText],
  )

  const rightStats = useMemo(
    () => ({
      lines: getLineCount(modifiedText),
      chars: getCharCount(modifiedText),
    }),
    [modifiedText],
  )

  const pushToast = (message) => {
    setToast(message)

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast('')
    }, 2200)
  }

  const configureMonaco = (monaco) => {
    monaco.editor.defineTheme('textdiff-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#fbfcfe',
        'editor.lineHighlightBackground': '#eef4ff',
        'editorLineNumber.foreground': '#8b99b1',
        'editorLineNumber.activeForeground': '#31578d',
        'editor.selectionBackground': '#d6e4ff',
        'editor.inactiveSelectionBackground': '#e7eefc',
        'editorGutter.background': '#f5f8fd',
        'diffEditor.insertedTextBackground': '#d9f2dd',
        'diffEditor.removedTextBackground': '#fde0df',
        'diffEditor.insertedLineBackground': '#effaf1',
        'diffEditor.removedLineBackground': '#fff1f0',
      },
    })
  }

  const updateDiffStats = () => {
    const editor = diffEditorRef.current

    if (!editor) {
      return
    }

    const lineChanges = editor.getLineChanges() ?? []
    const changedLines = lineChanges.reduce((sum, change) => {
      const originalSpan = change.originalEndLineNumber - change.originalStartLineNumber + 1
      const modifiedSpan = change.modifiedEndLineNumber - change.modifiedStartLineNumber + 1

      return sum + Math.max(originalSpan, modifiedSpan)
    }, 0)

    setDiffStats({
      blocks: lineChanges.length,
      changedLines,
    })
  }

  const handleEditorMount = (editor) => {
    diffEditorRef.current = editor

    editor.onDidUpdateDiff(() => {
      updateDiffStats()
    })

    updateDiffStats()
  }

  const swapTexts = () => {
    setOriginalText(modifiedText)
    setModifiedText(originalText)
    pushToast('左右文本已交换')
  }

  const clearTexts = () => {
    setOriginalText('')
    setModifiedText('')
    pushToast('内容已清空')
  }

  const resetExample = () => {
    setOriginalText(LEFT_SAMPLE)
    setModifiedText(RIGHT_SAMPLE)
    pushToast('已恢复示例内容')
  }

  const copyText = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value)
      pushToast(`${label}已复制`)
    } catch {
      pushToast(`复制${label}失败`)
    }
  }

  const editorOptions = {
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbersMinChars: 3,
    fontSize: 14,
    lineHeight: 22,
    padding: {
      top: 16,
      bottom: 16,
    },
    scrollbar: {
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  }

  return (
    <main className="app-shell">
      <div className="page-glow page-glow-left" aria-hidden="true" />
      <div className="page-glow page-glow-right" aria-hidden="true" />

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-badge">Docker-ready Text Diff</span>
          <h1>TextDiff 在线文本对比</h1>
          <p>
            直接打开网页就能粘贴两段文本进行差异对比，支持行号、高亮、左右交换和复制结果，
            部署时只需要一条 Docker 命令。
          </p>
        </div>

        <div className="hero-stats" aria-label="text stats">
          <article>
            <span>左侧文本</span>
            <strong>{leftStats.lines}</strong>
            <small>{leftStats.chars} chars</small>
          </article>
          <article>
            <span>右侧文本</span>
            <strong>{rightStats.lines}</strong>
            <small>{rightStats.chars} chars</small>
          </article>
          <article>
            <span>差异块</span>
            <strong>{diffStats.blocks}</strong>
            <small>{diffStats.changedLines} lines changed</small>
          </article>
        </div>
      </section>

      <section className="workspace-panel">
        <div className="toolbar">
          <div className="toolbar-group">
            <button type="button" onClick={swapTexts}>
              交换左右
            </button>
            <button type="button" onClick={clearTexts}>
              清空内容
            </button>
            <button type="button" onClick={resetExample}>
              恢复示例
            </button>
          </div>

          <div className="toolbar-group">
            <button type="button" onClick={() => copyText(originalText, '左侧文本')}>
              复制左侧
            </button>
            <button type="button" onClick={() => copyText(modifiedText, '右侧文本')}>
              复制右侧
            </button>
          </div>
        </div>

        <div className="input-grid">
          <section className="input-panel">
            <div className="input-heading">
              <div>
                <strong>Original</strong>
                <span>可直接编辑左侧文本</span>
              </div>
              <small>
                {leftStats.lines} lines / {leftStats.chars} chars
              </small>
            </div>

            <div className="input-editor">
              <Editor
                height="34vh"
                language="plaintext"
                theme="textdiff-light"
                beforeMount={configureMonaco}
                value={originalText}
                onChange={(value) => {
                  setOriginalText(value ?? '')
                }}
                options={editorOptions}
              />
            </div>
          </section>

          <section className="input-panel">
            <div className="input-heading">
              <div>
                <strong>Modified</strong>
                <span>可直接编辑右侧文本</span>
              </div>
              <small>
                {rightStats.lines} lines / {rightStats.chars} chars
              </small>
            </div>

            <div className="input-editor">
              <Editor
                height="34vh"
                language="plaintext"
                theme="textdiff-light"
                beforeMount={configureMonaco}
                value={modifiedText}
                onChange={(value) => {
                  setModifiedText(value ?? '')
                }}
                options={editorOptions}
              />
            </div>
          </section>
        </div>

        <div className="editor-shell">
          <div className="editor-headings">
            <span>Diff Preview</span>
            <span>
              {diffStats.blocks} blocks / {diffStats.changedLines} changed lines
            </span>
          </div>

          <div className="editor-frame">
            <DiffEditor
              height="40vh"
              language="plaintext"
              original={originalText}
              modified={modifiedText}
              theme="textdiff-light"
              beforeMount={configureMonaco}
              onMount={handleEditorMount}
              options={{
                ...editorOptions,
                renderSideBySide: !isCompact,
                readOnly: true,
              }}
            />
          </div>
        </div>

        <div className="tips-row">
          <span>支持直接粘贴超长文本，差异会自动更新。</span>
          <span>{isCompact ? '当前为上下模式，适合窄屏访问。' : '当前为左右模式，适合桌面宽屏。'}</span>
        </div>
      </section>

      <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </main>
  )
}

export default App
