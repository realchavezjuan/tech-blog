const router = require('express').Router();
const { User, Post, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    
    Post.findAll({
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at'
        ],
        include: 
        {
          model: User,
          attributes: ['username']
        }
    })
    .then(dbPostData => {
        // const posts = {
        //     id: 1,
        //     post_url: 'https://handlebarsjs.com/guide/',
        //     title: 'Handlebars Docs',
        //     created_at: new Date(),
        //     vote_count: 10,
        //     comments: [{}, {}],
        //     user: {
        //       username: 'test_user'
        //     }
        // }

        //res.render('homepage', dbPostData[0].get({ plain: true }));
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
            username: req.session.username
        });
        
    });
});

// renders login page
router.get('/login', (req, res) => {
    // if logged in, redirect to homepage
    if (req.session.loggedIn) {
        console.log('should redirect');
        res.redirect('/');
        return;
    }
  
    res.render('login');
});

// renders sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/post/:id', (req, res) => {
    console.log(req.params.id)
    console.log('look herrrrreeeee')
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at'
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
        console.log(dbPostData)
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });
  
        // pass data to template
        res.render('single-post', {
          post,
          loggedIn: req.session.loggedIn,
          username: req.session.username
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;