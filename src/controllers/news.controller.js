import {
  createService,
  findAllService,
  countNewsService,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeNewsService,
  deleteLikeNewsService,
  addCommentService,
  deleteCommentService,
} from "../services/news.service.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      return res.status(400).send({
        message: "Preencha todos os campos.",
      });
    }

    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    return res.status(201).send({ message: "Post criado com sucesso!" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query; //offset é qual o índice do item inicial. Ele é usado como skip

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 5;
    }
    if (!offset) {
      offset = 0;
    }

    const news = await findAllService(offset, limit);
    const total = await countNewsService();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=#${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;

    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=#${limit}&offset=${previous}`
        : null;

    if (news.length === 0) {
      return res.status(400).send({ message: "Não existem notícias." });
    }
    return res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      results: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        userName: newsItem.user.username,
        userAvatar: newsItem.user.avatar,
      })),
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const topNews = async (req, res) => {
  try {
    const news = await topNewsService();

    if (!news) {
      return res
        .status(400)
        .send({ message: "Não existe nenhum post para Top News." });
    }

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const findById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res
        .status(400)
        .send({ message: "Não existem notícias com esse título." });
    }

    return res.send({
      results: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        userName: newsItem.user.username,
        userAvatar: newsItem.user.avatar,
      })),
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const byUser = async (req, res) => {
  try {
    const id = req.userId;

    const news = await byUserService(id);

    return res.send({
      results: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        userName: newsItem.user.username,
        userAvatar: newsItem.user.avatar,
      })),
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    if (!title && !text && !banner) {
      res
        .status(400)
        .send({ message: "Escreva pelo menos um campo para ser atualizado." });
    }

    const news = await findByIdService(id);

    if (news.user._id != req.userId) {
      return res.status(400).send({
        message: "Você não tem permissão para atualizar essa notícia.",
      });
    }

    await updateService(id, title, text, banner);

    return res.send({ message: "Notícia atualizada com sucesso!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const erase = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);

    if (news.user._id != req.userId) {
      return res.status(400).send({
        message: "Você não tem permissão para atualizar essa notícia.",
      });
    }

    await eraseService(id);

    return res.send({ message: "Notícia removida com sucesso!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const newsLiked = likeNewsService(id, userId);

    if (!newsLiked) {
      await deleteLikeNewsService(id, userId);
      return res.status(200).send({ message: "Curtida removida." });
    }

    return res.status(200).send({ message: "Notícia curtida." });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({
        message: "Escreva uma mensagem para o comentário.",
      });
    }

    await addCommentService(id, comment, userId);
    res.send({ message: "Comentário feito com sucesso!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { idNews, idComment } = req.params;
    const userId = req.userId;

    const commentDeleted = await deleteCommentService(
      idNews,
      idComment,
      userId
    );

    const commentFinder = commentDeleted.comments.find(
      (comment) => comment.idComment === idComment
    );

    if (!commentFinder) {
      return res.status(400).send({ message: "Comentário não existe." });
    }
    if (commentFinder.userId != userId) {
      return res
        .status(400)
        .send({
          message: "Você não tem autorização para apagar esse comentário.",
        });
    }

    res.send({ message: "Comentário removido com sucesso!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
export {
  create,
  findAll,
  topNews,
  findById,
  searchByTitle,
  byUser,
  update,
  erase,
  likeNews,
  addComment,
  deleteComment,
};
