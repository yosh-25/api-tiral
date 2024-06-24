#CSS
-全体設計、ディレクトリ参照
https://www.youtube.com/watch?v=ekUQ043k2TQ
https://postd.cc/how-i-approach-and-structure-enterprise-frontend-applications-after-4-years-of-using-nextjs/

-これが一番参考になりそう
https://zenn.dev/nino_cast/books/43c539eb47caab/viewer/d432a6
-theme今のところなし。
-toppageは動画で説明にする

#データ引き渡し
#リファクタリング

6/7 todo: topageのボタン配置
6/8 todo: 
✔breakpoints設定してtoppageからCSS整える, header表示部分のコンポーネント化。
✔新しく作った関数からコンポーネント化して慣れていく。
dashboardのCSS、コンポーネント化
ListofsearchedResultsのprops整理
引き続きデータの渡し方
6/10
↑のデータ引き渡し。一旦保留。
topageのヘッダー後で考える。
以下要領でデザイン参照
https://www.google.com/search?sca_esv=2483f278acd04993&sca_upv=1&sxsrf=ADLYWIK6r0lHuAFoiT6qY4Z4n9OvkCxFfA:1717985073981&q=mypage&uds=ADvngMg-WmtxshqDNfgqtuGFiOwx6Xac9SCBzlg2lfNrzlvSkklOWSl8fLMeJEO5MZ6Aul__MFUpFe9-4HmwATT0SWMay_f-D30x7Ujg6V57EmmB0RB0e6op8g0shTTRQ1KYqxHqib2JivSJ2KX-irALz0EhMcJ3IsI-qBa5f1OT3hDPkQq2rfWUM_PQcjZ-d0JTXZ6ai85Zi7xDRHlM2pJ7B25K-rdejWcvIdVani9FOen4724WTqlgnOpxVA5G9E1Qd6laRjBlcyyo9fA0uffvspuERNNTOiPq1z4kXqZ32lxqwEFHFiunQ9QsSUavFYOgc-ZP-eyWCoFQvZtDpvrk2XUFh38x0tTnleAakeAwBFwgs_kHuJc&udm=2&prmd=ivsnbmtz&sa=X&ved=2ahUKEwiCqcGQ-c-GAxUTgK8BHZvYGmgQtKgLegQIDRAB&biw=1120&bih=691&dpr=1.25#vhid=1C3iGcp-0pwv1M&vssid=mosaic

6/11
dashboard行の固定
サイズ変えても画像やメモの位置がずれないように
動画の下に一覧、設定画面を設置する

memoListのPC画面仕上げる
レスポンシブ対応

6/13
検索してページ飛ばすところから。

6/15
[id]で検索結果を表示できるように調整
その後の個別のページまでのルーティング
メモ一覧から個別ページのデータ渡し
これでUIも同時に組み立てていければある程度完成？恐らく
検索ページだけFooterのCSS変更する。

6/17
✔最近メモを取った動画からのデータ渡し
✔memo一覧からのデータ渡し
✔メモ検索機能
✔メモ一覧のデータ表示順

6/18
飛ぶと変なとこないか確認
    ✔signup 既にアカウントがある場合

todo: 
マイページ
検索ボタン（✔虫眼鏡、✔上のこのページでは消す）
✔memo一覧のメモ表示順番
403 error
✔wathandeditのデータの渡し　
✔✔未入力だとエラーが出るように設定

6/21 Fri
✔業務フロー図
✔予約

6/22 Sat
✔MTG

未入力だとエラーが出るように設定
（✔search, ✔searchResults, ✔WatchAndEdit）←6/21今ここ recoil or firebaseからデータ取得
✔線を消す、✔footerの文字サイズ）, 

6/23
✔CSSメモ編集部分そろえる←今ここ6/22(ipad, sp用のボタン幅)

6/24 AM
✔メモ一覧のnoWrapとか
✔CSS paginatinoページ
✔mypageのnoWrap


https://developers.google.com/youtube/v3/docs/videos/list?hl=ja

6/25
複雑なロジックがいらない部分でデータ削除や無駄を削除
*コツコツ試すpagenation。土曜でも解決しないなら質問
仕方ないのかの質問

動画作成
動画載せる、diploy
遷移図





6/24 Mon
リファクタリング

6/25 Tue
リファクタリング
履歴書、経歴書
求人情報見る



refactoring
watchAndEditの修正
any解消
エラー消去


by 7/2



PC：設定なし
タブレット：md 1024
スマートフォン：sm 600