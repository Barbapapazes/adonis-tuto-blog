import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Article from 'App/Models/Article'

export default class ArticlesController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)

    const articles = await Article.query().paginate(page, 3)

    articles.baseUrl('/articles')

    return view.render('articles', {
      articles,
    })
  }
}
