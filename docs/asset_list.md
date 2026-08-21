# 残クレバハムートで魔王討伐
## ⑥ 必要画像ファイル一覧

保存先：

```text
docs/asset_list.md
```

# 1. 基本方針

すべての画像素材は、

```text
assets/
```

以下に保存する。

命名規則は以下。

- 英小文字
- 数字
- アンダースコア
- PNG形式を基本とする
- キャラクター・敵は透過PNG
- 背景・イベントCGは16:9
- 1ファイルにつき1素材

日本語ファイル名は使用しない。

---

# 2. 優先度

素材の優先度を以下で分類する。

```text
P0 = プロトタイプ動作に必須
P1 = 初期完成版で欲しい
P2 = 演出強化用
P3 = 後から追加可能
```

まずP0だけで、ゲーム開始からGOOD ENDまで通して遊べる状態を作る。

---

# 3. キャラクター立ち絵

保存先：

```text
assets/characters/
```

基本仕様：

```text
形式：PNG
背景：透明
推奨サイズ：縦1600〜2000px程度
構図：全身
```

---

# 4. 主人公

保存先：

```text
assets/characters/hero/
```

## P0

```text
hero_normal.png
```

用途：

主人公の基本立ち絵。

使用：

全編。

---

## P1

```text
hero_smile.png
hero_confused.png
hero_surprised.png
hero_angry.png
hero_despair.png
```

用途：

```text
hero_smile
→ バハムートとの日常・エンディング

hero_confused
→ 神様との初対面・契約説明

hero_surprised
→ バハムート10億G判明

hero_angry
→ 神様の真実発覚・最終決戦

hero_despair
→ ローン関連・BAD END
```

---

## P2

```text
hero_battle.png
hero_injured.png
```

---

# 5. 神様

保存先：

```text
assets/characters/god/
```

## P0

```text
god_normal.png
```

用途：

神様の基本立ち絵。

---

## P1

```text
god_smile.png
god_evil_smile.png
god_serious.png
god_angry.png
```

用途：

```text
god_smile
→ ローン請求時の営業スマイル

god_evil_smile
→ 本性を匂わせる場面

god_serious
→ 魔王と主人公に追及される

god_angry
→ 最終決戦
```

---

## P1

```text
god_battle.png
```

用途：

GOOD ROUTE最終戦。

通常立ち絵とは明確に異なる、

```text
神様の本気形態
```

として制作する。

---

# 6. 魔王

保存先：

```text
assets/characters/demon_king/
```

## P0

```text
demon_king_normal.png
```

用途：

魔王との初対面。

---

## P1

```text
demon_king_amazed.png
demon_king_smile.png
demon_king_serious.png
demon_king_battle.png
```

特に、

```text
demon_king_amazed.png
```

は重要。

主人公から、

```text
「バハムートを残価クレジットで借りた」
```

と聞いた直後の、

```text
「……それは詐欺ではないのか？」
```

に使用する。

---

# 7. バハムート

保存先：

```text
assets/characters/bahamut/
```

## P0

```text
bahamut_normal.png
```

---

## P1

```text
bahamut_annoyed.png
bahamut_angry.png
bahamut_battle.png
```

用途：

```text
bahamut_annoyed
→ 主人公とのギャグ会話

bahamut_angry
→ 主人公を守る場面

bahamut_battle
→ 強敵・神様戦
```

---

# 8. ギルド受付嬢

保存先：

```text
assets/characters/guild_receptionist/
```

## P0

```text
guild_receptionist_normal.png
```

---

## P1

```text
guild_receptionist_smile.png
guild_receptionist_surprised.png
```

用途：

討伐報告、報酬支払い、バハムートを見て驚く場面。

---

# 9. 謎の魔族

保存先：

```text
assets/characters/mysterious_demon/
```

## P2

```text
mysterious_demon_normal.png
```

中盤の伏線イベント用。

プロトタイプでは省略してもよい。

---

# 10. 敵キャラクター

保存先：

```text
assets/enemies/
```

仕様：

```text
形式：PNG
背景：透明
構図：全身
```

---

# 11. P0敵素材

```text
goblin.png
orc.png
```

この2体があれば、

```text
ゴブリン討伐
オーク討伐
```

を実装できる。

---

# 12. P1敵素材

```text
goblin_leader.png
orc_king.png
wyvern.png
golem.png
demon_soldier.png
```

中盤の討伐クエスト用。

---

# 13. P2敵素材

```text
demon_mage.png
```

魔王領・天空神殿戦用。

---

# 14. 背景

保存先：

```text
assets/backgrounds/
```

推奨仕様：

```text
サイズ：1920 × 1080
比率：16:9
形式：PNG または JPG
人物：基本的に入れない
```

ノベルゲームの背景なので、

画面中央や左右に立ち絵を配置しても見やすい構図にする。

---

# 15. P0背景

プロトタイプ実装に最低限必要。

```text
bg_town_day.png
bg_guild.png
bg_forest.png
bg_road.png
bg_demon_castle.png
bg_throne_room.png
bg_sky.png
bg_heaven_temple.png
```

---

# 16. bg_town_day.png

用途：

ゲーム開始。

冒険者の日常。

---

# 17. bg_guild.png

用途：

- 討伐依頼
- 討伐報告
- 報酬獲得
- ギルド受付嬢との会話

使用頻度が非常に高い。

---

# 18. bg_forest.png

用途：

ゴブリン討伐。

序盤戦闘。

---

# 19. bg_road.png

用途：

主人公とバハムートの移動会話。

章間の会話。

---

# 20. bg_demon_castle.png

用途：

魔王城到着。

後半への転換。

外観を想定。

---

# 21. bg_throne_room.png

用途：

- 魔王との初対面
- NORMAL / GOOD ROUTE分岐
- 魔王戦

重要背景。

---

# 22. bg_sky.png

用途：

神様との初対面。

天空へ転移する演出。

---

# 23. bg_heaven_temple.png

用途：

- 神様との契約
- GOOD ROUTE
- 神様との最終決戦

最重要背景の1つ。

---

# 24. P1背景

```text
bg_inn.png
bg_orc_village.png
bg_dungeon_entrance.png
bg_dungeon.png
bg_demon_realm.png
bg_heaven_temple_destroyed.png
```

---

# 25. bg_inn.png

用途：

主人公の日常。

ローンに苦しむ場面。

---

# 26. bg_orc_village.png

用途：

オーク討伐。

---

# 27. bg_dungeon_entrance.png

用途：

ゴーレムなどの中盤依頼。

---

# 28. bg_dungeon.png

用途：

ダンジョン内部。

---

# 29. bg_demon_realm.png

用途：

魔王領突入。

後半の雰囲気変更。

---

# 30. bg_heaven_temple_destroyed.png

用途：

神様最終戦後。

エピローグ直前。

---

# 31. イベントCG

保存先：

```text
assets/events/
```

推奨仕様：

```text
1920 × 1080
16:9
```

イベントCGは通常立ち絵より制作コストが高いため、

プロトタイプでは必須ではない。

---

# 32. P1イベントCG

```text
cg_bahamut_arrival.png
cg_contract_10billion.png
cg_demon_king_first_meeting.png
cg_demon_king_fraud_reaction.png
cg_team_up.png
cg_god_true_form.png
cg_contract_destroyed.png
cg_good_end.png
```

---

# 33. cg_bahamut_arrival.png

用途：

バハムート初登場。

主人公の前へ巨大な黒竜が降臨する。

序盤最大の見せ場。

---

# 34. cg_contract_10billion.png

用途：

神様から契約書を見せられ、

```text
バハムート価格 10億G
```

と判明する場面。

作品の代表的なギャグCG。

---

# 35. cg_demon_king_first_meeting.png

用途：

主人公と魔王の初対峙。

---

# 36. cg_demon_king_fraud_reaction.png

用途：

魔王：

```text
「……それは詐欺ではないのか？」
```

主人公：

```text
「え？」
```

作品の象徴的な場面。

---

# 37. cg_team_up.png

用途：

GOOD ROUTE。

主人公、バハムート、魔王が並ぶ。

---

# 38. cg_god_true_form.png

用途：

神様が本性を現す。

ラスボス登場CG。

---

# 39. cg_contract_destroyed.png

用途：

主人公が契約書を破壊する。

GOOD END直前。

---

# 40. cg_good_end.png

用途：

主人公、バハムート、魔王のエピローグ。

---

# 41. P2イベントCG

```text
cg_first_payment.png
cg_bahamut_breath.png
cg_final_battle.png
cg_bad_end_underground.png
```

---

# 42. 書類系画像

保存先：

```text
assets/documents/
```

本作品ではかなり重要。

---

# 43. P0書類素材

```text
bahamut_contract.png
loan_invoice.png
```

---

# 44. bahamut_contract.png

用途：

神様との契約シーン。

内容例：

```text
残価設定型バハムート契約

車両……
```

のような現代的な契約書を、

ファンタジー世界向けに置き換えたデザイン。

重要表示：

```text
契約対象：バハムート

契約価格：1,000,000,000 G

月額支払：100,000 G

契約期間：3年
```

---

# 45. loan_invoice.png

用途：

各ローン支払いイベント。

毎回神様から届く請求書。

ギャグ演出として繰り返し使用する。

---

# 46. P1書類素材

```text
guild_quest.png
bahamut_appraisal.png
```

---

# 47. guild_quest.png

用途：

討伐クエスト表示。

---

# 48. bahamut_appraisal.png

用途：

NORMAL ROUTE終盤。

バハムート最終査定結果。

---

# 49. UI素材

保存先：

```text
assets/ui/
```

初期プロトタイプではCSSで代用可能。

そのため画像としての優先度は低い。

---

# 50. P1 UI

```text
title_logo.png
```

タイトル：

```text
残クレバハムートで魔王討伐
```

---

# 51. P2 UI

```text
textbox.png
choice_button.png
choice_button_hover.png
status_panel.png
quest_panel.png
loan_panel.png
gameover.png
```

ただし、

```text
textbox
choice_button
status_panel
```

はCSSで制作してよい。

---

# 52. エフェクト

保存先：

```text
assets/effects/
```

プロトタイプでは必須ではない。

---

# 53. P2エフェクト

```text
effect_slash.png
effect_magic_dark.png
effect_magic_holy.png
effect_bahamut_breath.png
```

---

# 54. 現時点で作成済みの基本素材

これまで生成済みの素材を、以下として配置する。

```text
assets/characters/hero/hero_normal.png

assets/characters/god/god_normal.png

assets/characters/demon_king/demon_king_normal.png

assets/characters/bahamut/bahamut_normal.png
```

ファイル名は実際に保存する際、この名称へ変更する。

---

# 55. 素材シートについて

これまで生成した、

```text
受付嬢
ゴブリン
オーク
背景
```

などが複数含まれた素材一覧画像は、

デザイン参考として使用する。

実際のゲームでは使用しない。

必ず、

```text
1キャラクター
=
1透過PNG
```

または、

```text
1背景
=
1画像
```

として生成し直す。

---

# 56. P0素材一覧

Codexへ最初のプロトタイプを作らせる時点で、

最低限揃える画像は以下。

## キャラクター

```text
assets/characters/hero/hero_normal.png
assets/characters/god/god_normal.png
assets/characters/demon_king/demon_king_normal.png
assets/characters/bahamut/bahamut_normal.png
assets/characters/guild_receptionist/guild_receptionist_normal.png
```

## 敵

```text
assets/enemies/goblin.png
assets/enemies/orc.png
```

## 背景

```text
assets/backgrounds/bg_town_day.png
assets/backgrounds/bg_guild.png
assets/backgrounds/bg_forest.png
assets/backgrounds/bg_road.png
assets/backgrounds/bg_demon_castle.png
assets/backgrounds/bg_throne_room.png
assets/backgrounds/bg_sky.png
assets/backgrounds/bg_heaven_temple.png
```

## 書類

```text
assets/documents/bahamut_contract.png
assets/documents/loan_invoice.png
```

合計：

```text
17ファイル
```

これが最低限の画像セット。

---

# 57. P1追加素材

P0完成後に追加する。

```text
hero_smile.png
hero_confused.png
hero_surprised.png
hero_angry.png
hero_despair.png

god_smile.png
god_evil_smile.png
god_serious.png
god_angry.png
god_battle.png

demon_king_amazed.png
demon_king_smile.png
demon_king_serious.png
demon_king_battle.png

bahamut_annoyed.png
bahamut_angry.png
bahamut_battle.png

guild_receptionist_smile.png
guild_receptionist_surprised.png

goblin_leader.png
orc_king.png
wyvern.png
golem.png
demon_soldier.png

bg_inn.png
bg_orc_village.png
bg_dungeon_entrance.png
bg_dungeon.png
bg_demon_realm.png
bg_heaven_temple_destroyed.png

guild_quest.png
bahamut_appraisal.png

cg_bahamut_arrival.png
cg_contract_10billion.png
cg_demon_king_first_meeting.png
cg_demon_king_fraud_reaction.png
cg_team_up.png
cg_god_true_form.png
cg_contract_destroyed.png
cg_good_end.png

title_logo.png
```

---

# 58. 画像生成時の基本ルール

今後ChatGPTなどで画像を生成する場合、

必ず生成前に、

```text
ファイル名
保存先
用途
サイズ
透過の有無
```

を決める。

例：

```text
ファイル名：
guild_receptionist_normal.png

保存先：
assets/characters/guild_receptionist/

用途：
冒険者ギルド受付嬢の通常立ち絵

形式：
PNG

背景：
透明

構図：
全身
```

---

# 59. キャラクターの一貫性

同一キャラクターの表情差分は、

基本立ち絵を基準に制作する。

特に、

```text
髪型
服装
装備
体格
色
アクセサリー
```

を変更しない。

表情のみ変化させる。

---

# 60. 背景の一貫性

同一場所の差分を制作する場合も、

構造を大きく変更しない。

例：

```text
bg_heaven_temple.png
```

と、

```text
bg_heaven_temple_destroyed.png
```

は同じ神殿を基準にする。

---

# 61. 画像内テキストについて

背景やイベントCGには、

原則として文字を直接入れない。

文字はゲーム側で表示する。

例外：

```text
bahamut_contract.png
loan_invoice.png
guild_quest.png
bahamut_appraisal.png
title_logo.png
```

など、

文字そのものが画像デザインの一部となる素材。

---

# 62. Codexへの取り扱い指示

Codexは、

```text
assets/
```

以下の画像を変更・再生成しない。

ゲーム実装では、

既存のファイルパスをそのまま参照する。

存在しない画像が指定された場合は、

ゲームを停止させず、

代替プレースホルダーを表示する。

開発者コンソールには、

```text
Missing asset: assets/...
```

と出力する。

---

# 63. プロトタイプ制作順

画像制作は以下の順番を推奨する。

```text
1.
guild_receptionist_normal.png

2.
goblin.png

3.
orc.png

4.
bg_town_day.png

5.
bg_guild.png

6.
bg_forest.png

7.
bg_road.png

8.
bg_demon_castle.png

9.
bg_throne_room.png

10.
bg_sky.png

11.
bg_heaven_temple.png

12.
bahamut_contract.png

13.
loan_invoice.png
```

主人公、神様、魔王、バハムートの基本立ち絵はすでにあるため、

この13素材を追加するとP0セットが完成する。

---

# 64. P0完成の判定

以下が揃った時点で、

```text
画像素材についてはCodexへプロトタイプ実装を依頼可能
```

と判断する。

```text
hero_normal
god_normal
demon_king_normal
bahamut_normal
guild_receptionist_normal

goblin
orc

bg_town_day
bg_guild
bg_forest
bg_road
bg_demon_castle
bg_throne_room
bg_sky
bg_heaven_temple

bahamut_contract
loan_invoice
```

その後のP1・P2素材は、

ゲームが動作してから順次差し替え・追加する。