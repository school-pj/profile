
exports.up = function(knex, Promise) {
    // テーブルが存在するかどうか確認
    return knex.schema.hasTable('users')
      //判定結果を引数existsに渡して無名関数をコールバック
      .then(function(exists) {
        //テーブルがなかった場合(正規処理
        if (!exists) {
             // 接続先のスキーマに指定した名前でテーブルを作成する
            return knex.schema.createTable('users', 
              // 作成したテーブルにカラムを作成する
              function(table) {
                 // テーブルの要素設定 
                table.increments('id').primary().notNullable();
                table.string('user_name').notNullable();
                table.string('password').notNullable();
                table.string('content').defaultTo('');
            });
         //既にテーブルある場合
        }else{
            return new Error("The table already exists. ");
        }
    });
  };
  
  // テーブルを削除(drop)する。レコードの削除ではない
  exports.down = function(knex, Promise) {
    return knex.schema.hasTable('users').then(function(exists) {
        if (exists) {
            // 指定したテーブルを削除する
            return knex.schema.dropTable('users');
        }
    });
  };