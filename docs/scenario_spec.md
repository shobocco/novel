# 残クレバハムートで魔王討伐
## ③ シナリオデータ仕様

# 1. 基本方針

シナリオはJSON形式で管理する。

目的は、

- 台詞
- 背景変更
- キャラクター表示
- 表情変更
- キャラクター退場
- 選択肢
- 所持金増減
- ローン返済
- バハムート査定額
- フラグ管理
- 条件分岐
- シーン移動
- エンディング

を、同じシナリオデータから実行できるようにすること。

ゲーム本体側では、

```text
scenario/*.json
```

を順番に読み込んでゲームを進行する。

---

# 2. シナリオファイルの基本構造

各JSONファイルは以下の形式とする。

```json
{
  "chapter": "chapter01_intro",
  "title": "第一章 冒険者と神様",
  "startScene": "scene_001",
  "scenes": {
    "scene_001": {
      "steps": []
    }
  }
}
```

---

# 3. chapter

ファイルを識別する内部ID。

例：

```json
"chapter": "chapter01_intro"
```

ファイル名と基本的に一致させる。

```text
chapter01_intro.json
```

---

# 4. title

章タイトル。

```json
"title": "第一章 冒険者と神様"
```

章開始時に表示してもよい。

---

# 5. startScene

そのファイルを開始した際、最初に実行するシーン。

```json
"startScene": "scene_001"
```

---

# 6. scenes

章の中に複数のシーンを格納する。

```json
"scenes": {
  "scene_001": {
    "steps": []
  },
  "scene_002": {
    "steps": []
  }
}
```

シーンIDは、

```text
scene_001
scene_002
scene_003
```

の形式を基本とする。

---

# 7. steps

実際のゲーム進行。

stepsを上から順番に実行する。

例：

```json
{
  "type": "dialogue",
  "speaker": "hero",
  "text": "今日もなんとか依頼を終えたな……"
}
```

---

# 8. dialogue

通常の台詞。

```json
{
  "type": "dialogue",
  "speaker": "hero",
  "text": "今日もなんとか依頼を終えたな……"
}
```

speakerはキャラクターID。

例：

```text
hero
god
bahamut
demon_king
guild_receptionist
```

画面にはcharacters.jsonで定義された日本語名を表示する。

---

# 9. narration

地の文。

```json
{
  "type": "narration",
  "text": "主人公は討伐を終え、冒険者ギルドへ戻った。"
}
```

この場合、名前欄は表示しない。

---

# 10. background

背景変更。

```json
{
  "type": "background",
  "name": "bg_guild"
}
```

プログラム側で、

```text
assets/backgrounds/bg_guild.png
```

を表示する。

---

# 11. showCharacter

キャラクター表示。

```json
{
  "type": "showCharacter",
  "character": "hero",
  "expression": "normal",
  "position": "left"
}
```

positionは、

```text
left
center
right
```

の3種類を基本とする。

---

# 12. 表情変更

すでに表示されているキャラクターの表情を変更する場合も、

```json
{
  "type": "showCharacter",
  "character": "hero",
  "expression": "surprised",
  "position": "left"
}
```

で上書きする。

画像は、

```text
assets/characters/hero/hero_surprised.png
```

を読み込む。

---

# 13. hideCharacter

キャラクターを画面から消す。

```json
{
  "type": "hideCharacter",
  "character": "hero"
}
```

---

# 14. hideAllCharacters

全キャラクターを消す。

```json
{
  "type": "hideAllCharacters"
}
```

場面転換時に使用する。

---

# 15. wait

演出用の待機。

```json
{
  "type": "wait",
  "duration": 1000
}
```

単位はミリ秒。

プロトタイプでは省略してもよい。

---

# 16. effect

簡易演出。

```json
{
  "type": "effect",
  "name": "flash"
}
```

想定するもの：

```text
flash
shake
fade_black
fade_white
```

画像エフェクトとは別。

CSSやJavaScriptで実装する。

---

# 17. set

ゲーム変数を設定する。

```json
{
  "type": "set",
  "variable": "money",
  "value": 120000
}
```

---

# 18. add

数値を加算する。

```json
{
  "type": "add",
  "variable": "money",
  "value": 30000
}
```

ゴブリン討伐報酬などに使う。

---

# 19. subtract

数値を減算する。

```json
{
  "type": "subtract",
  "variable": "money",
  "value": 100000
}
```

ローン返済などに使用する。

---

# 20. 基本ゲーム変数

最低限、以下を保持する。

```json
{
  "money": 0,
  "loanPayment": 100000,
  "loanPaymentsMade": 0,
  "bahamutValue": 0,
  "chapter": 1,
  "route": "common"
}
```

---

# 21. money

主人公の現在所持金。

```text
money
```

---

# 22. loanPayment

1回のローン支払額。

```text
loanPayment
```

基本値：

```text
100000
```

---

# 23. loanPaymentsMade

これまで何回ローンを払ったか。

```text
loanPaymentsMade
```

返済成功時に、

```json
{
  "type": "add",
  "variable": "loanPaymentsMade",
  "value": 1
}
```

する。

---

# 24. bahamutValue

現在のバハムート査定評価値。

```text
bahamutValue
```

ゲーム上は10億ゴールドそのものを逐一計算しなくてもよい。

プロトタイプでは、

```text
0〜100
```

などの簡易評価値として扱ってもよい。

例：

```json
{
  "type": "add",
  "variable": "bahamutValue",
  "value": 10
}
```

---

# 25. route

現在のルート。

初期値：

```text
common
```

魔王を倒す場合：

```text
normal
```

魔王と共闘する場合：

```text
good
```

---

# 26. flag

イベントフラグ。

例：

```json
{
  "type": "setFlag",
  "flag": "heard_god_truth",
  "value": true
}
```

想定例：

```text
met_bahamut
signed_contract
first_payment_done
met_mysterious_demon
heard_god_truth
joined_demon_king
defeated_god
```

---

# 27. choice

選択肢。

```json
{
  "type": "choice",
  "options": [
    {
      "text": "魔王を倒す",
      "next": "scene_normal_route"
    },
    {
      "text": "魔王を信じる",
      "next": "scene_good_route"
    }
  ]
}
```

プレイヤーが選択するまで進行を停止する。

---

# 28. 選択肢で変数変更

選択肢の中で変数やフラグを変更できるようにする。

```json
{
  "type": "choice",
  "options": [
    {
      "text": "魔王を倒す",
      "actions": [
        {
          "type": "set",
          "variable": "route",
          "value": "normal"
        }
      ],
      "next": "scene_normal_route"
    },
    {
      "text": "魔王を信じる",
      "actions": [
        {
          "type": "set",
          "variable": "route",
          "value": "good"
        }
      ],
      "next": "scene_good_route"
    }
  ]
}
```

---

# 29. condition

条件分岐。

```json
{
  "type": "condition",
  "variable": "money",
  "operator": ">=",
  "value": 100000,
  "trueNext": "scene_payment_success",
  "falseNext": "scene_bad_end_payment"
}
```

---

# 30. 使用可能operator

最低限、

```text
==
!=
>
>=
<
<=
```

を実装する。

---

# 31. flag条件

フラグ判定にも対応する。

```json
{
  "type": "conditionFlag",
  "flag": "joined_demon_king",
  "value": true,
  "trueNext": "scene_god_route",
  "falseNext": "scene_normal_route"
}
```

---

# 32. jump

同じ章の別シーンへ移動。

```json
{
  "type": "jump",
  "scene": "scene_005"
}
```

---

# 33. loadScenario

別のシナリオファイルへ移動。

```json
{
  "type": "loadScenario",
  "file": "chapter02_contract.json"
}
```

---

# 34. battle

簡易戦闘イベント。

プロトタイプでは、

```json
{
  "type": "battle",
  "enemy": "goblin",
  "winNext": "scene_goblin_win",
  "loseNext": "scene_gameover"
}
```

とする。

戦闘システム自体はbattle.jsへ任せる。

---

# 35. reward

討伐報酬専用イベント。

```json
{
  "type": "reward",
  "amount": 30000,
  "label": "ゴブリン討伐報酬"
}
```

内部的には、

```text
money += 30000
```

を行う。

画面上では、

```text
ゴブリン討伐報酬
+30,000 G
```

と大きく表示する。

---

# 36. loanPayment

ローン支払い専用イベント。

```json
{
  "type": "loanPayment",
  "amount": 100000,
  "successNext": "scene_payment_success",
  "failureNext": "ending_bad_a"
}
```

処理：

```text
money >= amount
```

なら支払い成功。

```text
money -= amount
loanPaymentsMade += 1
```

所持金不足なら、

```text
BAD END A
```

へ進む。

---

# 37. appraisal

バハムート査定イベント。

```json
{
  "type": "appraisal",
  "requiredValue": 70,
  "successNext": "ending_normal",
  "failureNext": "ending_bad_b"
}
```

プロトタイプでは、

```text
bahamutValue >= requiredValue
```

で成功とする。

---

# 38. ending

エンディング。

```json
{
  "type": "ending",
  "id": "good_end",
  "title": "GOOD END",
  "text": "ローン契約そのものが消滅しました"
}
```

実行後は通常のシナリオ進行を停止する。

---

# 39. 想定するエンディングID

```text
normal_end
bad_end_a
bad_end_b
bad_end_c
good_end
```

---

# 40. eventCG

イベントCG表示。

```json
{
  "type": "eventCG",
  "name": "cg_bahamut_arrival"
}
```

読み込み先：

```text
assets/events/cg_bahamut_arrival.png
```

---

# 41. document

契約書や請求書表示。

```json
{
  "type": "document",
  "name": "bahamut_contract"
}
```

読み込み：

```text
assets/documents/bahamut_contract.png
```

クリックまたは閉じるボタンでシナリオへ戻る。

---

# 42. statusMessage

ステータス変化を強調表示。

```json
{
  "type": "statusMessage",
  "text": "現在の所持金",
  "variable": "money",
  "suffix": " G"
}
```

このゲームでは頻繁に使用する。

---

# 43. ゴブリン討伐の実例

```json
{
  "chapter": "chapter04_goblin",
  "title": "第四章 ゴブリン討伐",
  "startScene": "scene_001",
  "scenes": {
    "scene_001": {
      "steps": [
        {
          "type": "background",
          "name": "bg_forest"
        },
        {
          "type": "showCharacter",
          "character": "hero",
          "expression": "normal",
          "position": "left"
        },
        {
          "type": "dialogue",
          "speaker": "hero",
          "text": "いた。あれが依頼のゴブリンか。"
        },
        {
          "type": "showCharacter",
          "character": "bahamut",
          "expression": "normal",
          "position": "right"
        },
        {
          "type": "dialogue",
          "speaker": "bahamut",
          "text": "あの程度なら私が一撃で終わらせられる。"
        },
        {
          "type": "dialogue",
          "speaker": "hero",
          "text": "待て。少しくらい俺にも戦わせろ。"
        },
        {
          "type": "battle",
          "enemy": "goblin",
          "winNext": "scene_002",
          "loseNext": "ending_bad_c"
        }
      ]
    },

    "scene_002": {
      "steps": [
        {
          "type": "narration",
          "text": "ゴブリンの討伐に成功した。"
        },
        {
          "type": "add",
          "variable": "bahamutValue",
          "value": 5
        },
        {
          "type": "loadScenario",
          "file": "chapter03_guild_reward.json"
        }
      ]
    }
  }
}
```

---

# 44. ギルド報酬の実例

```json
{
  "chapter": "guild_reward_goblin",
  "title": "討伐報告",
  "startScene": "scene_001",
  "scenes": {
    "scene_001": {
      "steps": [
        {
          "type": "background",
          "name": "bg_guild"
        },
        {
          "type": "showCharacter",
          "character": "guild_receptionist",
          "expression": "smile",
          "position": "center"
        },
        {
          "type": "dialogue",
          "speaker": "guild_receptionist",
          "text": "討伐確認が取れました。こちらが報酬になります。"
        },
        {
          "type": "reward",
          "amount": 30000,
          "label": "ゴブリン討伐報酬"
        },
        {
          "type": "statusMessage",
          "text": "現在の所持金",
          "variable": "money",
          "suffix": " G"
        }
      ]
    }
  }
}
```

---

# 45. ローン返済イベント実例

```json
{
  "chapter": "loan_payment_01",
  "title": "今月のお支払い",
  "startScene": "scene_001",
  "scenes": {
    "scene_001": {
      "steps": [
        {
          "type": "showCharacter",
          "character": "god",
          "expression": "smile",
          "position": "center"
        },
        {
          "type": "dialogue",
          "speaker": "god",
          "text": "主人公さん♪ 今月のお支払い日です♪"
        },
        {
          "type": "loanPayment",
          "amount": 100000,
          "successNext": "scene_success",
          "failureNext": "ending_bad_a"
        }
      ]
    },

    "scene_success": {
      "steps": [
        {
          "type": "dialogue",
          "speaker": "hero",
          "text": "また十万ゴールド消えた……。"
        },
        {
          "type": "statusMessage",
          "text": "現在の所持金",
          "variable": "money",
          "suffix": " G"
        },
        {
          "type": "loadScenario",
          "file": "chapter05_orc.json"
        }
      ]
    }
  }
}
```

---

# 46. 魔王とのルート分岐実例

```json
{
  "type": "choice",
  "options": [
    {
      "text": "魔王を倒す",
      "actions": [
        {
          "type": "set",
          "variable": "route",
          "value": "normal"
        }
      ],
      "next": "scene_fight_demon_king"
    },
    {
      "text": "魔王を信じる",
      "actions": [
        {
          "type": "set",
          "variable": "route",
          "value": "good"
        },
        {
          "type": "setFlag",
          "flag": "joined_demon_king",
          "value": true
        }
      ],
      "next": "scene_team_up"
    }
  ]
}
```

---

# 47. GOOD END実例

```json
{
  "type": "ending",
  "id": "good_end",
  "title": "GOOD END",
  "text": "ローン契約そのものが消滅しました"
}
```

その直前に、

```json
{
  "type": "eventCG",
  "name": "cg_good_end"
}
```

を表示してよい。

---

# 48. BAD END A実例

```json
{
  "type": "ending",
  "id": "bad_end_a",
  "title": "BAD END",
  "text": "ローンの支払いができず、主人公は地下へ送られた。"
}
```

---

# 49. BAD END B実例

```json
{
  "type": "ending",
  "id": "bad_end_b",
  "title": "BAD END",
  "text": "魔王は倒した。しかしバハムートの査定額が足りなかった。"
}
```

---

# 50. BAD END C実例

```json
{
  "type": "ending",
  "id": "bad_end_c",
  "title": "GAME OVER",
  "text": "主人公は魔王との戦いに敗れた。"
}
```

---

# 51. NORMAL END実例

```json
{
  "type": "ending",
  "id": "normal_end",
  "title": "NORMAL END",
  "text": "魔王討伐とバハムートの査定に成功し、主人公は借金から解放された。"
}
```

---

# 52. Codexへの実装ルール

Codexはシナリオ本文をJavaScriptへ直接書かない。

必ず、

```text
scenario/*.json
```

から読み込む。

これによってシナリオ変更時にゲームコードを変更する必要がない構造にする。

---

# 53. 未知のtypeに対する処理

シナリオに未実装のtypeが含まれていた場合、

ゲームをクラッシュさせない。

開発者コンソールへ、

```text
Unknown scenario step type: XXXXX
```

と表示して次のstepへ進む。

---

# 54. データ検証

scenario.js読み込み時に最低限、

```text
chapter
startScene
scenes
steps
```

が存在するか確認する。

存在しない場合はコンソールへエラーを表示する。

---

# 55. プロトタイプで実装必須のtype

最初のバージョンでは最低限、

```text
dialogue
narration
background
showCharacter
hideCharacter
hideAllCharacters
choice
set
add
subtract
setFlag
condition
jump
loadScenario
battle
reward
loanPayment
appraisal
ending
statusMessage
```

を実装する。

以下は後回しでもよい。

```text
effect
wait
eventCG
document
```

---

# 56. シナリオ作成上のルール

台詞とロジックをできるだけ分離する。

例えば単なる報酬なら、

```json
{
  "type": "reward",
  "amount": 30000
}
```

を使用し、

```json
{
  "type": "add",
  "variable": "money",
  "value": 30000
}
```

を毎回手書きしない。

同様にローン返済には、

```text
loanPayment
```

を使う。

これによりシナリオが読みやすくなる。

---

# 57. 最終的な目的

このシナリオ仕様によって、

シナリオ担当はJSONを編集するだけで、

- 背景を変更
- キャラクターを登場
- 表情を変更
- 台詞を表示
- 戦闘
- 報酬
- ローン返済
- 選択肢
- ルート分岐
- エンディング

まで作れる状態を目標とする。

JavaScript側は、

**「JSONに書かれた命令を実行するノベルゲームエンジン」**

として設計する。