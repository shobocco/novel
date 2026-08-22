# 残クレバハムートで魔王討伐
## ② 推奨フォルダ構成

```text
bahamut_novel/
├─ README.md
│
├─ docs/
│  ├─ game_design.md
│  ├─ scenario_spec.md
│  ├─ ending_conditions.md
│  ├─ asset_list.md
│  ├─ folder_structure.md
│  └─ prototype_implementation_log.md
│
├─ scenario/
│  ├─ chapter01_intro.json
│  ├─ chapter02_contract.json
│  ├─ chapter03_guild.json
│  ├─ chapter04_goblin.json
│  ├─ chapter05_orc.json
│  ├─ chapter06_journey.json
│  ├─ chapter07_demon_realm.json
│  ├─ chapter08_demon_king.json
│  ├─ chapter09_truth.json
│  ├─ chapter10_branch.json
│  ├─ route_normal.json
│  ├─ route_good.json
│  └─ endings.json
│
├─ assets/
│  ├─ characters/
│  │  ├─ hero/
│  │  │  ├─ hero_normal.png
│  │  │  ├─ hero_smile.png
│  │  │  ├─ hero_confused.png
│  │  │  ├─ hero_surprised.png
│  │  │  ├─ hero_angry.png
│  │  │  └─ hero_despair.png
│  │  │
│  │  ├─ god/
│  │  │  ├─ god_normal.png
│  │  │  ├─ god_smile.png
│  │  │  ├─ god_evil_smile.png
│  │  │  ├─ god_serious.png
│  │  │  ├─ god_angry.png
│  │  │  └─ god_battle.png
│  │  │
│  │  ├─ demon_king/
│  │  │  ├─ demon_king_normal.png
│  │  │  ├─ demon_king_amazed.png
│  │  │  ├─ demon_king_smile.png
│  │  │  ├─ demon_king_serious.png
│  │  │  └─ demon_king_battle.png
│  │  │
│  │  ├─ bahamut/
│  │  │  ├─ bahamut_normal.png
│  │  │  ├─ bahamut_annoyed.png
│  │  │  ├─ bahamut_angry.png
│  │  │  └─ bahamut_battle.png
│  │  │
│  │  ├─ guild_receptionist/
│  │  │  ├─ guild_receptionist_normal.png
│  │  │  ├─ guild_receptionist_smile.png
│  │  │  └─ guild_receptionist_surprised.png
│  │  │
│  │  └─ mysterious_demon/
│  │     └─ mysterious_demon_normal.png
│  │
│  ├─ enemies/
│  │  ├─ goblin.png
│  │  ├─ goblin_leader.png
│  │  ├─ orc.png
│  │  ├─ orc_king.png
│  │  ├─ wyvern.png
│  │  ├─ golem.png
│  │  ├─ demon_soldier.png
│  │  └─ demon_mage.png
│  │
│  ├─ backgrounds/
│  │  ├─ bg_town_day.png
│  │  ├─ bg_guild.png
│  │  ├─ bg_inn.png
│  │  ├─ bg_forest.png
│  │  ├─ bg_road.png
│  │  ├─ bg_orc_village.png
│  │  ├─ bg_dungeon_entrance.png
│  │  ├─ bg_dungeon.png
│  │  ├─ bg_demon_realm.png
│  │  ├─ bg_demon_castle.png
│  │  ├─ bg_throne_room.png
│  │  ├─ bg_sky.png
│  │  ├─ bg_heaven_temple.png
│  │  └─ bg_heaven_temple_destroyed.png
│  │
│  ├─ events/
│  │  ├─ cg_bahamut_arrival.png
│  │  ├─ cg_contract_10billion.png
│  │  ├─ cg_first_payment.png
│  │  ├─ cg_demon_king_first_meeting.png
│  │  ├─ cg_demon_king_fraud_reaction.png
│  │  ├─ cg_team_up.png
│  │  ├─ cg_god_true_form.png
│  │  ├─ cg_final_battle.png
│  │  ├─ cg_contract_destroyed.png
│  │  └─ cg_good_end.png
│  │
│  ├─ ui/
│  │  ├─ textbox.png
│  │  ├─ choice_button.png
│  │  ├─ choice_button_hover.png
│  │  ├─ status_panel.png
│  │  ├─ quest_panel.png
│  │  ├─ loan_panel.png
│  │  ├─ title_logo.png
│  │  └─ gameover.png
│  │
│  ├─ documents/
│  │  ├─ bahamut_contract.png
│  │  ├─ loan_invoice.png
│  │  ├─ guild_quest.png
│  │  └─ bahamut_appraisal.png
│  │
│  └─ effects/
│     ├─ effect_slash.png
│     ├─ effect_magic_dark.png
│     ├─ effect_magic_holy.png
│     └─ effect_bahamut_breath.png
│
├─ audio/
│  ├─ bgm/
│  └─ se/
│
├─ game/
│  ├─ index.html
│  ├─ css/
│  │  └─ style.css
│  ├─ js/
│  │  ├─ main.js
│  │  ├─ scenario.js
│  │  ├─ game_state.js
│  │  ├─ ui.js
│  │  ├─ battle.js
│  │  ├─ save.js
│  │  ├─ game_bundle.js
│  │  └─ scenario_bundle.js
│  └─ data/
│     ├─ characters.json
│     ├─ enemies.json
│     └─ game_balance.json
│
├─ tests/
│  ├─ validate_game.mjs
│  └─ build_game_bundle.mjs
│
└─ saves/
```

# 1. assets の考え方

画像素材はすべて `assets` 以下に置く。

Codexに画像を探させる必要がないように、

**用途ごとにフォルダを分ける。**

---

# 2. characters

キャラクター立ち絵。

```text
assets/characters/
```

キャラクターごとに専用フォルダを作る。

例：

```text
assets/characters/hero/
assets/characters/god/
assets/characters/demon_king/
assets/characters/bahamut/
```

すべて原則、

**透過PNG**

とする。

---

# 3. キャラクター命名規則

基本形式：

```text
キャラクター名_表情.png
```

例：

```text
hero_normal.png
hero_smile.png
hero_angry.png
god_normal.png
god_evil_smile.png
demon_king_serious.png
```

ファイル名には日本語を使用しない。

Codexやブラウザ側での扱いやすさを優先し、

- 英小文字
- 数字
- アンダースコア

のみを使用する。

---

# 4. バハムートについて

バハムートは人型ではないが、

```text
assets/characters/bahamut/
```

に入れる。

理由は、敵ではなく主要キャラクターとして会話に参加するため。

```text
bahamut_normal.png
bahamut_annoyed.png
bahamut_angry.png
bahamut_battle.png
```

のように管理する。

---

# 5. enemies

戦闘用モンスター。

```text
assets/enemies/
```

例：

```text
goblin.png
goblin_leader.png
orc.png
orc_king.png
wyvern.png
golem.png
```

基本的に、

**1ファイルにつき1体**

とする。

背景は透明。

---

# 6. backgrounds

会話画面で使用する背景。

```text
assets/backgrounds/
```

基本サイズは、

**1920 × 1080**

推奨。

アスペクト比：

**16:9**

背景ファイルには必ず、

```text
bg_
```

を付ける。

例：

```text
bg_forest.png
bg_guild.png
bg_demon_castle.png
```

これによってキャラクター画像と簡単に区別できる。

---

# 7. events

イベントCG。

```text
assets/events/
```

通常の立ち絵＋背景では表現しにくい重要シーンに使用する。

例：

```text
cg_bahamut_arrival.png
cg_contract_10billion.png
cg_team_up.png
cg_final_battle.png
```

イベントCGは、

```text
cg_
```

から始める。

---

# 8. documents

このゲームでは重要度が高い。

```text
assets/documents/
```

ここには、

- バハムート契約書
- ローン請求書
- ギルド依頼書
- バハムート査定書

などを置く。

例：

```text
bahamut_contract.png
loan_invoice.png
guild_quest.png
bahamut_appraisal.png
```

この作品独自のギャグを成立させる重要素材なので、

通常の背景画像とは別管理する。

---

# 9. UI

ゲーム画面そのものに使う画像。

```text
assets/ui/
```

例：

```text
textbox.png
choice_button.png
status_panel.png
loan_panel.png
```

プロトタイプ段階では、

CSSで代替できるものは画像化しなくてもよい。

特に、

- テキストボックス
- 選択肢ボタン
- ステータスパネル

は最初はCSSで実装して構わない。

---

# 10. effects

戦闘・魔法演出用。

```text
assets/effects/
```

例：

```text
effect_slash.png
effect_bahamut_breath.png
effect_magic_dark.png
```

プロトタイプ初期にはなくてもよい。

---

# 11. scenario

シナリオデータを置く。

```text
scenario/
```

章単位でファイルを分ける。

理由は、

**1つの巨大ファイルにするとCodexによる修正が難しくなるため。**

推奨：

```text
chapter01_intro.json
chapter02_contract.json
chapter03_guild.json
```

---

# 12. scenario と画像を直接対応させる

シナリオ内では、

```json
{
  "background": "bg_guild",
  "character": "guild_receptionist",
  "expression": "normal"
}
```

のように指定する。

プログラム側で、

```text
bg_guild
```

を

```text
assets/backgrounds/bg_guild.png
```

へ変換する。

同様に、

```text
hero + angry
```

なら、

```text
assets/characters/hero/hero_angry.png
```

を表示する。

この方式にすることで、シナリオファイルへ長い画像パスを書く必要がない。

---

# 13. game

実際のプログラム。

```text
game/
```

HTML / CSS / JavaScriptでブラウザゲームとして実装する場合、

```text
game/index.html
```

を開けばゲーム開始できる状態を目標とする。

---

# 14. JavaScriptファイルの役割

## main.js

ゲーム起動。

初期化処理。

---

## scenario.js

シナリオデータ読み込み。

台詞送り。

選択肢。

---

## game_state.js

ゲーム内変数管理。

例：

```text
money
loanPayment
bahamutValue
chapter
route
```

---

## ui.js

画面表示。

- 立ち絵
- 背景
- 名前
- 台詞
- 選択肢
- ステータス

を管理。

---

## battle.js

簡易戦闘。

プロトタイプでは高度な戦闘システムにしない。

---

## save.js

セーブ・ロード。

これはプロトタイプ完成後に追加してもよい。

---

# 15. game/data

ゲームバランスに関係する数値はシナリオから分離する。

```text
game/data/game_balance.json
```

例：

```json
{
  "initialMoney": 120000,
  "monthlyLoan": 100000,
  "goblinReward": 30000,
  "orcReward": 80000
}
```

このようにすれば、

報酬額を変更するときにシナリオ本文を書き換える必要がない。

---

# 16. characters.json

キャラクター情報。

例：

```json
{
  "hero": {
    "name": "主人公"
  },
  "god": {
    "name": "神様"
  },
  "bahamut": {
    "name": "バハムート"
  },
  "demon_king": {
    "name": "魔王"
  }
}
```

---

# 17. enemies.json

敵情報。

例：

```json
{
  "goblin": {
    "name": "ゴブリン",
    "reward": 30000
  },
  "orc": {
    "name": "オーク",
    "reward": 80000
  }
}
```

---

# 18. docs

Codexへ仕様を伝えるための資料。

```text
docs/
```

ここは非常に重要。

最終的に、

```text
README.md
docs/game_design.md
docs/scenario_spec.md
docs/ending_conditions.md
docs/asset_list.md
docs/folder_structure.md
docs/prototype_implementation_log.md
```

の7つを読めば、

**Codexがゲーム全体を理解できる**

状態を目標とする。

---

# 19. 現在作成済みの画像の配置

これまで作成した基本立ち絵は、

```text
assets/characters/hero/hero_normal.png
assets/characters/god/god_normal.png
assets/characters/demon_king/demon_king_normal.png
assets/characters/bahamut/bahamut_normal.png
```

として配置する。

今後生成する画像もこの命名規則に統一する。

---

# 20. 最初のプロトタイプで必須の画像

まず以下だけあれば実装開始可能。

```text
assets/characters/
  hero/hero_normal.png
  god/god_normal.png
  demon_king/demon_king_normal.png
  bahamut/bahamut_normal.png
  guild_receptionist/guild_receptionist_normal.png

assets/enemies/
  goblin.png
  orc.png

assets/backgrounds/
  bg_town_day.png
  bg_guild.png
  bg_forest.png
  bg_road.png
  bg_demon_castle.png
  bg_throne_room.png
  bg_sky.png
  bg_heaven_temple.png
```

表情差分やイベントCGは後から追加可能。

---

# 21. 最重要ルール

今後、新しい画像素材を作成するときは、

**生成する前にファイル名を決める。**

例：

```text
guild_receptionist_normal.png
```

を作る場合、

用途：

**ギルド受付嬢の通常立ち絵**

保存先：

```text
assets/characters/guild_receptionist/
```

と決めてから生成する。

これにより、

**画像生成 → プロジェクトへコピー → 即ゲームで使用**

という流れにする。
