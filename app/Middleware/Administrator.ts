import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Administrator {
  public async handle({response,auth}: HttpContextContract, next: () => Promise<void>) {
    if(!(auth.user?.authent=="perushaan")){
      return response.unauthorized("Unauthorize")
    }
    await next()
  }
}
