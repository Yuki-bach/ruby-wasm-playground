import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/esm/browser.js";
import rubyCode from "./app.rb?raw";

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
