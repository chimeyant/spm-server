import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Domains extends BaseSchema {
  protected tableName = 'domains'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('name').unique()
      table.uuid('category_uuid')
      table.string('sumber')
      table.boolean('status').defaultTo('true')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
