import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { BaseModel, beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Domain extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public name:string

  @column()
  public categoryUuid:string

  @column()
  public sumber:string

  @column()
  public status:boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(domain: Domain){
    domain.uuid = uuid()
  }

  @computed()
  public get dataview(){
    return {
      id : this.uuid,
      name: this.name
    }
  }

  @computed()
  public get datarecord(){
    return {
      id: this.uuid,
      name:this.name
    }
  }
}
