// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterPerusahaanValidator from 'App/Validators/Auth/RegisterPerusahaanValidator'
import Axios from 'axios'


export default class RegisterUsersController {
    public async registrasi({request,response}: HttpContextContract){
        const {name, email, password, phone}= request.all()

        await request.validate(RegisterPerusahaanValidator)

        try {

          const user = new User
          user.name = name
          user.email = email
          user.password = password
          user.authent = 'user'
          user.phone = phone
          await user.save()

          //kirim pesan wa
          const phonenumber = this.phoneFormat(user.phone);

            const msg = {
              apikey: 'EYN3RRrziP2EdUokpDgAhykoSK4dm7',
              nomor: phonenumber,
              pesan:
                "*SINIKMAT LANTAS* \r\n `Nikmati Layanan Nyaman Bersama DISHUB Kab. Tangerang` \r\n\r\nHalo... \r\n"+ user.name.toUpperCase() + "\r\n\r\nSelamat Anda telah terdaftar sebagai akun pengguna pada sistem kami dengan data akun sebagai berikut :"+ "\r\nNama pengguna :  "+ email + "\r\nKata Sandi :  "+password+" \r\n\r\nSelanjutnya, untuk dapat melakukan pelaporan dan lainnya silahkan masuk di sistem kami \r\n\r\nSalam, \r\n\r\nSINIKMAT LANTAS \r\nKabupaten Tangerang"
            };

            await Axios.post("http://api.senderwa.com/api/v2/send-wa", msg);

          return response.status(200).json({
            code :200,
            success:true,
            message:"Proses registrasi berhasil..."
          })

        } catch (error) {
          return response.status(501).json({
            code:501,
            success:false,
            errors:[
              {
                message: "Opps..., terjadi kesalahan "+ error,
              }
            ]
          })
        }
      }

      private  phoneFormat(phonenumber){
        let formatted:string =phonenumber.replace(/\D/g, "");
        // 2. Menghilangkan angka 0 di depan (prefix
        //    Kemudian diganti dengan 62
        if (formatted.startsWith("0")) {
          formatted = "62" + formatted.substr(1);
        }

        if (!formatted.endsWith("")) {
          formatted;
        }

        return formatted;
      }
}
