# アーキテクチャ

## なぜ Vite を使うのか

Ruby WASM の最小構成は `<script type="text/ruby">` に直接 Ruby コードを書く方法だが、
この方法では VSCode 上でシンタックスハイライトが効かない。

`.rb` ファイルに分離するには HTTP サーバーが必要（`file://` では CORS でブロックされる）。
Vite を使うことで以下が実現できる：

- `.rb` ファイルを `?raw` 付きで import し、文字列として JS に渡せる
- `@ruby/wasm-wasi` 等の npm パッケージを `node_modules` から解決できる
- HMR（ホットリロード）でファイル保存時にブラウザが自動更新される

## 処理の流れ

```
Vite 開発サーバー
  ↓
main.js が読み込まれる
  ↓ import rubyCode from "./app.rb?raw"    ← Vite が .rb を文字列として渡す
  ↓ import { DefaultRubyVM } from "..."    ← node_modules から解決
  ↓
Ruby VM を初期化 → vm.eval(rubyCode) で app.rb を実行
```

## ファイル構成

```
ruby-wasm-playground/
├── index.html          # HTML（UI構造のみ）
├── style.css           # スタイル
├── src/
│   ├── main.js         # Ruby VM の初期化・.wasm の読み込み
│   └── app.rb          # アプリロジック（Ruby）
├── vite.config.js      # Vite 設定（COOP/COEP ヘッダー等）
└── package.json
```

## JS と Ruby の役割分担

| レイヤー | 担当 | 内容 |
|----------|------|------|
| main.js | JS | Ruby VM の初期化、.wasm の fetch、`vm.eval()` の呼び出し |
| app.rb | Ruby | DOM 操作、イベント処理、ユーザーコードの eval |
