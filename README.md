<!-- PROJECT LOGO -->
<br />
<div align="center">

  <p align="center">
    NODEJS & MONGODB BLOG
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
</div>
<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This project is a personal blog website created to document my Software Engineering journey. It features an admin dashboard for managing posts, user authentication, and a responsive design. The blog allows me to share insights, record my learning path, and provide valuable content related to software development and programming.

Features:
* **Home Page:** Displays recent blog posts and provides navigation links.
* **Admin Dashboard:** Accessible only after login, it allows managing blog posts with options to create, edit, and delete posts.
* **User Authentication:** Includes admin login functionality with middleware for checking authentication on protected routes.
* **Post Management:** Functionality to create new posts, edit existing posts, and delete posts.
* **Search Functionality:** Allows searching posts by title and body content.
* **Responsive Design:** Ensures the blog is accessible and usable on various devices with different screen sizes.
* **Styled Components:** Utilizes custom fonts, colors, and styled buttons and forms for a consistent and attractive appearance.****
  
### Built With
* [![Nodejs][Nodejs]][Node-url]
* [![Express][Express.js]][Express-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![EJS][EJS]][EJS-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Project Directory
```
BLOG
├── node_modules
├── public
│   ├── css
│   │   └── style.css
│   ├── img
│   │   ├── articles.gif
│   │   ├── blog.png
│   │   ├── blog1.gif
│   │   ├── close.png
│   │   ├── Home.gif
│   │   ├── plus.png
│   │   ├── Search.gif
│   │   └── signout.gif
│   └── js
│       └── script.js
├── server
│   ├── config
│   ├── helpers
│   ├── models
│   └── routes
├── views
│   ├── admin
│   │   ├── add-post.ejs
│   │   ├── dashboard.ejs
│   │   ├── edit-post.ejs
│   │   └── index.ejs
│   ├── layouts
│   │   ├── admin.ejs
│   │   └── main.ejs
│   ├── partials
│   │   ├── footer.ejs
│   │   ├── header_admin.ejs
│   │   ├── header.ejs
│   │   └── search.ejs
│   ├── about.ejs
│   ├── index.ejs
│   ├── post.ejs
│   └── search.ejs
├── .env
├── .gitignore
├── app.js
├── package-lock.json
└── package.json 
```

<!-- USAGE EXAMPLES -->
## Usage

### Authentication Middleware
- The `authMiddleware` function is a crucial part of the application, ensuring that only authenticated users can access certain routes. This middleware checks for a valid JSON Web Token (JWT) in the request cookies and verifies it before allowing access to protected routes.
- ### How It Works**
1. **Token Retrieval**: The middleware first attempts to retrieve the token from the cookies.
2. **Token Validation**: If a token is found, it is verified using the `jsonwebtoken` library and a secret key.
3. **User Identification**: If the token is valid, the middleware decodes the token to extract the user ID and attaches it to the request object.
4. **Access Control**: If no token is found or if the token is invalid, the middleware responds with a 401 Unauthorized status, preventing access to the protected route.
- #### Example Code
  ```javascript
  const jwt = require('jsonwebtoken');
  const jwtSecret = process.env.JWT_SECRET;

  const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).redirect('/unauthorized');
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).redirect('/unauthorized');
    }
  };
  ```

### Home Page
- **View Recent Posts:** The home page displays the most recent blog posts.
- **Read a Post:** Click on any post title to read the full content.

### Admin Dashboard
- **Access the Dashboard:** Log in with your admin credentials to access the dashboard.
- **Create a New Post:**
  - **Steps:**
    1. Navigate to the dashboard.
    2. Click on the "Add Post" button.
    3. Fill in the title and content of your new post.
    4. Click "Submit" to publish the post.
  - **Code:**

    ```javascript
    // POST /add-post
    router.post('/add-post', authMiddleware, async (req, res) => {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
    });
    ```

- **Edit an Existing Post:**
  - **Steps:**
    1. In the dashboard, find the post you want to edit.
    2. Click on the "Edit" button next to the post.
    3. Update the title and content as needed.
    4. Click "Update" to save the changes.
  - **Code:**

    ```javascript
    // PUT /edit-post/:id
    router.put('/edit-post/:id', authMiddleware, async (req, res) => {
      try {
        await Post.findByIdAndUpdate(req.params.id, {
          title: req.body.title,
          body: req.body.body,
          updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
      } catch (error) {
        console.log(error);
      }
    });
    ```

- **Delete a Post:**
  - **Steps:**
    1. In the dashboard, find the post you want to delete.
    2. Click on the "Delete" button next to the post.
    3. Confirm the deletion to remove the post.
  - **Code:**

    ```javascript
    // DELETE /delete-post/:id
    router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
      try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
    });
    ```

### Search Functionality
- **Search for Posts:**
  - **Steps:**
    1. Use the search bar located at the top of the page.
    2. Enter keywords related to the post titles or content.
    3. View the search results that match your query.
  - **Code:**

    ```javascript
    // POST /search
    router.post('/search', async (req, res) => {
      try {
        const locals = {
          title: "Nodejs Blog",
          description: "Simple blog with Nodejs, express & MongoDB"
        };
        let searchTerm = req.body.searchTerm || ""; // Provide a default value
        const searchNoSpecialCharacters = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const data = await Post.find({
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialCharacters, 'i') } },
            { body: { $regex: new RegExp(searchNoSpecialCharacters, 'i') } }
          ]
        });
        res.render('search', { locals, data, currentRoute: '/search' });
      } catch (err) {
        console.error(err);
      }
    });
    ```

### User Authentication
- **Admin Login:**
  - **Steps:**
    1. Go to the admin login page.
    2. Enter your username and password.
    3. Click "Login" to access the admin dashboard.
  - **Code:**

    ```javascript
    // POST /admin
    router.post('/admin', async (req, res) => {
      try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
    });
    ```
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[Nodejs]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[EJS]: https://img.shields.io/badge/EJS-8C8C8C?style=for-the-badge&logo=EJS&logoColor=white
[EJS-url]: https://ejs.co/
