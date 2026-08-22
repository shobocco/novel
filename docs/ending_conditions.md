# 残クレバハムートで魔王討伐
## ⑤ 分岐・エンディング条件

保存先：

```text
docs/ending_conditions.md
```

# 1. 目的

本作では以下の5種類のエンディングを実装する。

- NORMAL END
- BAD END A
- BAD END B
- BAD END C
- GOOD END

元企画のエンディング構成は、

- 魔王を討伐して借金も無し
- 途中でローンが払えずゲームオーバー
- 魔王を倒したがバハムートの価値が不足して地下送り
- 魔王に敗北
- 魔王と一緒に神様を倒す

という5系統である。

この仕様書では、その条件をゲームシステムへ落とし込む。

---

# 2. ルート構造

ゲーム全体は大きく、

```text
COMMON ROUTE
      │
      ▼
魔王との対面
      │
      ▼
最終選択
 ┌─────────────┐
 │             │
 ▼             ▼
NORMAL ROUTE   GOOD ROUTE
 │             │
 ▼             ▼
魔王戦         神様戦
 │             │
 ▼             ▼
査定           GOOD END
 │
 ├─成功 → NORMAL END
 │
 └─失敗 → BAD END B
```

となる。

なお、COMMON ROUTE中にローン返済不能となった場合は、

```text
BAD END A
```

へ即時移行する。

戦闘敗北によっては、

```text
BAD END C
```

へ移行する。

---

# 3. 使用する主要変数

最低限、以下の変数を使用する。

```json
{
  "money": 120000,
  "loanPayment": 100000,
  "loanPaymentsMade": 0,
  "loanPaymentsRequired": 6,

  "bahamutValue": 50,
  "bahamutCondition": 100,
  "bahamutTrust": 0,
  "bahamutBattleCount": 0,

  "route": "common",

  "flags": {
    "signedContract": false,
    "heardGodTruth": false,
    "joinedDemonKing": false,
    "defeatedDemonKing": false,
    "defeatedGod": false
  }
}
```

---

# 4. route

routeには以下の値を使用する。

```text
common
normal
good
```

初期値：

```text
common
```

魔王との最終選択によって変更する。

---

# 5. COMMON ROUTE

ゲーム開始から魔王との対面までは、

```text
route = common
```

とする。

この間に、

- 神様との出会い
- バハムート契約
- ゴブリン討伐
- オーク討伐
- 中盤依頼
- ローン返済
- 魔王領
- 魔王との対面

を進行する。

---

# 6. COMMON ROUTE中のBAD END

COMMON ROUTEでは主に、

```text
BAD END A
```

が発生する。

ローン支払い時に、

```text
money < loanPayment
```

なら、

```text
BAD END A
```

へ移行する。

---

# 7. 魔王との対面

魔王との対面時に、

```text
heardGodTruth = true
```

を設定する。

魔王は主人公に、

```text
「それは詐欺ではないのか？」
```

と指摘する。

ここで初めて、

神様が主人公を利用している可能性を明確に提示する。

---

# 8. 最終ルート選択

魔王から、

```text
「私と組まないか？」
```

と提案された後、プレイヤーへ選択肢を提示する。

```text
1. 魔王を倒す
2. 魔王を信じる
```

---

# 9. 「魔王を倒す」

選択時：

```text
route = normal
joinedDemonKing = false
```

NORMAL ROUTEへ進む。

---

# 10. 「魔王を信じる」

選択時：

```text
route = good
joinedDemonKing = true
```

GOOD ROUTEへ進む。

---

# 11. NORMAL ROUTE

NORMAL ROUTEでは、

主人公は当初の目的どおり魔王を討伐する。

流れ：

```text
魔王と戦う
↓
魔王撃破
↓
神様が現れる
↓
契約終了手続き
↓
バハムート最終査定
↓
査定成功 / 査定失敗
```

---

# 12. 魔王戦

NORMAL ROUTEでは、

```json
{
  "type": "battle",
  "enemy": "demon_king",
  "winNext": "scene_demon_king_defeated",
  "loseNext": "ending_bad_c"
}
```

とする。

---

# 13. 魔王戦勝利

魔王を倒した場合、

```text
defeatedDemonKing = true
```

を設定する。

その後、最終査定へ移る。

---

# 14. 魔王戦敗北

魔王戦に敗北した場合、

```text
BAD END C
```

へ移行する。

---

# 15. 最終査定値

NORMAL ROUTEではバハムートを査定する。

最終査定値：

```text
finalAppraisal
```

を計算する。

基本式：

```text
finalAppraisal =
bahamutValue
+ conditionBonus
+ trustBonus
- overusePenalty
```

詳細な補正値は、

```text
docs/game_design.md
```

を参照する。

---

# 16. NORMAL END条件

以下をすべて満たす場合、

```text
NORMAL END
```

とする。

```text
route == "normal"

defeatedDemonKing == true

finalAppraisal >= normalEndingRequiredValue
```

初期推奨値：

```text
normalEndingRequiredValue = 70
```

---

# 17. NORMAL END内容

魔王討伐に成功。

バハムートの査定額も必要水準を満たす。

残債が相殺される。

主人公は借金から解放される。

表示：

```text
NORMAL END

魔王討伐成功
バハムート査定成功

主人公は借金から解放された。
```

その後、

主人公とバハムートが再び旅へ出る。

---

# 18. BAD END B条件

以下の場合、

```text
BAD END B
```

とする。

```text
route == "normal"

defeatedDemonKing == true

finalAppraisal < normalEndingRequiredValue
```

---

# 19. BAD END B内容

魔王討伐には成功する。

しかし最終査定で、

```text
バハムートの査定額不足
```

となる。

主人公には残債が発生。

支払い不能。

主人公は地下へ送られる。

表示例：

```text
魔王討伐成功

↓

バハムート最終査定

査定ランク：C

↓

残債を相殺できませんでした

↓

BAD END
```

---

# 20. GOOD ROUTE

GOOD ROUTEでは、

魔王と主人公が共闘する。

魔王戦は発生しない。

流れ：

```text
魔王と共闘
↓
天空の神殿へ
↓
神様と対面
↓
神様の本性
↓
神様との最終決戦
↓
契約書破壊
↓
GOOD END
```

---

# 21. GOOD ROUTE開始条件

```text
route == "good"

joinedDemonKing == true
```

---

# 22. GOOD ROUTEでの経済条件

GOOD ROUTEでは、

```text
money
bahamutValue
loanPaymentsMade
finalAppraisal
```

をGOOD END判定に使用しない。

理由：

神様を倒すことで、

```text
契約そのものが無効になる
```

ため。

---

# 23. 神様戦

GOOD ROUTE最終戦。

```json
{
  "type": "battle",
  "enemy": "god",
  "winNext": "scene_god_defeated",
  "loseNext": "ending_bad_c"
}
```

---

# 24. 神様戦勝利

勝利した場合、

```text
defeatedGod = true
```

を設定する。

その後、

主人公が契約書を破壊する。

---

# 25. GOOD END条件

以下を満たす場合、

```text
GOOD END
```

とする。

```text
route == "good"

joinedDemonKing == true

defeatedGod == true
```

---

# 26. GOOD END内容

主人公、魔王、バハムートの3人で神様を撃破する。

主人公がバハムートの契約書を破壊する。

契約は消滅。

表示：

```text
GOOD END

ローン完済！
```

ではなく、

```text
GOOD END

ローン契約そのものが消滅しました
```

とする。

ここは作品を象徴する演出なので必ず維持する。

---

# 27. BAD END A

名称：

```text
BAD END A
ローン支払い不能
```

発生条件：

```text
loanPaymentイベント時

money < loanPayment
```

---

# 28. BAD END A内容

神様：

```text
「今月のお支払いが確認できません♪」
```

主人公：

```text
「ちょっと待って！」
```

画面暗転。

表示：

```text
支払い不能

主人公は地下へ送られた。
```

---

# 29. BAD END Aの発生タイミング

以下のような各支払いイベントで判定する。

```text
第1回ローン
第2回ローン
第3回ローン
第4回ローン
第5回ローン
第6回ローン
```

どの支払いでも発生可能。

---

# 30. BAD END B

名称：

```text
BAD END B
バハムート査定失敗
```

発生条件：

```text
route == normal

defeatedDemonKing == true

finalAppraisal < requiredValue
```

---

# 31. BAD END C

名称：

```text
BAD END C
戦闘敗北
```

基本的には、

最終決戦敗北に使用する。

---

# 32. BAD END C：魔王戦

NORMAL ROUTEで魔王に敗北。

表示例：

```text
魔王：

「お前は悪くない」

「ただ、神に利用されただけだ」
```

↓

```text
GAME OVER
```

---

# 33. BAD END C：神様戦

GOOD ROUTEで神様に敗北した場合にも、

```text
BAD END C
```

を利用可能。

ただし演出テキストは別にする。

例：

```text
神様：

「やっぱり人間って面白いですね♪」
```

↓

```text
GAME OVER
```

---

# 34. BAD END Cの内部ID

共通IDにする場合：

```text
bad_end_c
```

ただし敗北相手を記録する。

例：

```text
defeatedBy = "demon_king"
```

または、

```text
defeatedBy = "god"
```

これによって表示内容を変える。

---

# 35. エンディングID

内部IDは以下で統一する。

```text
normal_end
bad_end_a
bad_end_b
bad_end_c
good_end
```

---

# 36. エンディング判定の優先順位

非常に重要。

Codexは条件を以下の順番で判定する。

```text
1. ローン支払い不能
2. 戦闘敗北
3. GOOD ROUTE完遂
4. NORMAL ROUTE査定
```

---

# 37. なぜ優先順位が必要か

例えば、

```text
money < 100000
```

でも、

ローンイベントが発生していなければ、

即BAD END Aにはしない。

BAD END Aは、

```text
loanPayment
```

イベントが発生した瞬間のみ判定する。

同様に、

```text
bahamutValue < 70
```

でもゲーム途中ではBAD ENDにならない。

査定イベントで初めて判定する。

---

# 38. BAD ENDを常時監視しない

重要。

以下のような実装は禁止する。

```javascript
if (money < 100000) {
    badEnd();
}
```

これでは所持金が一時的に10万Gを下回っただけで終了してしまう。

必ず、

```text
loanPaymentイベント
```

発生時のみチェックする。

---

# 39. 同様に査定も常時判定しない

```text
bahamutValue
```

が低くても、

ゲーム途中では問題ない。

最終査定イベントでのみ判定する。

---

# 40. 一本道にならないための選択

COMMON ROUTE中に、

経済的な小さな選択肢を配置する。

例：

```text
バハムートを治療する

A：30,000G払う
B：治療しない
```

この選択が、

```text
money
bahamutCondition
bahamutValue
bahamutTrust
```

へ影響する。

最終的にNORMAL END / BAD END Bへ影響する。

---

# 41. GOOD ENDへの条件を複雑にしすぎない

プロトタイプでは、

GOOD ROUTEへの条件を、

```text
魔王を信じる
```

という選択だけでよい。

好感度や特殊フラグを大量に要求しない。

目的は、

全ルートの動作確認を容易にするため。

---

# 42. 将来的なGOOD END条件拡張

完成版では例えば、

```text
bahamutTrust >= 10

heardGodTruth == true

specificFlag == true
```

などをGOODルート開放条件に追加してもよい。

ただしプロトタイプでは実装しない。

---

# 43. ルート選択直前のセーブポイント

プロトタイプでも可能なら、

魔王から共闘を提案された直前で、

自動セーブまたはチェックポイントを作る。

理由：

NORMALとGOODの両ルートをテストしやすくするため。

---

# 44. エンディング後

エンディング画面では、

最低限以下を表示する。

```text
ENDING NAME

ENDING TEXT

タイトルへ戻る
```

可能なら、

```text
もう一度プレイ
```

も用意する。

---

# 45. 到達済みエンディング記録

プロトタイプでは任意。

実装する場合、

```text
localStorage
```

に保存する。

例：

```json
{
  "normal_end": true,
  "bad_end_a": true,
  "bad_end_b": false,
  "bad_end_c": true,
  "good_end": true
}
```

---

# 46. エンディング一覧

将来的にはタイトル画面に、

```text
ENDING LIST
```

を追加してもよい。

例：

```text
NORMAL END      ????
BAD END A       CLEAR
BAD END B       ????
BAD END C       CLEAR
GOOD END        CLEAR
```

ただし初期プロトタイプでは必須ではない。

---

# 47. Codex向け最終判定ルール

Codexは以下を厳守する。

```text
BAD END A
→ loanPaymentイベント時に所持金不足

BAD END B
→ NORMAL ROUTEで魔王撃破後、最終査定失敗

BAD END C
→ 魔王または神様との最終戦敗北

NORMAL END
→ 魔王撃破＋最終査定成功

GOOD END
→ 魔王と共闘＋神様撃破
```

---

# 48. 分岐の最終フロー

```text
GAME START
    │
    ▼
COMMON ROUTE
    │
    ├────ローン支払不能────→ BAD END A
    │
    ▼
魔王との対面
    │
    ▼
「魔王を倒す / 魔王を信じる」
    │
    ├────────────────┐
    │                                │
    ▼                                ▼
NORMAL ROUTE                    GOOD ROUTE
    │                                │
    ▼                                ▼
魔王戦                           神様戦
    │                                │
    ├─敗北→ BAD END C               ├─敗北→ BAD END C
    │                                │
    ▼                                ▼
魔王撃破                         神様撃破
    │                                │
    ▼                                ▼
バハムート査定                   契約書破壊
    │                                │
    ├─成功→ NORMAL END              ▼
    │                             GOOD END
    └─失敗→ BAD END B
```

# 49. この構造で重視すること

NORMAL ENDは、

```text
神様の提示したルールの中で勝つ
```

エンディング。

GOOD ENDは、

```text
神様の提示したルールそのものを否定する
```

エンディング。

そのため、

NORMAL ROUTEでは、

- 所持金
- ローン返済
- バハムート査定

が最後まで重要になる。

GOOD ROUTEでは、

それまで必死に管理してきたローンや査定を、

```text
契約そのものを破壊する
```

ことで無意味にする。

ゲームシステムとストーリーの両方で、この違いを明確に表現する。
