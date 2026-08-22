# 残クレバハムートで魔王討伐
## ④ 所持金・ローン・バハムート査定システム仕様

保存先：

```text
docs/game_design.md
```

# 1. システムの目的

本作では、

**魔物討伐 → 報酬獲得 → ローン返済**

という流れを、単なるストーリー上のギャグではなく、プレイヤーが実際に意識するゲームシステムとして実装する。

プレイヤーは、

- どの依頼を受けるか
- どれだけバハムートを使うか
- どれだけお金を残せるか
- バハムートの査定価値を維持できるか

を考えながらゲームを進める。

---

# 2. 基本ゲーム変数

ゲーム中は最低限、以下の変数を保持する。

```json
{
  "money": 120000,
  "loanPayment": 100000,
  "loanPaymentsMade": 0,
  "loanPaymentsRequired": 6,
  "bahamutValue": 50,
  "bahamutCondition": 100,
  "bahamutTrust": 0,
  "battleCount": 0,
  "bahamutBattleCount": 0,
  "route": "common"
}
```

プロトタイプでは実際の「3年間＝36回払い」をそのまま再現せず、

```text
loanPaymentsRequired = 6
```

程度に圧縮する。

ストーリー上は3年間の契約という設定を維持する。

---

# 3. money

主人公の現在所持金。

```text
money
```

単位：

```text
G
```

ゲーム画面には常時表示する。

例：

```text
所持金
120,000 G
```

---

# 4. 初期所持金

推奨初期値：

```text
120,000 G
```

最初のローン返済額が10万Gなので、

ゲーム開始直後から、

「すでに余裕がほとんどない」

状態にする。

ただし最初のゴブリン討伐で追加収入を得られるため、即ゲームオーバーにはならない。

---

# 5. ローン支払額

1回の支払額：

```text
100,000 G
```

企画設定の「毎月10万ゴールド」をそのまま使用する。

---

# 6. プロトタイプ上の支払回数

本来：

```text
36回
```

だが、プロトタイプではゲームテンポを優先して、

```text
6回
```

程度に圧縮する。

想定：

```text
第1回：ゴブリン討伐後
第2回：オーク討伐後
第3回：中盤依頼後
第4回：強敵討伐後
第5回：魔王領突入前
第6回：魔王城到達前
```

---

# 7. ローン返済処理

返済イベント発生時、

```text
money >= loanPayment
```

なら支払い成功。

処理：

```text
money -= loanPayment
loanPaymentsMade += 1
```

---

# 8. 支払い不能

返済時に、

```text
money < loanPayment
```

の場合、

```text
BAD END A
```

へ移行する。

表示例：

```text
残価設定型バハムート契約

今月のお支払い

100,000 G

所持金

82,500 G
```

↓

```text
支払い不能
```

↓

```text
BAD END
主人公は地下へ送られた。
```

---

# 9. 討伐報酬

基本報酬案：

```json
{
  "goblin": 50000,
  "goblin_leader": 80000,
  "orc": 90000,
  "orc_king": 150000,
  "wyvern": 180000,
  "golem": 200000,
  "demon_soldier": 120000
}
```

この数値はプロトタイプ用。

ゲームバランス調整時に変更できるよう、

```text
game/data/game_balance.json
```

で管理する。

---

# 10. 報酬獲得演出

魔物討伐後、

単純に所持金へ加算するだけではなく、画面中央に大きく表示する。

例：

```text
QUEST CLEAR

ゴブリン討伐報酬

+50,000 G
```

その後、

```text
現在の所持金

170,000 G
```

と表示する。

プレイヤーに「稼いだ」という感覚を明確に与える。

---

# 11. ローン返済演出

報酬獲得直後にローン返済を入れる場合、

意図的に落差を作る。

例：

```text
QUEST CLEAR

+90,000 G
```

↓

```text
現在の所持金

185,000 G
```

↓

神様：

「主人公さん♪
今月のお支払い日です♪」
```

↓

```text
バハムート残価設定型契約

-100,000 G
```

↓

```text
現在の所持金

85,000 G
```

この一連の流れを作品の定番ギャグとして繰り返す。

---

# 12. クエスト選択

中盤以降、複数の依頼から選択できるようにしてもよい。

例：

```text
A：ゴブリンリーダー討伐
報酬 80,000 G
危険度 ★★

B：ワイバーン討伐
報酬 180,000 G
危険度 ★★★★

C：ゴーレム討伐
報酬 200,000 G
危険度 ★★★★★
```

高報酬な依頼ほど、

- 戦闘敗北リスク
- バハムート消耗
- 査定価値低下

が大きくなる。

---

# 13. バハムートの査定システム

ゲーム内部では、

```text
bahamutValue
```

という評価値を使用する。

プロトタイプでは、

```text
0〜100
```

で管理する。

初期値：

```text
50
```

---

# 14. bahamutCondition

バハムートの現在状態。

```text
bahamutCondition
```

範囲：

```text
0〜100
```

初期値：

```text
100
```

戦闘でバハムートを酷使すると低下する。

---

# 15. bahamutTrust

主人公とバハムートの信頼度。

```text
bahamutTrust
```

初期値：

```text
0
```

主人公の選択によって増減する。

---

# 16. バハムートを戦わせる

戦闘中に、

```text
主人公主体で戦う
```

または、

```text
バハムートに任せる
```

という選択肢を入れる。

---

# 17. 主人公主体

例：

```text
主人公が前に出る
```

結果：

```text
bahamutCondition 変化なし
bahamutTrust +2
```

主人公自身の敗北リスクは少し高くする。

---

# 18. バハムート主体

例：

```text
バハムートに任せる
```

結果：

```text
勝率上昇
bahamutCondition -5
bahamutBattleCount +1
```

安全かつ強力だが、使いすぎると査定に影響する。

---

# 19. バハムートの酷使

戦闘のほとんどをバハムート任せにした場合、

終盤で、

```text
「酷使による損耗」
```

として査定額を下げる。

例：

```text
bahamutBattleCount >= 5
```

なら、

```text
bahamutValue -10
```

---

# 20. バハムートを守る選択

イベント中、

```text
バハムートを休ませる
```

選択肢を用意する。

結果：

```text
bahamutCondition +10
bahamutTrust +5
```

ただし依頼を逃すため、

```text
money
```

を増やせない。

つまり、

**今月の返済を優先するか、バハムートの価値を守るか**

という選択になる。

---

# 21. 修理・治療費

バハムートが大きなダメージを受けた場合、

治療イベントを入れてもよい。

例：

```text
治療費：30,000 G
```

選択肢：

```text
治療する
治療しない
```

---

# 22. 治療する

```text
money -= 30000
bahamutCondition += 20
bahamutValue += 5
bahamutTrust += 3
```

---

# 23. 治療しない

```text
bahamutCondition 変化なし
bahamutValue -= 10
bahamutTrust -= 5
```

短期的にはお金を守れる。

しかし最終査定で不利になる。

---

# 24. バハムート査定値の計算

最終査定時、

基本値：

```text
bahamutValue
```

へ各種補正を加える。

例：

```text
finalAppraisal =
bahamutValue
+ conditionBonus
+ trustBonus
- overusePenalty
```

---

# 25. conditionBonus

バハムートの状態による補正。

例：

```text
bahamutCondition >= 90
+15

bahamutCondition >= 70
+10

bahamutCondition >= 50
+0

bahamutCondition < 50
-10
```

---

# 26. trustBonus

信頼度による補正。

例：

```text
bahamutTrust >= 20
+10

bahamutTrust >= 10
+5

bahamutTrust < 0
-10
```

理由：

主人公との信頼関係が高いほど、

バハムートが安定して成長している

という扱いにする。

---

# 27. overusePenalty

バハムートを酷使した場合の減点。

例：

```text
bahamutBattleCount >= 6
-15

bahamutBattleCount >= 4
-10

bahamutBattleCount >= 2
-5
```

---

# 28. 査定ランク

最終値によってランクを表示する。

```text
90以上：S
75以上：A
60以上：B
45以上：C
45未満：D
```

---

# 29. NORMAL END条件

魔王討伐ルートでは、

```text
finalAppraisal >= 70
```

なら、

```text
NORMAL END
```

へ進む。

---

# 30. BAD END B条件

魔王を倒しても、

```text
finalAppraisal < 70
```

なら、

```text
BAD END B
```

へ進む。

演出：

```text
魔王討伐成功

↓

バハムート査定

↓

査定額不足

↓

残債発生

↓

地下送り
```

---

# 31. GOOD ENDでは査定を無視する

GOOD ENDでは、

魔王と共闘して神様を倒す。

その結果、

```text
契約そのものが消滅
```

するため、

```text
bahamutValue
money
loanPaymentsMade
```

に関係なくGOOD ENDへ到達できる。

つまり、

NORMALルートでは経済システムが重要。

GOODルートでは、

**契約そのものを破壊する**

という構造になる。

---

# 32. プレイヤーに与えるジレンマ

本システムでは、

単純に一番高い報酬の依頼を選べばよいゲームにしない。

常に、

```text
お金
```

と、

```text
バハムートの状態
```

のどちらを優先するか考えさせる。

---

# 33. 例1：安全策

```text
低難度依頼
報酬 80,000 G
バハムート消耗なし
```

メリット：

```text
査定価値を維持
```

デメリット：

```text
ローン返済資金がギリギリ
```

---

# 34. 例2：高収入策

```text
ワイバーン討伐
報酬 180,000 G
```

メリット：

```text
ローン資金に余裕
```

デメリット：

```text
バハムートCondition -15
```

---

# 35. 例3：治療

```text
バハムートを治療する

-30,000 G
```

メリット：

```text
査定価値上昇
```

デメリット：

```text
次回ローン返済が厳しくなる
```

---

# 36. UI表示

ノベル画面の上部または右上に、

最低限、

```text
所持金
今月の支払い
返済回数
```

を表示する。

例：

```text
所持金       185,000 G
次回支払     100,000 G
返済回数     2 / 6
```

---

# 37. バハムート情報

最初から数値を全部見せる必要はない。

序盤：

```text
バハムート査定
???
```

中盤以降：

```text
バハムート状態
良好
```

程度でもよい。

終盤になると、

```text
査定予想ランク：A
```

のように表示する。

---

# 38. 数字を見せすぎない

プロトタイプでは内部値として、

```text
bahamutValue = 67
```

などを持つ。

しかし通常画面では、

```text
査定予想：良好
```

のような表現にしてもよい。

これはノベルゲームとしての雰囲気を壊さないため。

---

# 39. game_balance.json

経済関係の数値は、

```text
game/data/game_balance.json
```

へまとめる。

例：

```json
{
  "initialMoney": 120000,

  "loan": {
    "payment": 100000,
    "requiredPayments": 6
  },

  "rewards": {
    "goblin": 50000,
    "goblin_leader": 80000,
    "orc": 90000,
    "orc_king": 150000,
    "wyvern": 180000,
    "golem": 200000,
    "demon_soldier": 120000
  },

  "bahamut": {
    "initialValue": 50,
    "initialCondition": 100,
    "initialTrust": 0,
    "normalEndingRequiredValue": 70
  }
}
```

---

# 40. シナリオJSONから金額を直接指定しすぎない

可能な場合、

```json
{
  "type": "reward",
  "enemy": "goblin"
}
```

と書くだけで、

```text
game_balance.json
```

から報酬額を取得する設計が望ましい。

これによりバランス調整が容易になる。

---

# 41. loanPaymentも同様

推奨：

```json
{
  "type": "loanPayment",
  "successNext": "scene_success",
  "failureNext": "ending_bad_a"
}
```

金額は、

```text
game_balance.json
```

の、

```text
loan.payment
```

を使用する。

---

# 42. appraisalも同様

推奨：

```json
{
  "type": "appraisal",
  "successNext": "ending_normal",
  "failureNext": "ending_bad_b"
}
```

必要査定値は、

```text
bahamut.normalEndingRequiredValue
```

から取得する。

---

# 43. プロトタイプでの簡略化

最初のCodex実装では、

戦闘そのものは複雑にしない。

選択肢形式で十分。

例：

```text
ゴブリンが襲ってきた！

1. 自分で戦う
2. バハムートに任せる
```

結果によって、

```text
所持金
バハムートCondition
バハムートTrust
```

を変化させる。

---

# 44. 戦闘結果の例

「自分で戦う」

```text
勝利率：80%
bahamutTrust +2
```

「バハムートに任せる」

```text
勝利率：100%
bahamutCondition -5
```

プロトタイプではランダム要素を入れず、

選択による固定結果にしてもよい。

---

# 45. ランダム要素について

初期プロトタイプでは、

```text
Math.random()
```

による勝敗判定は使用しないことを推奨。

理由：

同じプレイでも結果が変わると、

シナリオ検証やバランス調整が難しくなるため。

まずは完全に再現可能な状態で実装する。

---

# 46. デバッグモード

開発用として、

```text
debug = true
```

の場合、

画面に内部値を表示できると便利。

例：

```text
money: 85000
bahamutValue: 65
bahamutCondition: 80
bahamutTrust: 12
bahamutBattleCount: 3
```

完成版では非表示。

---

# 47. デバッグ用操作

可能であれば、

```text
+100,000G
bahamutValue +10
次のローンイベントへ
```

などの開発ボタンを用意する。

Codexでの動作確認が非常に楽になる。

---

# 48. システム上の最重要ポイント

本作でプレイヤーが感じるべき流れは、

```text
お金がない
↓
魔物を倒す
↓
お金が増える
↓
安心する
↓
神様が出てくる
↓
10万G持っていかれる
↓
またお金がない
```

である。

これを繰り返すことによって、

プレイヤー自身にも、

```text
「この契約おかしくない？」
```

と思わせる。

その状態で魔王から、

```text
「それは詐欺ではないのか？」
```

と言わせる。

ここでプレイヤーと魔王の認識が一致する構造を狙う。

---

# 49. 最終的なゲーム体験

序盤：

```text
魔王を倒すための資金管理ゲーム
```

だと思わせる。

中盤：

```text
バハムートのローン返済ゲーム
```

になっていることに気づく。

終盤：

```text
そもそもこの契約を守る必要があるのか？
```

という疑問へ変化。

GOOD ENDでは、

```text
借金を返す
```

のではなく、

```text
悪徳契約を結ばせた神様を倒す
```

ことで問題を解決する。

経済システムそのものが、ストーリー上の伏線になるよう設計する。
