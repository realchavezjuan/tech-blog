const router = require('express').Router();
const { User, Post } = require('../../models'); // index.js in models doesnt need to be specified

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
              model: User,
              attributes: ['username']
            }
        ]
    }).then(posts => {
        res.json(posts);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        // },
        // include: {
        //     model: User,    
        //     attributes: ['username']
        } 
    }).then(dbPostData => {
        // first check if that posts even exists
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

router.post('/', (req, res) => {
    // {
    //     "title": "Taskmaster goes public!",
    //     "post_url": "https://taskmaster.com/press",
    //     "user_id": 1
    // }
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// edit a post
router.put('/:id', (req, res)=>{
    console.log(req.params.id)
    Post.update(
        {
            title: req.body.title
        },
        {
            where:{
                id: req.params.id
            }
        }
    ).then(dbPostData => {
        // first check if that posts even exists
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

// delete a post
router.delete('/:id', (req, res)=>{
    console.log(req.body.id)
    Post.destroy({
        where:{
            id: req.params.id
        }
    }).then(dbPostData => {
        // first check if that posts even exists
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;