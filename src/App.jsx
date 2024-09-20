import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import './App.css';

const CommentsContext = createContext({
  postId: null,
  setPostId: () => {},
  comments: [],
  setComments: () => {}
});

const RouterContext = createContext();

const routes = [
  {
    id: crypto.randomUUID(),
    name: 'Home',
    url: '#/',
    element: <Home />,
  },
  {
    id: crypto.randomUUID(),
    name: 'About',
    url: '#/about',
    element: <About />,
  },
  {
    id: crypto.randomUUID(),
    name: 'Posts',
    url: '#/posts',
    element: <Posts />,
  },
  {
    id: crypto.randomUUID(),
    name: 'Contact',
    url: '#/contact',
    element: <Contact />,
  },
];

const notFound = {
  name: 'Page not found',
  element: <NotFound />,
  url: '',
};

function getRoute(routeUrl) {
  const route = routes.find((x) => x.url === routeUrl);

  if (!route) {
    const baseRoute = routes.find((x) => routeUrl.startsWith(x.url.split('/')[0]));
    return baseRoute ?? notFound;
  }
  return route;
}


const title = 'App';

function setTitle(pageTitle) {
  document.title = `${pageTitle} - ${title}`;
}

function App() {
  const [route, setRoute] = useState(() => {
    if (location.hash.length < 2) {
      return routes[0];
    }
    return getRoute(location.hash);
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  const [postId, setPostId] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setTitle(route.name);
  }, [route]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute(window.location.hash));
    };
  
    window.addEventListener('hashchange', handleHashChange);
  
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <CommentsContext.Provider value={{ postId, setPostId, comments, setComments }}>
      <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <RouterContext.Provider value={route}>
          <Header toggleDarkMode={() => setDarkMode((prev) => !prev)} />
          <Main />
          <Footer />
        </RouterContext.Provider>
      </div>
    </CommentsContext.Provider>
  );
}


function Main() {
  return (
    <div className="main">
      <div className="scroll-container">
        <Content />
      </div>
    </div>
  );
}

function Header({ toggleDarkMode }) {
  return (
    <div className="header">
      <a href="#/" className="Logo">App</a>
      <Nav />
      <label className="switch">
        <input
          type="checkbox"
          onChange={toggleDarkMode}
          defaultChecked={document.body.classList.contains('dark-mode')}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

function Nav() {
  const route = useContext(RouterContext);

  return (
    <ul className="nav">
      {routes.map((x) => (
        <li key={x.id}>
          <a href={x.url} className={route.url === x.url ? 'selected' : ''}>
            {x.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Content() {
  const route = useContext(RouterContext);

  return (
    <div className="content">
      <h1>{route.name}</h1>
      {route.element}
    </div>
  );
}

function Footer() {
  return <div className="footer">&copy; 2024</div>;
}

function LikeBtn() {
  const [likeCount, setLikeCount] = useState(localStorage.likeCount ? parseInt(localStorage.likeCount) : 0);

  useEffect(() => {
    localStorage.likeCount = likeCount;
  }, [likeCount]);

  function increaseLikeCount() {
    setLikeCount(likeCount + 1);
  }

  return (
    <button className="LikeBtn" onClick={increaseLikeCount}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-heart"
        width="30"
        height="30"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.9 4.5 2.4 1.09-1.5 2.76-2.4 4.5-2.4C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      {likeCount}
    </button>
  );
}

function Home() {
  return (
    <div className="Home">
      <fieldset>
        <legend>
          <h2>Welcome to Our Platform</h2>
        </legend>
        <p>
          At <span style={{ textDecoration: 'underline #1C5CFF' }}>App</span>, we’re dedicated to delivering innovative
          and reliable digital solutions that simplify your life. Whether you're here to explore our services, discover
          new insights, or connect with our global community, you’re in the right place.
          <br />
          Welcome aboard!
        </p>
      </fieldset>
    </div>
  );
}

function About() {
  return (
    <div className="About">
      <h2>Our Vision</h2>
      <p>We aim to be a pioneer in the digital world by offering innovative solutions and delivering the best experience to our users. By harnessing the power of technology, we strive to expand our reach and impact every day.</p>
      <h2>Our Mission</h2>
      <p>To provide fast, reliable, and cutting-edge services tailored to the needs of our users. Our goal is to grow with a commitment to excellence in every area and to make a difference with our solutions.</p>
      <h2>Our Story</h2>
      <p>In 2022, we started this journey as a small team passionate about technology and driven by a problem-solving mindset. Our purpose was to provide quick and effective solutions to the digital challenges faced by our users. Today, we have grown into a global community, offering our services on a larger scale with the same dedication.</p>
      <h2>Our Values</h2>
      <p>We believe in innovation, integrity, and customer-centricity. Every solution we create is designed with our users in mind, ensuring transparency and excellence in everything we do. Collaboration and constant learning are at the core of our approach, allowing us to continuously evolve and stay ahead of industry trends.</p>
      <h2>Our Team</h2>
      <p>Our team consists of passionate individuals from diverse backgrounds, each bringing unique expertise to the table. With a shared vision of driving progress, we work together to build solutions that are not only functional but also transformative for our users.</p>
      <h2>Looking Ahead</h2>
      <p>As we continue to grow, we remain committed to pushing the boundaries of what's possible. Our focus is on creating meaningful experiences that make a lasting impact. Whether it’s developing new technologies or enhancing existing services, we are always exploring ways to deliver value to our users and partners.</p>
    </div>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name, 
          title: formData.title,
          content: formData.content,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Post başarıyla eklendi:', data);
        
        setIsSubmitted(true);
        
        setFormData({
          name: '',
          title: '',
          content: '',
        });
      } else {
        console.error('Bir hata oluştu:', response.statusText);
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };

  return (
    <div className='Contact'>
      <form className="ContactInputArea" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name} 
            onChange={handleInputChange}
            placeholder='Adınız'
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder='Konu'
            required
          />
        </div>
        <div className="form-group">
          <input
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Düşünceleriniz..."
            required
          />
        </div>
        <button type="submit">Gönder</button>
      </form>

      {isSubmitted && <p>Gönderildi!</p>}
    </div>
  );
}

function Posts() {
  const [posts, setPosts] = useState([]);
  const { postId, setPostId } = useContext(CommentsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          setError('Error loading posts.');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return postId ? <PostDetail /> : <PostList posts={posts} setPostId={setPostId} />;
}

function PostList({ posts, setPostId }) {
  const [pageSize, setPageSize] = useState(6);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(posts.length);
  const [paginatedPosts, setPaginatedPosts] = useState([]);

  useEffect(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedPosts(posts.slice(startIndex, endIndex));
  }, [page, pageSize, posts]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePrevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <>
      <div>
        <select
          className="limitSelect"
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            setPage(1);
          }}
        >
          <option value="6">6</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>

      <div className="TitlesWrapper">
        {paginatedPosts.map((post) => (
          <li key={post.id} onClick={() => setPostId(post.id)} className="Titles">
            {post.title}
            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </div>

      {totalPages > 1 && (
        <ul className="Pagination">
          <li>
            <a href="#" onClick={handlePrevPage}>
              &lt;
            </a>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((x) => (
            <li key={x}>
              <a
                href="#"
                className={page === x ? 'activePage' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(x);
                }}
              >
                {x}
              </a>
            </li>
          ))}
          <li>
            <a href="#" onClick={handleNextPage}>
              &gt;
            </a>
          </li>
        </ul>
      )}
    </>
  );
}

function PostDetail() {
  const { postId, setPostId, comments, setComments } = useContext(CommentsContext);
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const commentRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    fetchPost();
  }, [postId, refresh]);

  if (!post) {
    return <div>Loading post...</div>;
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const formObj = Object.fromEntries(new FormData(e.target));

    const newCommentObj = {
      id: crypto.randomUUID(),
      postId,
      body: newComment,
      likes: 0,
      dislikes: 0,
      ...formObj,
    };

    try {
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
      if (response.ok) {
        const updatedComments = await response.json();
        setComments([...comments, updatedComments]);
        setRefresh(!refresh);
        formRef.current.reset();
      }
    } catch (e) {
      setError("Bir hata oluştu, yorum eklenemedi.");
    }

    setComments([...comments, newCommentObj]);
    setNewComment('');
    commentRef.current.focus();
  };

  const handleLike = (commentId) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: (comment.likes || 0) + 1 };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleDislike = (commentId) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, dislikes: (comment.dislikes || 0) + 1 };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  function toggleComments() {
    setShowComments(prevShowComments => !prevShowComments);
  }

  return (
    <div className="PostDetail">
      <div className="Post">
        <p><a href="#/posts" onClick={() => setPostId(null)}>&lt; Back</a></p>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <hr />
        <div className="PostButtons">
          <LikeBtn />
          <button className='ShowBtn' onClick={toggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>
      </div>

      <div className="Comments">
        {showComments && (
          <div className="comments-section">
            <fieldset>
              <legend>Comments</legend>
              <ul className="comments-list">
                {comments.map(comment => (
                  <li key={comment.id} className="comment-item">
                    <p><strong>{comment.user?.fullName || 'Anonymous'}</strong> {comment.body}</p>
                    <button onClick={() => handleLike(comment.id)}>👍 {comment.likes || 0}</button>
                    <button onClick={() => handleDislike(comment.id)}>👎 {comment.dislikes || 0}</button>
                  </li>
                ))}
              </ul>
            </fieldset>
            <form onSubmit={handleCommentSubmit} className="new-comment">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                ref={commentRef}
                required
              />
              <button type='submit'>Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

export default App;
