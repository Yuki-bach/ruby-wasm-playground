import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/esm/browser.js";
import rubyCode from "./app.rb?raw";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { StreamLanguage, indentUnit } from "@codemirror/language";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";

const initialCode = document.getElementById("editor-initial").textContent;

const editorTheme = EditorView.theme({
  "&": {
    flex: "1",
    minHeight: "0",
    fontSize: "14px",
    fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
  },
  ".cm-scroller": {
    overflow: "auto",
    lineHeight: "1.6",
  },
  ".cm-content": {
    padding: "16px",
  },
  ".cm-gutters": {
    background: "#1e1e2e",
    borderRight: "1px solid #313244",
    color: "#585b70",
  },
  ".cm-activeLineGutter": {
    background: "#2a2a3d",
  },
  ".cm-activeLine": {
    background: "#2a2a3d",
  },
});

const view = new EditorView({
  state: EditorState.create({
    doc: initialCode.trim(),
    extensions: [
      oneDark,
      editorTheme,
      StreamLanguage.define(ruby),
      lineNumbers(),
      indentUnit.of("  "),
      keymap.of([...defaultKeymap, indentWithTab]),
      EditorView.lineWrapping,
    ],
  }),
  parent: document.getElementById("editor-container"),
});

window.__editorView = view;

async function init() {
  const wasmUrl = new URL(
    "@ruby/4.0-wasm-wasi/dist/ruby+stdlib.wasm",
    import.meta.url
  );
  const response = await fetch(wasmUrl);
  const module = await WebAssembly.compileStreaming(response);
  const { vm } = await DefaultRubyVM(module);

  vm.eval(rubyCode);
}

init();
