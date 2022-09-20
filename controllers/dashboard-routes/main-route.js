
// IMPORTS
const router = require('express').Router();
const {isLoggedInUrlAuth} = require('../../utils/auth');
const {User, Template, Fillin} = require('../../models');
const sequelize = require('../../config/connection');



// ROUTE

router.get('/', isLoggedInUrlAuth, async (req, res) => {
    var currentUserData = await User.findByPk(req.session.user_id, {
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
                include: [
                    {
                        model: Template,
                        attributes: ['title', 'id']
                    },
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            }
        ],
        order: [
            [{model: Template, as: 'templates'}, 'created_at', 'DESC'],
            [{model: Fillin, as: 'fillins'}, 'created_at', 'DESC']
        ]
    });

    currentUserData = currentUserData.get({plain: true});
    currentUserData.fillins = currentUserData.fillins.map(fillin => {
        fillin.content = JSON.parse(fillin.content);
        return fillin;
    });

    res.render('dashboard', {
        user: currentUserData,
        loggedIn: true,
        pageSubtitle: 'Dashboard'
    });
});



// EXPORT
module.exports = router;