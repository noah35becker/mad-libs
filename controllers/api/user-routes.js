
// IMPORTS
const router = require('express').Router();
const {User, Template, Fillin } = require('../../models');
const sequelize = require('../../config/connection');
const {isLoggedInApiAuth, isLoggedOutApiAuth} = require('../../utils/auth');
const {MIN_PASSWORD_LENGTH} = require('../../utils/global-vars')


// ROUTES

// Get all
router.get('/', async (req, res) => {
    try{
        var dbUsersData = await User.findAll({
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Template,
                    as: 'templates',
                    attributes: ['id', 'title', 'created_at']
                },
                {
                    model: Fillin,
                    as: 'fillins',
                    attributes: [
                        'id',
                        'content',
                        'created_at',
                        [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE fillins.id = vote.fillin_id)`), 'vote_count'],
                        [sequelize.literal(`(SELECT COUNT(*) FROM comment WHERE fillins.id = comment.fillin_id)`), 'comment_count']
                    ],
                    include: {
                        model: Template,
                        attributes: ['title', 'id']
                    }
                }
            ],
            order: [
                ['id', 'ASC'],
                [{model: Fillin, as: 'fillins'}, 'created_at', 'DESC']
            ]
        });

        dbUsersData = dbUsersData.map(user => {
            user = user.get({plain: true});
            user.fillins = user.fillins.map(fillin => {
                fillin.content = JSON.parse(fillin.content);
                return fillin;
            })
            return user;
        });

        res.json(dbUsersData);
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Get one
router.get('/:id', async (req, res) => {
    try{
        var dbUserData = await User.findByPk(req.params.id, {
            attributes: {
                exclude: ['password', 'email']
            },
            include: [
                {
                    model: Template,
                    as: 'templates',
                    attributes: [
                        'id',
                        'title',
                        'created_at',
                        [sequelize.literal(`(SELECT COUNT(*) FROM fillin WHERE templates.id = fillin.template_id)`), 'fillin_count']
                    ]
                },
                {
                    model: Fillin,
                    as: 'fillins',
                    attributes: [
                        'id',
                        'content',
                        'created_at',
                        [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE fillins.id = vote.fillin_id)`), 'vote_count'],
                        [sequelize.literal(`(SELECT COUNT(*) FROM comment WHERE fillins.id = comment.fillin_id)`), 'comment_count']
                    ],
                    include: {
                        model: Template,
                        attributes: ['title', 'id']
                    }
                }
            ],
            order: [
                [{model: Template, as: 'templates'}, 'created_at', 'DESC'],
                [{model: Fillin, as: 'fillins'}, 'created_at', 'DESC']
            ]
        });

        if (!dbUserData){
            res.status(404).json({message: 'No user found with this ID'});
            return;
        }

        dbUserData = dbUserData.get({plain: true});
        dbUserData.fillins = dbUserData.fillins.map(fillin => {
            fillin.content = JSON.parse(fillin.content);
            return fillin;
        });
        
        res.json(dbUserData);
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Create new user + log them in
router.post('/', isLoggedOutApiAuth, async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            const jsonUserData = dbUserData.get({plain: true});
            delete jsonUserData.password;
            res.json({ // This must occur INSIDE req.session.save (due to synchronicity)
                message: 'New user successfully created + logged in',
                user: jsonUserData
            });
        });
    }catch (err){
        console.log(err);

        let errJson = JSON.parse(JSON.stringify(err));
        if (errJson.name === 'SequelizeUniqueConstraintError'){
            errJson.message = 'This username and/or email address are already taken';
            res.status(409).send(errJson);
        } else if (errJson.name === 'SequelizeValidationError') {
            errJson.message = `Password must be at least ${MIN_PASSWORD_LENGTH} chars`;
            res.status(400).send(errJson);
        } else
            res.status(500).send(errJson);
    }
});


// Login
router.post('/login', isLoggedOutApiAuth, async (req, res) => {
    try{
        const dbUserData = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!dbUserData){
            res.status(404).json({message: 'No user found with this email address'});
            return;
        }

        const isPwCorrect = await dbUserData.checkPassword(req.body.password);
        if (!isPwCorrect){
            res.status(400).json({message: 'Incorrect password'});
            return;
        }
        
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            const jsonUserData = dbUserData.get({plain: true});
            delete jsonUserData.password;
            res.json({ // This must occur INSIDE req.session.save (due to synchronicity)
                message: 'Login successful',
                user: jsonUserData
            });
        });
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Logout
router.post('/logout',
    isLoggedInApiAuth, // technically unnecessary: req.session.destroy() will work even if there's no session to destroy
    (req, res) => req.session.destroy(() => res.status(204).end())
);


// Update password
router.put('/update-password', isLoggedInApiAuth, async (req, res) => { // expects {old_password, new_password}
    try{
        const dbUserData = await User.findByPk(req.session.user_id);

        const isOldPwCorrect = await dbUserData.checkPassword(req.body.old_password);
        if (!isOldPwCorrect){
            res.status(400).json({message: 'Old password is incorrect'});
            return;
        }

        const updatedUserData = await dbUserData.update({
            password: req.body.new_password
        });

        const jsonUserData = updatedUserData.get({plain: true});
        delete jsonUserData.password;
        res.json({
            message: 'Password successfully updated',
            user: jsonUserData
        });
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    }
});


// Update username
router.put('/update-username', isLoggedInApiAuth, async (req, res) => { // expects {username, password}
    try{
        const dbUserData = await User.findByPk(req.session.user_id);

        const isPwCorrect = await dbUserData.checkPassword(req.body.password);
        if (!isPwCorrect){
            res.status(400).json({message: 'Incorrect password'});
            return;
        }

        const updatedUserData = await dbUserData.update({
            username: req.body.username,
            password: req.body.password
        });

        const jsonUserData = updatedUserData.get({plain: true});
        delete jsonUserData.password;
        res.json({
            message: 'Username successfully updated',
            user: jsonUserData
        });
    }catch (err){
        console.log(err);

        let errJson = JSON.parse(JSON.stringify(err));
        if (errJson.name === 'SequelizeUniqueConstraintError'){
            errJson.message = 'This username is already taken';
            res.status(409).send(errJson);
        } else
            res.status(500).send(errJson);  
    }
});


// Update email
router.put('/update-email', isLoggedInApiAuth, async (req, res) => { // expects {email, password}
    try{
        const dbUserData = await User.findByPk(req.session.user_id);

        const isPwCorrect = await dbUserData.checkPassword(req.body.password);
        if (!isPwCorrect){
            res.status(400).json({message: 'Incorrect password'});
            return;
        }

        const updatedUserData = await dbUserData.update({
            email: req.body.email,
            password: req.body.password
        });

        const jsonUserData = updatedUserData.get({plain: true});
        delete jsonUserData.password;
        res.json({
            message: 'Email successfully updated',
            user: jsonUserData
        });
    }catch (err){
        console.log(err);

        let errJson = JSON.parse(JSON.stringify(err));
        if (errJson.name === 'SequelizeUniqueConstraintError'){
            errJson.message = 'This email is already taken';
            res.status(409).send(errJson);
        } else
            res.status(500).send(errJson);  
    }
});


// Delete
router.delete('/', isLoggedInApiAuth, async (req, res) => { // expects {password}
    try{
        const dbUserData = await User.findByPk(req.session.user_id);

        const isPwCorrect = await dbUserData.checkPassword(req.body.password);
        if (!isPwCorrect){
            res.status(400).json({message: 'Incorrect password'});
            return;
        }
        
        await dbUserData.destroy();
            
        req.session.destroy(() => res.json({message: 'Deleted and logged out'}));
    }catch (err){
        console.log(err);
        res.status(500).json(err);
    };
});



// EXPORT
module.exports = router; 
