require "js"

# DOM要素の取得
document = JS.global[:document]
app = document.getElementById("app")
loading = document.getElementById("loading")
editor = document.getElementById("editor")
output = document.getElementById("output")
run_btn = document.getElementById("run-btn")
version_el = document.getElementById("version")

# バージョン表示
version_el[:textContent] = "v#{RUBY_VERSION}"

# 読み込み完了
loading[:style][:display] = "none"
app[:style][:display] = "flex"

# 出力をキャプチャするためのStringIO風クラス
class OutputCapture
  attr_reader :lines

  def initialize
    @lines = []
  end

  def write(str)
    @lines << str.to_s
    str.length
  end

  def flush
    # no-op
  end
end

# コード実行
run_code = -> {
  code = editor[:value].to_s
  output[:innerHTML] = ""

  capture = OutputCapture.new
  old_stdout = $stdout
  old_stderr = $stderr
  $stdout = capture
  $stderr = capture

  begin
    result = eval(code)
    $stdout = old_stdout
    $stderr = old_stderr

    # 出力を表示
    unless capture.lines.empty?
      text = capture.lines.join
      line_el = document.createElement("div")
      line_el[:className] = "output-line"
      line_el[:textContent] = text
      output.appendChild(line_el)
    end

    # 戻り値を表示
    unless result.nil?
      result_el = document.createElement("div")
      result_el[:className] = "output-line output-info"
      result_el[:textContent] = "=> #{result.inspect}"
      output.appendChild(result_el)
    end
  rescue Exception => e
    $stdout = old_stdout
    $stderr = old_stderr

    err_el = document.createElement("div")
    err_el[:className] = "output-line output-error"
    err_el[:textContent] = "#{e.class}: #{e.message}"
    output.appendChild(err_el)

    # バックトレース
    if e.backtrace
      e.backtrace.first(5).each do |line|
        bt_el = document.createElement("div")
        bt_el[:className] = "output-line output-error"
        bt_el[:textContent] = "  #{line}"
        output.appendChild(bt_el)
      end
    end
  end
}

# ボタンクリック
run_btn.addEventListener("click") { run_code.call }

# Ctrl+Enter でも実行
editor.addEventListener("keydown") do |event|
  if (event[:ctrlKey].to_s == "true" || event[:metaKey].to_s == "true") && event[:key].to_s == "Enter"
    event.preventDefault
    run_code.call
  end
end

# タブキーでインデント
editor.addEventListener("keydown") do |event|
  if event[:key].to_s == "Tab"
    event.preventDefault
    start_pos = event[:target][:selectionStart].to_i
    end_pos = event[:target][:selectionEnd].to_i
    value = editor[:value].to_s
    editor[:value] = value[0...start_pos] + "  " + value[end_pos..]
    new_pos = start_pos + 2
    editor.setSelectionRange(new_pos, new_pos)
  end
end
