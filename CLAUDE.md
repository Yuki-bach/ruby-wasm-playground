# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ruby WASM を使ったブラウザ上の Ruby コードプレイグラウンド。

## Commands

```bash
npm run dev      # Vite 開発サーバー起動（HMR 付き）
npm run build    # dist/ にプロダクションビルド
npm run preview  # ビルド結果のプレビュー
```

## Architecture

`src/main.js` が Ruby WASM バイナリを fetch し `DefaultRubyVM` で VM を初期化、`src/app.rb` を `?raw` import で文字列として読み込み `vm.eval()` で実行する。UI 制御・DOM 操作・イベント処理はすべて `app.rb`（Ruby 側）が担当。

Vite を使う理由は `.rb` ファイルの分離（エディタのシンタックスハイライト）と npm パッケージの解決のため。

## Key Configuration

- `vite.config.js`: COOP/COEP ヘッダー（SharedArrayBuffer 用）、Ruby WASM パッケージを `optimizeDeps.exclude` に指定
- `package.json`: `"type": "module"` で ESM を使用
