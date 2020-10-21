// Update with your config settings.

module.exports = {

  // 開発環境の設定(デフォルトで参照される設定)
  development: {
    // データベースの種類
    client: 'mysql', 
    // DB接続情報
    connection: {
      user     : 'root',
      password : 'root',
      database : 'profileapp'
    },
    // コネクションプールの設定
    pool: {
      min: 2,
      max: 10
    },
    // マイグレーション設定
    migrations: {
      // マイグレーションファイルの配置先(knexfile.jsからの相対)
      directory:'./db/migrations',
      // マイグレーションを管理するテーブル名
      tableName: 'migration'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
