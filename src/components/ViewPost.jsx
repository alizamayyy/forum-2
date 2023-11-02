/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ViewPost.css";
import Replies from "./Replies";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ViewPost = ({
  user,
  page,
  loader,
  setLoader,
  isLoading,
  setIsLoading,
}) => {
  const [posts, setPosts] = useState([]);
  const postsDisplayRef = useRef(null);

  const fetchPosts = () => {
    setIsLoading(true);
    axios
      .get(`http://hyeumine.com/forumGetPosts.php?page=${page}`)
      .then((response) => {
        if (!(response.status === 200 && response.statusText === "OK")) {
          throw new Error("Network response was not ok");
        }
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [page, loader]);

  function replyPost(postid) {
    setIsLoading(true);
    const replyContent = document.getElementById("reply-" + postid).value;

    if (replyContent.trim() === "") {
      console.log("empty reply");
      return;
    }
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
        setIsLoading(false);
        setLoader(Math.random() * 1000);
        document.getElementById("reply-" + postid).value = "";
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
        setIsLoading(false);
        setLoader(Math.random() * 1000);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  const scrollToTopAndRefresh = () => {
    // Scroll to the top
    if (postsDisplayRef.current) {
      postsDisplayRef.current.scrollTop = 0;
    }

    // Fetch posts to refresh
    fetchPosts();
  };

  return (
    <>
      <div className="posts-display" ref={postsDisplayRef}>
        {posts.map((post, id) => {
          return (
            <div className="user-post" key={id}>
              {user !== null && user.id === post.uid ? (
                <CloseIcon
                  onClick={() => {
                    deletePost(post.id);
                  }}
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    margin: "20px",
                    borderRadius: "20px",
                    fontSize: "25px",
                    padding: "5px",
                  }}
                ></CloseIcon>
              ) : (
                <></>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "fit-content",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    paddingLeft: "10px",
                    color: "#030303",
                    fontSize: "20px",
                    fontWeight: "700",
                    lineHeight: "23px",
                    display: "flex",
                    alignItems: "flex-end",
                    maxWidth: "200px",
                    overflowWrap: "break-word",
                  }}
                >
                  <AccountCircleIcon
                    style={{ paddingRight: "5px", fontSize: "42px" }}
                  ></AccountCircleIcon>
                  <div>
                    <div style={{ fontSize: "17px" }}>{post.user}</div>
                    <div style={{ fontSize: "12px" }}>{post.date}</div>
                  </div>
                </div>
                <div>
                  <h3 className="bubble left">{post.post}</h3>
                </div>
              </div>

              <div className="reply-bottom-container">
                {user !== null ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <textarea
                      className="text-field"
                      id={"reply-" + post.id}
                      placeholder="Write a reply..."
                    />
                    <Button
                      id="myButton"
                      variant="contained"
                      onClick={() => replyPost(post.id)}
                    >
                      Reply
                    </Button>
                    <br />
                  </div>
                ) : (
                  <></>
                )}
                <Accordion
                  sx={{
                    backgroundColor: "transparent", // Make the background transparent
                    border: "none", // Remove the border
                    boxShadow: "none",
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary>
                    <Button id="myButton1" variant="contained">
                      View Replies
                    </Button>
                  </AccordionSummary>
                  <AccordionDetails>
                    {post.reply ? (
                      <Replies
                        post={post}
                        user={user}
                        loader={loader}
                        setLoader={setLoader}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      ></Replies>
                    ) : (
                      <div
                        style={{
                          float: "right",
                          marginRight: "10px",
                          fontWeight: "700",
                          fontSize: "20px",
                          marginBottom: "10px",
                        }}
                      >
                        No Replies Yet
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          );
        })}
        <div className="to-top">
          <Button
            id="page2"
            variant="contained"
            onClick={scrollToTopAndRefresh}
            startIcon={<ArrowUpwardIcon />}
          />
        </div>
      </div>
    </>
  );
};

export default ViewPost;
