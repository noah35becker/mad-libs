# Mad Libs
[![License: MIT License](https://img.shields.io/badge/License-MIT%20License-informational.svg)](https://choosealicense.com/licenses/mit)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
    



## Repo
[https://github.com/noah35becker/mad-libs](https://github.com/noah35becker/mad-libs)


## Live application
[https://morning-caverns-82636.herokuapp.com/](https://morning-caverns-82636.herokuapp.com/)



## Description
This application reimagines <b>Mad Libs</b>, the popular word game, in a browser-based forum/blog context. Users register for an account, create Mad Libs templates, fill in other user-generated templates, and comment/upvote on other users' fill-ins.


<i><b>
## Table of contents
- [Usage](#usage)
- [Features](#features)
- [Directions for future development](#directions-for-future-development)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)
- [Questions](#questions)
- [Screenshots of deployed application](#screenshots-of-deployed-application)

</i></b>

## Usage
Using the application should be intuitive and self-explanatory.
<br>
If you would prefer not to make your own account, you may use these test credentials:
- u: test@gmail.com
- p: testtest123


## Features
- <b>User accounts</b> (including account management)
- <b>Template maker</b> interface
- Adjustable <b>redaction</b> of Mad Libs templates (this really pops on screen!)—check out this [<b>GitHub Gist</b>](https://gist.github.com/noah35becker/7c7bb7a8b930d07cf1fd1f2b90577191) for a technical walkthrough
- <b>Filling in</b> templates created by other users
- <b>Commenting</b> and <b>upvoting</b> on other users' fill-ins
- Front-end <b>sorting</b> options for templates and fill-ins (most recent, top voted, random)
- Buttons for viewing a <b>random</b> template or fill-in
- <b>Auto logout</b> after 15 minutes of user idleness
- <b>Administrator access</b> with global delete privileges for templates/fillins/comments
- <b>Responsive design</b>, adapting to different viewports and devices



## Directions for future development
- The <b>email</b> feature should be developed to actually include standard account management functionality, including signup verification + password recovery.
- Beyond users simply generating new templates from scratch, <b>old templates should be duplicable</b> as another possible starting-point.
- Attach a <b>`new` tag</b> to fill-ins that have been created within the last 24 hours, to display as part of fill-in metadata.
- If the static word <b>'a'/'an'</b> appears in a template and is immediately followed by a fill-in field, then when that template is filled in by another user, change this word accordingly depending on whether the fill-in word begins with a vowel.
- Improve <b>line breaks</b> for how fill-ins render on screen.
- On input, fill-ins could record a <b>`maxVisibilityOnInput`</b> value corresponding to the <b>maximum unredaction</b> with which the user viewed the template while filling it in. This could later be offered as a sort/filter parameter for user-generated fill-ins. The idea here is that filling out a template with full redaction leads to very different sorts of fill-ins than filling out a template with partial or no redaction.
- <b>Username and password validation</b> during account creation (minimum # of characters, required uppercase/lowercase/special characters, etc.).
- All screens that require a password should have the option to <b>show or hide</b> it while inputting.
- There are places in the application where it would be helpful to have the user <b>enter their password twice</b>.
- A <b>search</b> feature for templates and/or fill-ins.




## Credits

### Collaborators
- Noah Becker ([GitHub](https://github.com/noah35becker))
- Claudia Yile ([GitHub](https://github.com/claudiayile))
- Min Maung ([GitHub](https://github.com/minmaung0307))

### Third-party assets
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [Handlebars](https://handlebarsjs.com/) template engine
- Node packages: 
    - [Express](https://www.npmjs.com/package/express)
    - [MySQL2](https://www.npmjs.com/package/mysql2)
    - [Express Session](https://www.npmjs.com/package/express-session)
    - [Express Handlebars](https://www.npmjs.com/package/express-handlebars)
    - [Sequelize](https://www.npmjs.com/package/sequelize)
    - [Connect Session Sequelize](https://www.npmjs.com/package/connect-session-sequelize)
    - [Bcrypt](https://www.npmjs.com/package/bcrypt)
    - [Lodash shuffle](https://www.npmjs.com/package/lodash.shuffle)
    - [Luxon](https://www.npmjs.com/package/luxon)
    - [Dotenv](https://www.npmjs.com/package/dotenv)
- [Heroku](https://www.heroku.com/)
- [JawsDB MySQL](https://devcenter.heroku.com/articles/jawsdb)

### Tutorials
- [RegEx tutorial #1](https://regexone.com/)
- [RegEx tutorial #2](https://towardsdatascience.com/regular-expressions-clearly-explained-with-examples-822d76b037b4)
- [Greedy and lazy quantifiers](https://javascript.info/regexp-greedy-and-lazy)






## Contributing
Feel free to fork this project's [repo](https://github.com/noah35becker/mad-libs), contribute code, and submit pull requests [here](https://github.com/noah35becker/mad-libs/pulls)!

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

Contributors to this project must follow all guidelines set forth by the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).



## License

[![License: MIT License](https://img.shields.io/badge/License-MIT%20License-informational.svg)](https://choosealicense.com/licenses/mit)

Learn more about this license [here](https://choosealicense.com/licenses/mit).



## Questions
My GitHub username is [noah35becker](https://github.com/noah35becker).

If you have any questions, I'd be glad to hear from you—contact me at [noahbeckercoding@gmail.com](mailto:noahbeckercoding@gmail.com).



## Screenshots of deployed application

Below are screenshots of the application:
<br />

Home page
<br />
<img src="assets/screenshots/home-page.png" width="600"/>

<br />
User dashboard
<img src="assets/screenshots/user-dashboard.png" width="600"/>

<br />
The template maker
<img src="assets/screenshots/template-maker.png" width="600"/>

<br />
A template, fully redacted
<img src="assets/screenshots/template-full-redaction.png" width="600"/>

<br />
That same template, now in a state of partial unredaction
<img src="assets/screenshots/template-partial-redaction.png" width="600"/>

<br />
A fillin
<img src="assets/screenshots/fillin.png" width="600"/>