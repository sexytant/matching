# ベースイメージの作成
FROM node:latest
# コンテナ内で作業するディレクトリを指定
WORKDIR /usr/src/app
# package.jsonとyarn.lockを/usr/src/appにコピー
COPY ["package.json", "yarn.lock", "./"]
# パッケージをインストール
RUN yarn install
# ファイルを全部作業用ディレクトリにコピー
COPY . .

# https://qiita.com/cnloni/items/1c83cac956599fb24158
ENV NODE_OPTIONS=--openssl-legacy-provider
# コンテナを起動する際に実行されるコマンド
ENTRYPOINT [ "yarn", "start" ]
