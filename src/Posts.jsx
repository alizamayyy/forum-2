import { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

function Posts() {
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
        if (response.status === 200 && response.statusText === "OK") {
          setPosts(response.data);
          setIsLoading(false);
        } else {
          console.error("Network response was not ok");
        }
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
          post: document.getElementById("postni").value,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && response.statusText === "OK") {
          console.log(response.data);
          setIsLoading(false);
          setLoader(Math.random() * 1000);
          document.getElementById("postni").value = "";
        } else {
          console.error("Network response was not ok");
        }
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
          reply: document.getElementById("replyni-" + postid).value,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && response.statusText === "OK") {
          console.log(response.data);
          setIsLoading(false);
          setLoader(Math.random() * 1000);
          document.getElementById("replyni-" + postid).value = "";
        } else {
          console.error("Network response was not ok");
        }
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
        if (response.status === 200 && response.statusText === "OK") {
          console.log(response.data);
          setIsLoading(false);
          setLoader(Math.random() * 1000);
        } else {
          console.error("Network response was not ok");
        }
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
        if (response.status === 200 && response.statusText === "OK") {
          console.log(response.data);
          setIsLoading(false);
          setLoader(Math.random() * 1000);
        } else {
          console.error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  return (
    <div className="Posts">
      {user !== null ? (
        <>
          <textarea id="postni" /> <br />
          <Button
            variant="contained"
            onClick={() => {
              postPost();
            }}
          >
            Post a Post
          </Button>
          <br />
        </>
      ) : (
        <>
          <Box
            component="div"
            sx={{
              width: "80%",
              margin: "0 auto",
              p: 2,
              border: "1px dashed grey",
            }}
          >
            <input type="text" id="username" />
            <input type="password" id="password" />
            <Button
              variant="contained"
              onClick={() => {
                loginUser();
              }}
            >
              Login User
            </Button>

            <hr />
            <input type="text" id="nusername" />
            <input type="password" id="npassword" />
            <Button
              variant="contained"
              onClick={() => {
                createNewUser();
              }}
            >
              Create New User
            </Button>
          </Box>
        </>
      )}
      <Button
        onClick={() => {
          setPage(page > 1 ? page - 1 : 1);
        }}
      >
        Prev Page
      </Button>{" "}
      |
      <Button
        onClick={() => {
          setPage(page + 1);
        }}
      >
        Next Page
      </Button>
      {posts.map((post, id) => {
        return (
          <Paper
            key={id}
            elevation={3}
            style={{
              textAlign: "right",
              padding: "10px",
              width: "80%",
              margin: "10px auto",
            }}
          >
            {user !== null && user.id === post.uid ? (
              <>
                <Button
                  onClick={() => {
                    deletePost(post.id);
                  }}
                  variant="contained"
                  color="error"
                  style={{ fontSize: "7px" }}
                >
                  X
                </Button>
              </>
            ) : (
              <></>
            )}
            <h3>{post.post}</h3>
            <h5 style={{ fontStyle: "italic" }}>{post.user}</h5>
            <Accordion>
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Replies</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ background: "#eee" }}>
                {user !== null ? (
                  <>
                    <textarea id={"replyni-" + post.id} />
                    <Button
                      variant="contained"
                      onClick={() => {
                        replyPost(post.id);
                      }}
                    >
                      Reply
                    </Button>
                    <br />
                  </>
                ) : (
                  <></>
                )}
                {post.reply ? (
                  <>
                    {post.reply.map((reply, id) => {
                      return (
                        <Paper
                          key={id}
                          style={{ margin: "5px", padding: "10px" }}
                          elevation={1}
                        >
                          {user !== null && user.id === reply.uid ? (
                            <>
                              <Button
                                onClick={() => {
                                  deleteReply(reply.id);
                                }}
                                variant="contained"
                                color="error"
                                style={{ fontSize: "7px" }}
                              >
                                X
                              </Button>
                            </>
                          ) : (
                            <></>
                          )}
                          <h3>{reply.reply}</h3>
                          <h6 style={{ fontStyle: "italic" }}>{reply.user}</h6>
                        </Paper>
                      );
                    })}
                  </>
                ) : (
                  <>No Replies Yet</>
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        );
      })}
    </div>
  );
}

export default Posts;
