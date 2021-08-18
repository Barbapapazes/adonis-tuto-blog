import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'

export default class LoginController {
  public async create({ view }: HttpContextContract) {
    return view.render('login')
  }

  public async store({ request, auth, response, session }: HttpContextContract) {
    const { pseudo, password } = await request.validate(LoginValidator)

    try {
      await auth.attempt(pseudo, password)
      response.redirect('/articles')
    } catch (error) {
      session.flash('auth', 'Authentification impossible')
      response.redirect().back()
    }
  }
}
