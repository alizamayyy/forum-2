import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function Home() {
  const location = useLocation();
  const user = location.state.user || null;
  console.log(user);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [loader, setLoader] = useState(1);
  const navigate = useNavigate();

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

  function replyPost(postid) {
    setIsLoading(true);
    axios
      .post(
        `http://hyeumine.com/forumReplyPost.php`,
        {
          user_id: user.id,
          post_id: postid,
          reply: document.getElementById("reply-" + postid).value,
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
        document.getElementById("reply-" + postid).value = "";
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function deleteReply(replyid) {
    setIsLoading(true);
    axios
      .post(
        `http://hyeumine.com/forumDeleteReply.php?id=${replyid}`,
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
    navigate("/");
  }

  return (
    <>
      <div className="home-page">
        <div className="posting">
          <textarea id="poster" placeholder="What's on your mind?" /> <br />
          <Button id="post-button" onClick={postPost}>
            Post
          </Button>
          <br />
          <Button id="log1-button" variant="contained" onClick={logout}>
            Logout
          </Button>
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
        </div>
        <div className="posts-display">
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
        </div>
      </div>
    </>
  );
}

export default Home;
