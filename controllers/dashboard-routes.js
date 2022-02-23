const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        where: {
          // use the ID from the session
          user_id: req.session.user_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
        ],
        include: [
        //   {
        //     model: Comment,
        //     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        //     include: {
        //       model: User,
        //       attributes: ['username']
        //     }
        //   },
          {
            model: User,
            attributes: ['username']
          }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', {
            loggedIn: req.session.loggedIn,
            username: req.session.username,
            posts
        });
    })
    
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({
        where: {
          id: req.params.id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
    
          // serialize the data
          const post = dbPostData.get({ plain: true });
    
          // pass data to template
          res.render('edit-posts', {
            post,
            loggedIn: true,
            username: req.session.username
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

module.exports = router