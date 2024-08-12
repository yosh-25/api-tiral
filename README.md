# Memotube
Youtube動画に対してメモが取れるアプリです。 
より便利な動画学習を実現します。

<img src="https://github.com/yosh-25/memotube/assets/131498137/40402c31-81d1-4f67-8b88-780c9770ad5c" width="50%">  

## アプリURL
- [https://memotube-q593bmswz-yoshi-okadas-projects.vercel.app](https://memotube.vercel.app/)  
(リンク先にデモアカウントとパスワードを準備しております。)

## Memotubeについて
- 登場人物  
  Youtube動画で学習している社会人、学生

- ユーザーが抱える課題  
  Youtubeでは動画に対してメモが取れず、Udemyのようにメモを参考に復習するのが難しい。

  ### 主なページと機能
  動画(39秒)とその下にテーブル形式でまとめております。ご都合の良い方でご確認ください。
  #### 動画 
   [![Memotube動画](https://github.com/yosh-25/memotube/assets/131498137/a28941b6-2496-4c53-99e3-3d39670ece1a)](https://github.com/yosh-25/memotube/assets/131498137/775b39ca-4e72-4c15-9c36-0441cf60f8ae)

  #### テーブル
  | 動画検索ページ | 動画閲覧・メモ作成ページ |
  |-----------|------------|
  | ![動画検索](https://github.com/user-attachments/assets/0a7053be-efc3-49d2-825a-587b0962bf03) |  ![メモ作成](https://github.com/user-attachments/assets/c0ade6e5-9f10-4772-94a6-d94bc2ddbe81) | 
  | Youtube動画を検索できます。直感的に検索ページと分かるようなシンプルなデザインにしました。 | 動画を閲覧しながらメモが取れます。再生中の秒数とメモが紐づくため、後で該当箇所の見直しが簡単にできます。 |

  | User専用Topページ | メモ一覧、検索ページ |
  |-----------|------------|
  | ![マイページ](https://github.com/user-attachments/assets/1cce6e05-b904-4797-b58d-1972d5fc4ec5) |  ![メモ一覧](https://github.com/user-attachments/assets/679bc1cd-b0aa-4dd9-ba2c-06f6b299c16a) | 
  | 直近のメモを確認でき、他の機能への導線もスムーズにできるデザインにしました。 | 今まで取ったメモ一覧が見れます。キーワード検索も可能です。 |

## 機能一覧
| 項目 | 内容 |
|-----------|------------|
| ログイン機能 |  ログイン、サインアップ | 
| 動画検索機能 | Youtube Data APIを活用した動画検索 |
| 動画閲覧機能 | 検索動画の再生 |
| メモ作成機能 | 再生位置にメモの付与 |
| メモ編集、削除機能 | 作成したメモの編集、削除 |
| メモ表示機能 | 直近メモ、全メモ一覧表示 |
| メモ検索機能 |メモのキーワード検索 |


## 使用技術
| 項目 | 内容 |
| ------------ | --------------------------------------------------------- |
| フロントエンド| HTML, CSS, Typescript 5.4.2, MUI |
| フレームワーク| Next.js 14.2.3 |
| バックエンド| Firebase 10.9.0 |
| コード管理| Github |
| デプロイ、インフラ| Vercel |

## アプリ実装予定機能 
- パスワード再設定機能

## 環境構築とローカルでの実行方法
以下の手順に従って、Memotubeをローカル環境で実行することができます。

### 必要条件
- Node.js（使用version: v18.17.1）
- Firebase アカウント
- Google Cloud API Key

### 環境構築手順

1. リポジトリのクローン
   ```sh
   git clone https://github.com/yosh-25/memotube.git
   cd memotube

2. 依存関係のインストール
   ```sh
   npm install

3. 環境変数の設定
   - プロジェクトルートに .env.local ファイルを作成し、以下の内容を記入
   ```sh
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

4. Firebase プロジェクトの設定
   - Firebase コンソールで新しいプロジェクトを作成し、上記の環境変数に必要な情報を取得します。

5. ローカルサーバーの起動
   ```sh
   npm run dev

6. ブラウザで以下のURLにアクセス
   ```sh
   http://localhost:3000

## 工夫したところ
- 手軽に動画へメモが取れる設計  
  Youtube動画の再生秒数とメモ作成用のボタンやinputタグでの秒数表記が同時に同期されるよう実装しました。これにより、ユーザーはボタンを押してメモを取るだけで秒数のメモも取れます。

- 取得したメモの並び替え  
  マイページにて、直近でメモを取った3つの動画が表示されるよう実装しました。これにより、直近のメモを素早く見返すことができます。

- メモ検索機能  
  メモ一覧画面にて、過去のメモをキーワード検索できるようにしました。これにより、メモが増えても参照したいメモにすぐにアクセスできます。

## 苦労したところ
- アプリ企画、設計の甘さ  
Todoアプリ以外で初めて一から考えて作ったアプリでした。  
元々は英語学習系アプリを企画していたのですが、いざ進めてみると現在の仕事で携わっているアプリ企画のアイデアにどうしても影響を受けそうに感じ、本Youtubeを活用したアプリ企画に変更しました。また、コーディング前の画面遷移やUIの設計が甘かったため、コーディング中にそれらについて再考しスムーズに進まないこともありました。次回以降の反面教師としたいです。

- コンポーネント化  
複数のPropsを活用したコンポーネントの作成は、教材で少し練習はしたものの、自分で考えながらの実装は初で苦戦しました。色々なエラーに出会いましたが、毎回調べて解消していく力が身に付いたと思います。

- 外部APIの活用  
今回はGoogle Cloud APIを使いました。取得データの構造理解や、それを取得してユーザーが入力した情報と併せてバックエンドに保存するなど、一連のデータの流れを扱えたのはいい経験になりました。こちらも公式ドキュメントなどを見る機会が増え、教材通りではなく自分で思ったことを実現するために情報を取りに行く力が身についたと思います。

- Typescriptへの対応  
上記コンポーネント化やAPIの利用など初めてのトライが多い中、様々な型エラーに出会い苦労しました。1か所での処理を変更することで別箇所での型に影響が出るなどの体験をすることで、以前より全体の設計を意識してコードを書く力につながったかなと思います。
