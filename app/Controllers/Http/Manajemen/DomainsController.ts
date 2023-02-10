import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Domain from 'App/Models/Domain'
import DomainValidator from 'App/Validators/Manajemen/DomainValidator'
import Application from "@ioc:Adonis/Core/Application"
import Excel from "read-excel-file/node"
import fs  from "fs"
import Category from 'App/Models/Category'

export default class DomainsController {
  public async index({}: HttpContextContract) {
    const domains = await Domain.query().orderBy("id", 'desc')

    const datas:{}[] =[]

    domains.forEach(element => {
      const row ={}
      row['id']= element.uuid
      row['name']= element.name
      row['status']= element.status
      datas.push(row)
    });

    return datas;

  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    try {
      const {filename, sumber, category_uuid} = request.all()

        await request.validate(DomainValidator)
        const filexls = Application.publicPath("../storage/documents/"+ filename);
        const datas:{}[]=[]
        await Excel(filexls).then((rows)=>{
          let i =0
          rows.forEach(async element => {
            if(i!=0){
              const row ={}
              let tld = this.extractRootDomain(element[1])
              row['name']= tld
              row['category_uuid']= category_uuid
              row['sumber']= sumber
              const cekdomain = await Domain.findBy('name', tld)
              //cek doa array data
              const cekdatas = datas.find((item)=> item.name ==tld)
              if(!cekdatas){
                if(!cekdomain){
                  datas.push(row)
                }
              }
            }
            i++
          });
        })

       await Domain.createMany(datas)

       return response.json({
          code:200,
          success:true,
          message:"Proses import data domain berhasil...!"
       })
    } catch (error) {
      return response.status(500).json({
        success:true,
        code:200,
        message:"Opps..., terjadi kesalahan ",
        errors:error
      })
    }


  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({params, response}: HttpContextContract) {
    const {id}= params
    try {
      const domain = await Domain.findBy("uuid", id)
      await domain?.delete()
      return response.json({
        code:200,
        success:true,
        message:"Proses hapus data berhasil..!",
        data:{
          id:id
        }
      })
    } catch (error) {

    }
  }

  public async exportTxtFile({response}:HttpContextContract){
    const categories = await Category.query().orderBy("id", "asc")
    try {
      categories.forEach(async element => {
        let katagoriname = element.name
        const stream = fs.createWriteStream(Application.publicPath('../storage/' + katagoriname.replace(/\s/g, '').toLowerCase()+ '.txt'));
        const domains = await Domain.query().where('category_uuid', element.uuid)
        domains.forEach(item => {
          stream.write("*." + item.name + "\r\n");
        });

      });

      return response.status(200).json({
        success:true,
        code:200,
        message:"Proses export berhasil..!",
      })
    } catch (error) {
      return response.status(500).json({
        success:false,
        code:500,
        message:"Opps..., terjadi kesalahan",
        errors:error
      })
    }
  }

  extractRootDomain(url:string) {
    //console.log(url)
    var domains = url.split(".").reverse();
    const rootdomain =  domains[1]+ "." + domains[0]
    return rootdomain;
  }



}
