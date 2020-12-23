const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
//user.js内でuserテーブルを操作する別の関数を実装する際に便利なため、定数化。
const TABLE_NAME = "users";

async function findById(userId) {
  //where関数で、id情報をもとにrows[0]を取得してきている。
  const user = await where({id: userId});
  if (user === null) {
    throw new Error("User not found")
  }
  //...をつけることで、RowDataPacketを除去することができる。
  return {...user};
}
  //conditionには、passport.jsで指定したidが引数として、入っている。
async function where(condition) {
  return await knex(TABLE_NAME)
    .where(condition)
    .then((results) => {
      if (results.length === 0) {
        return null;
      }
      return results[0];
    });
}

module.exports = {findById,where};