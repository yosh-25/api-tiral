# Memotube
Youtube動画に対してメモが取れるアプリです。  

<img src="https://github.com/yosh-25/memotube/assets/131498137/556c935c-45ba-4422-90f7-56aed2fc0f52" width="50%">  

メモは後から自由に参照したり編集することができます。動画学習をより便利に。  

## アプリURL
- https://memotube-q593bmswz-yoshi-okadas-projects.vercel.app  
(リンク先にデモアカウントとパスワードを準備しております。)

## Memotubeについて
- 登場人物  
  Youtube動画で学習している社会人、学生

- ユーザーが抱える課題  
  Youtubeのサイトではメモが取れず、Udemyのように動画へのメモが取れないため後で復習するのが難しい。

- 以下動画でアプリの使い方イメージをご確認頂けます。
  <center>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/GOebZ7Lh9z8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </center>

## 使用技術
| 項目 | 内容 |
| ------------ | --------------------------------------------------------- |
| フロントエンド| HTML, CSS, Typescript 5.4.2, MUI |
| フレームワーク| Next.js 14.2.3 |
| バックエンド| Firebase 10.9.0 |
| コード管理| Github |
| デプロイ、インフラ| Vercel |

## アプリ機能一覧
| 項目 | 内容 |
|-----------|------------|
| ログイン機能 |  ログイン、サインアップ | 
| 動画検索機能| Youtube Data APIを活用した動画検索|
| 動画閲覧機能| 検索動画の再生|
| メモ作成機能| 再生位置に対してメモの付与|
| メモ編集、削除機能| 作成したメモの編集、削除|
| メモ表示機能| 直近メモ、全メモ一覧表示|
|メモ検索機能|メモのキーワード検索|

## アプリ実装予定機能
- ページネーションをページ番号表示に変更
- メモの再生位置をクリックし同位置で動画再生機能
- パスワード再設定機能

