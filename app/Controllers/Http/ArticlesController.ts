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

  public async show({ view, params }: HttpContextContract) {
    const { id } = params

    let article: Article
    try {
      article = await Article.findOrFail(id)
      await article.load('owner')
    } catch (error) {
      console.error(error)
      return view.render('errors/not-found')
    }

    return view.render('article', {
      article,
    })
  }
}
