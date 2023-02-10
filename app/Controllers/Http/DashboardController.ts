import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LokasiRambu from 'App/Models/LokasiRambu';
import Pengaduan from 'App/Models/Pengaduan';
import Env from "@ioc:Adonis/Core/Env"
import Drive from '@ioc:Adonis/Core/Drive'

export default class DashboardController {
  async index({response}: HttpContextContract){
    const rambus = await LokasiRambu.query().preload("rambu").orderBy('id','asc')
    const pengaduans = await Pengaduan.query().orderBy("id", 'asc')

    const datarambus: {}[]=[];

    rambus.forEach(async element => {
      const row ={}
      row['id']= element.id
      row['position']= {lat: element.lat, lng: element.lng}
      row['tooltip']= "<h4>" + element.rambu.name + "</h4><div>"+ element.address +"</div><div>Kondisi : <b>"+ element.status.toUpperCase() +"</b></div>",
      row['icon']= Env.get("BASE_URL")+ await Drive.getSignedUrl("images/apps/"+ element.rambu.icon)
      row['draggable']= false
      row['visible']= true
      row['size']= [32,32]

      datarambus.push(row)
    });

    pengaduans.forEach(async element  => {
      const row ={}
      row['id']= element.id
      row['position']= {lat: element.lat, lng: element.lng}
      row['tooltip']= "<h4><center><img src='"+ Env.get("BASE_URL")+ await Drive.getSignedUrl("images/laporans/"+ element.fotoAwal ) +"' width='120px' height='100px' /></center> <br> <hr>" + "Informasi Laka Lantas" + "</h4><div>"+ element.content +"</div><div>Kondisi : <b>"+ "Dalam Proses Penangan" +"</b></div>",
      row['icon']= element.status== '1' ? "/images/riple-3.gif" : "/images/icon-skeleton-merah.png"
      row['draggable']= false
      row['visible']= true
      row['size']= element.status == '1' ? [52,52]: [32,32]

      datarambus.push(row)
    });

    return response.json({
      rambus:datarambus
    })
  }
}
