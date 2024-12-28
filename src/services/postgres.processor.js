const knex = require("knex");
const knexfile = require("../../knexfile");

class PostgresConnection {
  constructor(environment) {
    this.connection = knex(knexfile[environment]);
  }

  insert = (table, dataSet) => {
    return this.connection(table).insert(dataSet, "*");
  };

  searchAll = async (table) => {
    return this.connection(table).select();
  };

  searchByTerm = async (table, term) => {
    return this.connection(table).where(term).first();
  };

  update = async (table, term, dataSet) => {
    return this.connection(table).where(term).update(dataSet);
  };

  delete = async (table, term) => {
    return this.connection(table).where(term).del();
  };

  deleteTable = async (table) => {
    return this.connection(table).del();
  };
}

module.exports = PostgresConnection;
