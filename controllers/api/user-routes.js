const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote, Fillin } = require('../../models');

// Get all users (GET)
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// Get one user (GET)
router.get('/:id', (req, res) => {
    User.findOne({
        attributes:{exclude: ['password']},
        where: {
            id: req.params.id
        }, 
        include: [
            {
                model: Fillin, 
                attributes: ['id', 'fillin_url', 'created_at']
            },
            {
                model: Comment, 
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Fillin, 
                    attributes: ['id']
                }
            },
            {   model: Vote, 
                attributes: [id],
        
            }
        ]
    }) .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create new user + log them in (POST)
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email, 
        password: req.body.password,
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
})


// Login (POST)

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user with that email address!' });
          return;
        }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if(!validPassword){
        res.status(400).json({message: 'Incorrect password.'});
        return;
    }
    res.json({user:dbUserData, message: 'Welcome to madLibs!'});
    })
});

// Logout (POST)

router.delete('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
          res.send('Logout successful')
        }
      });
    } else {
      res.end()
    }
  })

// Delete (DELETE)

router.delete('/:id', (req, res) => {
    Fillin.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbFillinData => {
        if (!dbFillinData) {
          res.status(404).json({ message: 'This item has been deleted' });
          return;
        }
        res.json(dbFillinData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router; 

