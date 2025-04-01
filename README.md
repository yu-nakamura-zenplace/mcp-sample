```
# npmプロジェクトを初期化
npm init -y

# パッケージをローカルでグローバルにリンク
npm link


# 基本的にローカルだけで会社で使いたい場合の例：
# 外部向けにnpm公開しない場合の例

# 各開発者のマシンで
npm link zen-mcp-sample


# コマンドをテスト
zen-mcp-sample MCP


# 社内Dockerイメージに組み込む
# コマンドをDockerイメージに組み込んで、Dockerを通して実行する方法
※イメージとしては以下のようなDockerfileを作成しmcpServersからzen-mcp-sampleを参照するようにする
FROM node:14
COPY . /app
WORKDIR /app
RUN npm install
RUN npm link
ENTRYPOINT ["zen-mcp-sample", "MCP"]

※APIキーなどの秘密情報はDocker Secretsまたは環境変数で渡す

# npmパッケージとして公開する場合の例：
# npxコマンドで起動できるようにする場合の例
npx -y @zen-mcp-sample MCP

# npmにログイン
npm login

# パッケージを公開
npm publish
```
