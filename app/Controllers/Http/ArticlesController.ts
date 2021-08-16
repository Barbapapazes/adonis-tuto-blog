import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Article from 'App/Models/Article'
import ArticleValidator from 'App/Validators/ArticleValidator'

export default class ArticlesController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)

    const articles = await Article.query().paginate(page, 3)

    articles.baseUrl('/articles')

    return view.render('articles/index', {
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
    return view.render('articles/show', {
      article,
    })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('articles/create')
  }

  public async store({ request, view, auth }: HttpContextContract) {
    const { user } = auth
    const { title, content } = await request.validate(ArticleValidator)

    const article = await Article.create({
      title,
      content,
      ownerId: user!.id,
    })

    await article.load('owner')

    return view.render('articles/show', {
      article,
    })
  }

  public async edit({ view, params }: HttpContextContract) {
    const { id } = params

    let article: Article
    try {
      article = await Article.findOrFail(id)
    } catch (error) {
      console.error(error)
      return view.render('errors/not-found')
    }

    return view.render('articles/edit', {
      article,
    })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const { id } = params

    let article: Article
    try {
      article = await Article.findOrFail(id)
    } catch (error) {
      console.error(error)
      return view.render('errors/not-found')
    }

    const { title, content } = await request.validate(ArticleValidator)

    article.title = title
    article.content = content

    await article.save()
    await article.load('owner')

    return view.render('articles/show', {
      article,
    })
  }
}
