import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [loader, setLoader] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://hyeumine.com/forumGetPosts.php?page=${page}`)
      .then((response) => {
        if (!(response.status === 200 && response.statusText === "OK")) {
          throw new Error("Network response was not ok");
        }
        setPosts(response.data);
        setIsLoading(false);
        console.log(isLoading);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [page, loader]);

  function createNewUser() {
    setIsLoading(true);
    axios
      .post(
        `http://hyeumine.com/forumCreateUser.php`,
        {
          username: document.getElementById("nusername").value,
          password: document.getElementById("npassword").value,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (!(response.status === 200 && response.statusText === "OK")) {
          throw new Error("Network response was not ok");
        }
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function loginUser() {
    setIsLoading(true);
    axios
      .post(
        `http://hyeumine.com/forumLogin.php`,
        {
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (!(response.status === 200 && response.statusText === "OK")) {
          throw new Error("Network response was not ok");
        }
        setUser(response.data.user);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function postPost() {
    setIsLoading(true);
    axios
      .post(
        `http://hyeumine.com/forumNewPost.php`,
        {
          id: user.id,
          post: document.getElementById("poster").value,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (!(response.status === 200 && response.statusText === "OK")) {
          throw new Error("Network response was not ok");
        }
        console.log(response.data);
        setIsLoading(false);
        setLoader(Math.random() * 1000);
        document.getElementById("poster").value = "";
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }



  function deletePost(postid) {
    setIsLoading(true);
    axios
      .post(
        `http://hyeumine.com/forumDeletePost.php?id=${postid}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (!(response.status === 200 && response.statusText === "OK")) {
          throw new Error("Network response was not ok");
        }
        console.log(response.data);
        setIsLoading(false);
        setLoader(Math.random() * 1000);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function logout() {
    setUser(null);
  }

  function flipCard() {
    const card = document.querySelector(".card");
    card.classList.toggle("flipped");
  }

  return (
    <>
      {user !== null ? (
        <>
          <Button id="log-button" variant="contained" onClick={logout}>
            Logout
          </Button>
          <textarea id="poster" /> <br />
          <button onClick={postPost}>Post a Post</button>
          <br />
          <button
            onClick={() => {
              setPage(page > 1 ? page - 1 : 1);
            }}
          >
            Prev Page
          </button>{" "}
          |
          <button
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next Page
          </button>
          {posts.map((post, id) => {
            return (
              <div
                key={id}
                style={{
                  textAlign: "right",
                  padding: "10px",
                  width: "80%",
                  margin: "10px auto",
                }}
              >
                {user !== null && user.id === post.uid ? (
                  <>
                    <button
                      onClick={() => {
                        deletePost(post.id);
                      }}
                      style={{ fontSize: "7px" }}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <></>
                )}
                <h3>{post.post}</h3>
                <h5 style={{ fontStyle: "italic" }}>{post.user}</h5>
                <div style={{ background: "#eee" }}>
                  {user !== null ? (
                    <>
                      <textarea id={"reply-" + post.id} />
                      <button onClick={() => replyPost(post.id)}>Reply</button>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {post.reply ? (
                    <>
                      {post.reply.map((reply, id) => {
                        return (
                          <div
                            key={id}
                            style={{ margin: "5px", padding: "10px" }}
                          >
                            {user !== null && user.id === reply.uid ? (
                              <>
                                <button
                                  onClick={() => {
                                    deleteReply(reply.id);
                                  }}
                                  style={{ fontSize: "7px" }}
                                >
                                  X
                                </button>
                              </>
                            ) : (
                              <></>
                            )}
                            <h3>{reply.reply}</h3>
                            <h6 style={{ fontStyle: "italic" }}>
                              {reply.user}
                            </h6>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>No Replies Yet</>
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="login-div">
          <div className="title">
            <h1>Hello World</h1>
          </div>
          <div className="card-container">
            <div className="card">
              <div className="login-card">
                <div className="header-text">Welcome Back!</div>
                <div className="for-textfields">
                  <div className="username-div">
                    <input type="text" id="username" />
                  </div>
                  <div className="password-div">
                    <input type="password" id="password" />
                  </div>
                </div>
                <Button id="log-button" variant="contained" onClick={loginUser}>
                  Login
                </Button>
                <div className="for-flip">
                  No account yet?
                  <a href="#" onClick={flipCard} className="clickable-text">
                    Get started.
                  </a>
                </div>
              </div>
              <div className="create-user-card">
                <div className="header-text">Text</div>
                <input type="text" id="nusername" />
                <input type="password" id="npassword" />
                <button onClick={createNewUser}>Create New User</button>
                <a href="#" onClick={flipCard} className="clickable-text">
                  Flip Card
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
