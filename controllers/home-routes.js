
// IMPORTS
const router = require('express').Router();



// ROUTES

// Home page
router.get('/', async (req, res) => {
    const testTemplate = {
        "id": 2,
        "title": "Template #2",
        "content": [
            {
                "isStatic": false,
                "label": "Plural noun",
                "mutableIndex": 0
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "are",
                "staticIndex": 0
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "my",
                "staticIndex": 1
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "favorite",
                "staticIndex": 2
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "types",
                "staticIndex": 3
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "of",
                "staticIndex": 4
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": false,
                "label": "plural noun",
                "mutableIndex": 1
            },
            {
                "isStatic": true,
                "word": ".",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "I'm",
                "staticIndex": 5
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "a",
                "staticIndex": 6
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "big",
                "staticIndex": 7
            },
            {
                "isStatic": true,
                "word": ",",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "big",
                "staticIndex": 8
            },
            {
                "isStatic": true,
                "word": " ",
                "staticIndex": null
            },
            {
                "isStatic": true,
                "word": "fan",
                "staticIndex": 9
            },
            {
                "isStatic": true,
                "word": "!",
                "staticIndex": null
            }
        ],
        "static_count": 10,
        "mutable_count": 2,
        "redaction_order": [
            3,
            0,
            1,
            2
        ],
        "created_at": "2022-09-19T23:18:20.000Z",
        "user": {
            "id": 2,
            "username": "claudiay"
        },
        "fillins": [
            {
                "id": 3,
                "created_at": "2022-09-19T23:18:25.000Z",
                "content": [
                    "plaintains",
                    "mice"
                ],
                "vote_count": 2,
                "user": {
                    "id": 3,
                    "username": "noahb"
                }
            },
            {
                "id": 2,
                "created_at": "2022-09-19T23:18:24.000Z",
                "content": [
                    "Cucumbers",
                    "aardvarks"
                ],
                "vote_count": 1,
                "user": {
                    "id": 2,
                    "username": "claudiay"
                }
            }
        ]
    };


    const testFillin = {
        "id": 1,
        "content": [
            "Jeeves",
            "spelunk",
            "waterpark",
            "Saturday"
        ],
        "created_at": "2022-09-20T01:44:45.000Z",
        "vote_count": 1,
        "template": {
            "id": 1,
            "title": "Template #1",
            "content": [
                {
                    "isStatic": true,
                    "word": "Hello",
                    "staticIndex": 0
                },
                {
                    "isStatic": true,
                    "word": ",",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "my",
                    "staticIndex": 1
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "name",
                    "staticIndex": 2
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "is",
                    "staticIndex": 3
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": false,
                    "label": "noun",
                    "mutableIndex": 0
                },
                {
                    "isStatic": true,
                    "word": ".",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "I",
                    "staticIndex": 4
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "like",
                    "staticIndex": 5
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "to",
                    "staticIndex": 6
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "go",
                    "staticIndex": 7
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": false,
                    "label": "verb",
                    "mutableIndex": 1
                },
                {
                    "isStatic": true,
                    "word": "ing",
                    "staticIndex": 8
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "in",
                    "staticIndex": 9
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "the",
                    "staticIndex": 10
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": false,
                    "label": "noun",
                    "mutableIndex": 2
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": true,
                    "word": "on",
                    "staticIndex": 11
                },
                {
                    "isStatic": true,
                    "word": " ",
                    "staticIndex": null
                },
                {
                    "isStatic": false,
                    "label": "day of week",
                    "mutableIndex": 3
                },
                {
                    "isStatic": true,
                    "word": ".",
                    "staticIndex": null
                }
            ],
            "user": {
                "username": "minm"
            }
        },
        "user": {
            "id": 2,
            "username": "claudiay"
        },
        "comments": [
            {
                "id": 1,
                "content": "Great job!",
                "created_at": "2022-09-20T01:44:50.000Z",
                "user": {
                    "id": 1,
                    "username": "minm"
                }
            }
        ]
    };

    

    res.render('homepage', {
        loggedIn: true, // TESTER: should be 'req.session.loggedIn',
        template: testTemplate,
        // fillin: testFillin, // TESTER
        pageSubtitle: testTemplate.title // TESTER
    });
});





// EXPORT
module.exports = router;