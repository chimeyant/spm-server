import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Slider from "App/Models/Slider"
import SliderValidator from 'App/Validators/HalamanDepan/SliderValidator';
import Env from "@ioc:Adonis/Core/Env"
import Drive from "@ioc:Adonis/Core/Drive"

export default class SlidersController {
  public async index({}: HttpContextContract) {
    const sliders = await Slider.query().orderBy('id','desc')

    const datas :{}[] = [];

    sliders.forEach(element => {
      const row = {}
      row['id']= element.uuid
      row['title']= element.title
      row['content']= element.content
      row['path']= element.path
      row['status']= element.status
      datas.push(row)
    });
    return datas;
  }

  public async create({}: HttpContextContract) {}

  public async store({request,response}: HttpContextContract) {
    const {title, subtitle, content, path,  status} = request.all()

    await request.validate(SliderValidator)

    try {
      const slider = new Slider()
      slider.title = title
      slider.subtitle = subtitle
      slider.content = content
      slider.path = path
      slider.status = status
      await slider.save()

      return response.status(200).json({
        success:true,
        message:"Proses tambah slider berhasil...",
        data:slider.dataview
      })
    } catch (error) {
      return response.status(500).json({
        success:false,
        messsage:"Opps..., terjadi kesalahan ",
        data: {},
        errors:error
      })
    }
  }

  public async show({params,request,response}: HttpContextContract) {
    const {id}= params
    const slider = await Slider.findBy('uuid',id)

    const data = {
      id: slider?.uuid,
      title: slider?.title,
      subtitle: slider?.subtitle,
      content: slider?.content,
      path:slider?.path,
      path_url: Env.get("BASE_URL")+ await Drive.getSignedUrl( "images/sliders/"+ slider?.path),
      status: slider?.status ? true:false,
    }

    return data;
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request,response}: HttpContextContract) {
    const {id} = params
    const {title, subtitle, content,path, status}= request.all()

    await request.validate(SliderValidator)

    try {
      const slider = await Slider.findBy('uuid',id)
      slider?.merge({title:title, subtitle:subtitle, content:content, path:path, status:status})
      await slider?.save()

      return response.json({
        code : 200,
        success: true,
        message:"Proses ubah data berhasil...",
        data: slider?.dataview,
      })

    } catch (error) {
      return response.status(500).json({
        code : 500,
        status:false,
        message:"Opps..., terjadi kesalahan "+ error,
        data:{}
      })
    }


  }

  public async destroy({params, response, request}: HttpContextContract) {
    const {id}= params

    try {
      const slider = await Slider.findBy('uuid',id)
      await slider?.delete()
      return response.status(200).json({
        code:200,
        success:true,
        message:"Proses hapus data berhasil...",
        data:{
          id:id
        }
      })
    } catch (error) {
      return response.status(500).json({
        status:false,
        message:"Opps..., terjadi kesalahan "+ error
      })
    }

  }

  public async publish({}:HttpContextContract){
    const sliders = await Slider.query().where('status',true).orderBy('id','desc')

    const datas: {}[]=[];

    sliders.forEach(async (item)=>{
      const row ={}
      const url = await Drive.getSignedUrl("images/sliders/"+ item.path)
      row['id']= item.id
      row['title']= item.title
      row['subtitle']=item.subtitle
      row['content']= item.content
      row['path']= Env.get("BASE_URL")+ url
      datas.push(row)
    })

    return datas;
  }
}
