exports.up = (knex) => {
  return knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.string("email").notNull().unique();
    t.string("password").notNull();
    t.boolean("subscribed").notNull().defaultTo(false);
    t.string("subscription_id").nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("users");
};
