import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { BaseModel, column ,beforeCreate, computed} from '@ioc:Adonis/Lucid/Orm'

export default class Slider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public title:string

  @column()
  public subtitle:string

  @column()
  public content:string

  @column()
  public path:string

  @column()
  public status:boolean

  @column()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(slider:Slider){
    slider.uuid = uuid()
  }

  @computed()
  public get dataview(){
    return {
      id : this.uuid,
      title: this.title,
      content: this.content,
      path: this.path,
      status: this.status
    }
  }

  @computed()
  public get datarecord(){
    return {
      id: this.uuid,
      title: this.title,
      subtitile: this.subtitle,
      content: this.content,
      path: this.path,
      status: this.status,
    }
  }
}
