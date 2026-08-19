---
title: "Antigravity CLI でコンテキスト使用率などの情報をステータスラインに表示する方法"
emoji: "⚙️"
type: "idea"
topics:
  - "ai"
  - "cli"
  - "gemini"
  - "antigravity"
  - "antigravitycli"
published: true
published_at: "2026-06-23 11:56"
---

## はじめに
筆者は Antigravity IDE と Antigravity CLI をよく使うのですが、最近 ClaudeCode のように「Antigravity CLI のステータスラインにコンテキスト使用率を表示できないものか」と思い悩んでいました。

結論から書くと[antigravity-cli リポジトリ](https://github.com/google-antigravity/antigravity-cli/tree/main)内にある[`statusline`設定例](https://github.com/google-antigravity/antigravity-cli/blob/main/examples/statusline/statusline.sh)を参照することで、以下キャプチャのようにステータスラインにコンテキスト使用率を表示できるようになりました。
※ctx...の部分、その他 アーティファクト（AIが生成した途中成果物・プロトタイプや人間側との相互認識共有用データなど文脈によって様々な解釈があります）、サブエージェントや実行中タスク、サンドボックス環境のon/offなども確認可能

![Antigravity CLI でコンテキスト使用率などの情報をステータスラインに表示](https://static.zenn.studio/user-upload/42d650deb118-20260623.png)

[`statusline`設定例](https://github.com/google-antigravity/antigravity-cli/blob/main/examples/statusline/statusline.sh)（公式リポジトリ）には Mac/Linux 向けの Bash スクリプトしか用意されていないため、本記事では Windows(PowerShell) 環境でもステータスラインを表示できるよう独自に調整したスクリプトと設定手順も合わせて紹介します。

### おさらいとして、Antigravity CLI でステータスラインを表示する方法
Antigravity CLI では `/config`コマンドでステータスラインに表示するものをコントロールできたり、`/statusline`コマンドで表示・非表示を切り替えられます。
その他、`~/.gemini/antigravity-cli/settings.json`（ホストにある設定ファイル）でもコントロールできます。

- Antigravity CLI  `/config`コマンド
![Antigravity CLI  `/config`コマンド](https://static.zenn.studio/user-upload/48ea2226b072-20260623.png)

サンドボックスをはじめ、各種機能の有効・無効の切り替えが設定できます。`Use AI Credits`を on にするとその使用量がステータスラインに表示されます。

- Antigravity CLI  `/statusline`コマンド
デフォルトは使用中のモデルのみ表示されており、`Use AI Credits`を on にするとその使用量がステータスラインに表示されます。
![](https://static.zenn.studio/user-upload/f37ef36683d7-20260623.png)

## 具体的な設定方法
Mac/Linux環境とWindows環境それぞれで説明していきますが、前提として両者共通となる設定ファイルを紹介します。

- `~/.gemini/antigravity-cli/settings.json`
ホストにあるファイルです。ワークスペースに自分で作成するような settings.json ではないので注意してください。
特に、Macでは不可視ファイルになっているので`Cmd + Shift + . `で不可視ファイルを表示しないと見つからないと思います（Mac環境で置いている場所： Macintosh HD -> ユーザ -> 使用中のホスト -> .gemini）。

- `statusline.sh` | `statusline.ps1`
ステータスライン表示用コマンドファイルです。Mac/Linux: `statusline.sh`、Windows: `statusline.ps1`となります。

### Mac/Linux OS
- `~/.gemini/antigravity-cli/settings.json`を設定
ステータスライン表示用コマンドファイル（`statusline.sh`）を読み込むように設定します。
```diff
{
  // ...（他の設定）},
  "statusLine": {
    "type": "",
+   "command": "/Users/ユーザー名/.gemini/antigravity-cli/statusline.sh",
    "enabled": true
  },
  {// ...（他の設定）
}
```

#### `statusline.sh`作成後のパーミッション付与
Mac/Linux環境では以下の作業が必要になります。

- `statusline.sh`ファイル作成後、ターミナルで一度だけ実行権限を付与してください
```bash
chmod +x ~/.gemini/antigravity-cli/statusline.sh
```

#### `statusline.sh`
これは、参照ページ（[`statusline`設定例](https://github.com/google-antigravity/antigravity-cli/blob/main/examples/statusline/statusline.sh)）にある通りなのですが念のため転記しておきます。
```bash
#!/bin/bash
set -euo pipefail

# ─── ANSI Helpers (Standard 16-color palette only) ───────────────────────────
R="\033[0m"         # Reset
B="\033[1m"         # Bold
D="\033[2m"         # Dim
I="\033[3m"         # Italic

# Foreground accents (Standard 16 colors)
FG_BLACK="\033[30m"
FG_RED="\033[31m"
FG_GREEN="\033[32m"
FG_YELLOW="\033[33m"
FG_BLUE="\033[34m"
FG_MAGENTA="\033[35m"
FG_CYAN="\033[36m"
FG_WHITE="\033[37m"

FG_GRAY="\033[90m"
FG_BRIGHT_RED="\033[91m"
FG_BRIGHT_GREEN="\033[92m"
FG_BRIGHT_YELLOW="\033[93m"
FG_BRIGHT_BLUE="\033[94m"
FG_BRIGHT_MAGENTA="\033[95m"
FG_BRIGHT_CYAN="\033[96m"
FG_BRIGHT_WHITE="\033[97m"

# Number Highlight Color
NUM_COLOR="${FG_BRIGHT_WHITE}${B}"

# ─── Parse JSON from stdin (Single jq pass for performance) ──────────────────
# Extract all fields in one pass to prevent spawning jq 8 times.
{
  read -r STATE
  read -r USED_PCT
  read -r VCS_BRANCH
  read -r VCS_DIRTY
  read -r SANDBOX
  read -r ARTIFACTS
  read -r SUBAGENTS
  read -r BG_TASKS
  read -r MODEL
  read -r COLS
} <<< "$(
  jq -r '
    (.agent_state // "idle"),
    (.context_window.used_percentage // 0),
    (.vcs.branch // ""),
    (.vcs.dirty // false),
    (.sandbox.enabled // false),
    (.artifact_count // 0),
    (if .subagents | type == "array" then (.subagents | length) else 0 end),
    (.task_count // 0),
    (.model.display_name // ""),
    (.terminal_width // 80)
  ' 2>/dev/null || printf "idle\n0\n\nfalse\nfalse\n0\n0\n0\n\n80\n"
)"

# ─── Computed Values ─────────────────────────────────────────────────────────
# Use LC_NUMERIC=C to prevent bash printf errors in locales that use commas for decimals
PCT_FMT=$(LC_NUMERIC=C printf "%.1f" "$USED_PCT")
PCT_INT=${USED_PCT%.*}; PCT_INT=${PCT_INT:-0}

# ─── State Indicator (No background colors) ──────────────────────────────────
case "$STATE" in
  idle)     S="${FG_BRIGHT_GREEN}${B}●READY${R}" ;;
  thinking) S="${FG_BRIGHT_YELLOW}${B}◆THINKING${R}" ;;
  working)  S="${FG_BRIGHT_CYAN}${B}⚙WORKING${R}" ;;
  tool_use) S="${FG_BRIGHT_MAGENTA}${B}🔧TOOL${R}" ;;
  *)        S="${FG_WHITE}${B}⏳$(echo "$STATE" | tr '[:lower:]' '[:upper:]')${R}" ;;
esac

# ─── VCS Branch ──────────────────────────────────────────────────────────────
V=""
if [ -n "$VCS_BRANCH" ]; then
  if [ "$VCS_DIRTY" = "true" ]; then
    V="${FG_GRAY} ╱ ${FG_BRIGHT_RED}${VCS_BRANCH}${FG_BRIGHT_YELLOW}*${R}"
  else
    V="${FG_GRAY} ╱ ${FG_BRIGHT_BLUE}${VCS_BRANCH}${R}"
  fi
fi

# ─── Model ───────────────────────────────────────────────────────────────────
M=""
if [ -n "$MODEL" ]; then
  M="${FG_GRAY} ╱ ${FG_BRIGHT_MAGENTA}${I}${MODEL}${R}"
fi

# ─── Sandbox Badge ───────────────────────────────────────────────────────────
if [ "$SANDBOX" = "true" ]; then
  SB="${FG_GRAY}sandbox ${FG_BRIGHT_GREEN}${B}ON${R}"
else
  SB="${FG_GRAY}sandbox off${R}"
fi

# ─── Context Bar (15 segments, fine-grain Unicode) ────────────────────────────
BAR_LEN=15
FILLED=$((PCT_INT * BAR_LEN / 100))
REMAINDER=$(( (PCT_INT * BAR_LEN) % 100 ))

# Pick color based on percentage
if [ "$PCT_INT" -ge 90 ]; then
  BAR_COLOR="$FG_BRIGHT_RED"
elif [ "$PCT_INT" -ge 60 ]; then
  BAR_COLOR="$FG_BRIGHT_YELLOW"
else
  BAR_COLOR="$FG_BRIGHT_WHITE"
fi

# Build bar with partial-fill last block
BAR=""
for ((i = 0; i < BAR_LEN; i++)); do
  if [ "$i" -lt "$FILLED" ]; then
    BAR="${BAR}█"
  elif [ "$i" -eq "$FILLED" ]; then
    if [ "$REMAINDER" -ge 75 ]; then
      BAR="${BAR}▓"
    elif [ "$REMAINDER" -ge 50 ]; then
      BAR="${BAR}▒"
    elif [ "$REMAINDER" -ge 25 ]; then
      BAR="${BAR}░"
    else
      BAR="${BAR}·"
    fi
  else
    BAR="${BAR}·"
  fi
done

# ─── Stats ───────────────────────────────────────────────────────────────────
CTX="${FG_GRAY}ctx ${BAR_COLOR}${BAR} ${NUM_COLOR}${PCT_FMT}%${R}"
ART_FMT="${FG_GRAY}artifacts ${NUM_COLOR}${ARTIFACTS}${R}"
SUB_FMT="${FG_GRAY}subagents ${NUM_COLOR}${SUBAGENTS}${R}"
BG_FMT="${FG_GRAY}tasks ${NUM_COLOR}${BG_TASKS}${R}"

# ─── Separators ──────────────────────────────────────────────────────────────
DOT="${FG_GRAY} · ${R}"

# ─── Output ──────────────────────────────────────────────────────────────────
LINE1="${S}${M}${V}"
LINE2="${CTX}${DOT}${ART_FMT}${DOT}${SUB_FMT}${DOT}${BG_FMT}${DOT}${SB}"

if [ "$COLS" -ge 120 ]; then
  # Wide: single line
  echo -e "${LINE1}${FG_GRAY}  │  ${R}${LINE2}"
elif [ "$COLS" -ge 80 ]; then
  # Medium: two-line layout with border
  echo -e "${FG_GRAY}╭─${R} ${LINE1}"
  echo -e "${FG_GRAY}╰─${R}${LINE2}"
else
  # Narrow: compact two-line, minimal chrome
  echo -e "${S}${M}"
  echo -e "${CTX}${DOT}${BG_FMT}"
fi
```

### Windows OS
- `~/.gemini/antigravity-cli/settings.json`を設定
ステータスライン表示用コマンドファイル（`statusline.ps1`）を読み込むように設定します。
```diff
{
  // ...（他の設定）},
  "statusLine": {
    "type": "",
+   "command": "powershell -NoProfile -File C:\\Users\\ユーザー名\\.gemini\\antigravity-cli\\statusline.ps1",
    "enabled": true
  },
  {// ...（他の設定）
}
```

::: message
- Windows環境でも WSL があれば `statusline.sh` で設定可能です。
その場合 `~/.gemini/antigravity-cli/settings.json`での command の設定は以下のように記述します。

【WSL内のLinuxホームに置く場合】： `"command": "wsl bash /home/ユーザー名/.gemini/statusline.sh"`
【Windowsのファイルシステム上に置く場合】： `"command": "wsl bash /mnt/c/Users/ユーザー名/.gemini/antigravity-cli/statusline.sh"`
:::

#### `statusline.ps1`
「PowerShell 7+」の場合は`$([char]27)`を`` `e ``（エスケープ文字）に置き換えることも可能（`$([char]27)`はPS5/PS7両対応）ですが、「PowerShell 5」の場合は`` `e ``（エスケープ文字）はPS5では動作しません。PS5環境の場合は`` `e ``を"$([char]27)"に置き換えが必要です。

※筆者のWindowsでは PowerShell 5 だったので`$([char]27)`を利用
```powershell
# ─── ANSI Helpers (Standard 16-color palette only) ───────────────────────────
$R  = "$([char]27)[0m"   # Reset
$B  = "$([char]27)[1m"   # Bold
$D  = "$([char]27)[2m"   # Dim
$I  = "$([char]27)[3m"   # Italic

# Foreground accents (Standard 16 colors)
$FG_BLACK          = "$([char]27)[30m"
$FG_RED            = "$([char]27)[31m"
$FG_GREEN          = "$([char]27)[32m"
$FG_YELLOW         = "$([char]27)[33m"
$FG_BLUE           = "$([char]27)[34m"
$FG_MAGENTA        = "$([char]27)[35m"
$FG_CYAN           = "$([char]27)[36m"
$FG_WHITE          = "$([char]27)[37m"

$FG_GRAY           = "$([char]27)[90m"
$FG_BRIGHT_RED     = "$([char]27)[91m"
$FG_BRIGHT_GREEN   = "$([char]27)[92m"
$FG_BRIGHT_YELLOW  = "$([char]27)[93m"
$FG_BRIGHT_BLUE    = "$([char]27)[94m"
$FG_BRIGHT_MAGENTA = "$([char]27)[95m"
$FG_BRIGHT_CYAN    = "$([char]27)[96m"
$FG_BRIGHT_WHITE   = "$([char]27)[97m"

# Number Highlight Color
$NUM_COLOR = "${FG_BRIGHT_WHITE}${B}"

# ─── Parse JSON from stdin ───────────────────────────────────────────────────
$data = $input | ConvertFrom-Json

$STATE      = if ($data.agent_state)                              { $data.agent_state }                          else { "idle" }
$USED_PCT   = if ($null -ne $data.context_window.used_percentage) { [double]$data.context_window.used_percentage } else { 0.0 }
$VCS_BRANCH = if ($data.vcs.branch)                               { $data.vcs.branch }                          else { "" }
$VCS_DIRTY  = if ($data.vcs.dirty)                                { $data.vcs.dirty }                           else { $false }
$SANDBOX    = if ($data.sandbox.enabled)                          { $data.sandbox.enabled }                     else { $false }
$ARTIFACTS  = if ($null -ne $data.artifact_count)                 { $data.artifact_count }                      else { 0 }
$SUBAGENTS  = if ($data.subagents -is [array])                    { $data.subagents.Count }                     else { 0 }
$BG_TASKS   = if ($null -ne $data.task_count)                     { $data.task_count }                          else { 0 }
$MODEL      = if ($data.model.display_name)                       { $data.model.display_name }                  else { "" }
$COLS       = if ($null -ne $data.terminal_width)                 { [int]$data.terminal_width }                 else { 80 }

# ─── Computed Values ─────────────────────────────────────────────────────────
$PCT_FMT = "{0:F1}" -f $USED_PCT
$PCT_INT = [int][math]::Floor($USED_PCT)

# ─── State Indicator ─────────────────────────────────────────────────────────
$S = switch ($STATE) {
    "idle"     { "${FG_BRIGHT_GREEN}${B}●READY${R}" }
    "thinking" { "${FG_BRIGHT_YELLOW}${B}◆THINKING${R}" }
    "working"  { "${FG_BRIGHT_CYAN}${B}⚙WORKING${R}" }
    "tool_use" { "${FG_BRIGHT_MAGENTA}${B}🔧TOOL${R}" }
    default    { "${FG_WHITE}${B}⏳$($STATE.ToUpper())${R}" }
}

# ─── VCS Branch ──────────────────────────────────────────────────────────────
$V = ""
if ($VCS_BRANCH -ne "") {
    if ($VCS_DIRTY) {
        $V = "${FG_GRAY} ╱ ${FG_BRIGHT_RED}${VCS_BRANCH}${FG_BRIGHT_YELLOW}*${R}"
    } else {
        $V = "${FG_GRAY} ╱ ${FG_BRIGHT_BLUE}${VCS_BRANCH}${R}"
    }
}

# ─── Model ───────────────────────────────────────────────────────────────────
$M = ""
if ($MODEL -ne "") {
    $M = "${FG_GRAY} ╱ ${FG_BRIGHT_MAGENTA}${I}${MODEL}${R}"
}

# ─── Sandbox Badge ───────────────────────────────────────────────────────────
if ($SANDBOX) {
    $SB = "${FG_GRAY}sandbox ${FG_BRIGHT_GREEN}${B}ON${R}"
} else {
    $SB = "${FG_GRAY}sandbox off${R}"
}

# ─── Context Bar (15 segments, fine-grain Unicode) ────────────────────────────
$BAR_LEN   = 15
$FILLED    = [int][math]::Floor($PCT_INT * $BAR_LEN / 100)
$REMAINDER = ($PCT_INT * $BAR_LEN) % 100

# Pick color based on percentage
if ($PCT_INT -ge 90) {
    $BAR_COLOR = $FG_BRIGHT_RED
} elseif ($PCT_INT -ge 60) {
    $BAR_COLOR = $FG_BRIGHT_YELLOW
} else {
    $BAR_COLOR = $FG_BRIGHT_WHITE
}

# Build bar with partial-fill last block
# Unicode block chars via [char] to avoid encoding issues
$FULL    = [char]0x2588  # █
$DARK    = [char]0x2593  # ▓
$MEDIUM  = [char]0x2592  # ▒
$LIGHT   = [char]0x2591  # ░
$EMPTY   = [char]0x00B7  # ·

$BAR = ""
for ($i = 0; $i -lt $BAR_LEN; $i++) {
    if ($i -lt $FILLED) {
        $BAR += $FULL
    } elseif ($i -eq $FILLED) {
        if ($REMAINDER -ge 75)     { $BAR += $DARK }
        elseif ($REMAINDER -ge 50) { $BAR += $MEDIUM }
        elseif ($REMAINDER -ge 25) { $BAR += $LIGHT }
        else                       { $BAR += $EMPTY }
    } else {
        $BAR += $EMPTY
    }
}

# ─── Stats ───────────────────────────────────────────────────────────────────
$CTX     = "${FG_GRAY}ctx ${BAR_COLOR}${BAR} ${NUM_COLOR}${PCT_FMT}%${R}"
$ART_FMT = "${FG_GRAY}artifacts ${NUM_COLOR}${ARTIFACTS}${R}"
$SUB_FMT = "${FG_GRAY}subagents ${NUM_COLOR}${SUBAGENTS}${R}"
$BG_FMT  = "${FG_GRAY}tasks ${NUM_COLOR}${BG_TASKS}${R}"

# ─── Separators ──────────────────────────────────────────────────────────────
$DOT = "${FG_GRAY} · ${R}"

# ─── Output ──────────────────────────────────────────────────────────────────
$LINE1 = "${S}${M}${V}"
$LINE2 = "${CTX}${DOT}${ART_FMT}${DOT}${SUB_FMT}${DOT}${BG_FMT}${DOT}${SB}"

if ($COLS -ge 120) {
    # Wide: single line
    Write-Output "${LINE1}${FG_GRAY}  |  ${R}${LINE2}"
} elseif ($COLS -ge 80) {
    # Medium: two-line layout with border
    Write-Output "${FG_GRAY} ${R}${LINE1}`n${FG_GRAY} ${R}${LINE2}"
} else {
    # Narrow: compact two-line, minimal chrome
    Write-Output "${S}${M}`n${CTX}${DOT}${BG_FMT}"
}
```

#### Windows OS ではサブエージェントを起動するとステータスラインが更新されなくなる
Mac 環境では起きなかったのですが、Windows OS で上記調整したファイルを使うと**サブエージェントを起動した場合にコンテキスト使用量が0%となって更新されなくなります**。
色々調べてみていますがAntigravity CLIとWindows OS間での通信齟齬の可能性などはっきりとしていません。今後も調べてみるつもりですが何かご存じの方はお教えいただけますとありがたいです。

回避策として`/context`コマンドでコンテキストを確認することはできます。
![`/context`コマンドでコンテキストを確認](https://static.zenn.studio/user-upload/7b8fcdf24b56-20260623.png)


## まとめ
最初、Gemini と Claude にステータスラインへの表示可否を聞いた時「Antigravity CLI には Claude Code のようなステータスラインに使用量を表示する方法は現状ありません」と言われていましたが、根気強く検証したり、調べたりすると参照ページ（[`statusline`設定例](https://github.com/google-antigravity/antigravity-cli/blob/main/examples/statusline/statusline.sh)）に当たりました。

AI時代では、AIの回答（ハルシネーションや知識不足）を鵜呑みにせず、粘り強く一次情報やソースコードにあたるタフさも重要かもしれませんね。
Antigravity CLI でコンテキスト使用率などを表示したい方々の参考になれば幸いです。

ここまで読んでいただき、ありがとうございました。


