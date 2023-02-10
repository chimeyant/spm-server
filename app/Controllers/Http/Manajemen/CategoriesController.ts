import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import CategoryValidator from 'App/Validators/Manajemen/CategoryValidator';

export default class CategoriesController {
  public async index({}: HttpContextContract) {
    const categories =  await Category.query().orderBy('id','asc')

    const datas:{}[]=[]

    categories.forEach(element => {
      const row ={}
      row['id']= element.uuid
      row['name']= element.name
      datas.push(row)
    });

    return datas
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const {name}= request.all()

    await request.validate(CategoryValidator)

    try {
      const category = new Category
      category.name = name
      await category.save()

      return response.status(200).json({
        success:true,
        code:200,
        message:"Proses tambah kategory berhasil..!",
        data:{
          data: category.dataview
        }
      })
    } catch (error) {
      return response.status(500).json({
        success:false,
        code:500,
        message:"Opps..., terjadi kesalahan ",
        errors: error,
        data:{}
      })
    }

  }

  public async show({params}: HttpContextContract) {
    const {id}= params

    const category = await Category.findBy("uuid",id)

    return category?.datarecord
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const {id}= params
    const {name}= request.all()

    await request.validate(CategoryValidator)


    try {
      const category = await Category.findBy('uuid', id)
      category?.merge({name: name})
      await category?.save()

      return response.status(200).json({
        success:true,
        code:200,
        message:"Proses ubah data berhasil...!",
        data: category?.dataview,
        errors:[]
      })
    } catch (error) {
      return response.status(500).json({
        success:false,
        code:500,
        message:"Opps..., terjadi kesalahan ",
        errors:error,
        data:{}
      })
    }
  }

  public async destroy({params, response}: HttpContextContract) {
    const {id}=params
    try {
      const category = await  Category.findBy("uuid",id)
      await category?.delete()

      return response.status(200).json({
        success:true,
        code:200,
        message:"Proses hapus data berhasil...!",
        data:{
          id:id
        }
      })
    } catch (error) {
      return response.status(500).json({
        success:false,
        code : 500,
        message:"Opps..., terjadi kesalahan ",
        errors:error,
        data:{}
      })
    }
  }

  public async combo({}:HttpContextContract){
    const category = await Category.query().orderBy("name",'asc')

    const datas:{}[]=[]
    category.forEach(element => {
        const row = {}
        row['value']= element.uuid
        row['text']= element.name
        datas.push(row)
    });

    return datas;
  }
}
