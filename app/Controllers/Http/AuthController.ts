import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'

export default class AuthController {
  public async login({ request, auth, response, session }: HttpContextContract) {
    const { pseudo, password } = await request.validate(LoginValidator)

    try {
      await auth.use('web').attempt(pseudo, password)
      response.redirect('/articles')
    } catch (error) {
      session.flash('auth', 'Authentication impossible')
      response.redirect().back()
    }
  }
}
