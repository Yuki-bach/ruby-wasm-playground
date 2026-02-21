# Ruby WASM Playground

ブラウザ上で Ruby コードを書いて実行できるプレイグラウンド。
[Ruby WASM](https://ruby.github.io/ruby.wasm/) を使い、Ruby コードがブラウザ内で直接実行される。

## セットアップ

```bash
npm install
npm run dev
```

## 使い方

- 左パネルのエディタに Ruby コードを入力
- **Run ボタン** または **Ctrl+Enter / Cmd+Enter** で実行
- 右パネルに `puts` の出力と戻り値が表示される
- **Tab** キーで 2 スペースインデント

## 技術スタック

- [Ruby WASM](https://ruby.github.io/ruby.wasm/) (`@ruby/4.0-wasm-wasi`) - ブラウザ上の Ruby 実行環境
- [Vite](https://vite.dev/) - 開発サーバー / バンドラー
