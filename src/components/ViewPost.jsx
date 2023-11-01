import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewPost.css";
import Replies from './Replies';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ViewPost = ({ user, page, loader, setLoader, isLoading, setIsLoading }) => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log("USER IS: ", user.id);
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

    return (
        <div className="posts-display">
            {posts.map((post, id) => {
                return (
                    <div
                        className="user-post"
                        key={id}
                    >
                        {user !== null && user.id === post.uid ? (

                            <CloseIcon onClick={() => {
                                deletePost(post.id);
                            }}
                                style={{
                                    color: "white",
                                    backgroundColor: "#FF7096",
                                    position: "absolute",
                                    right: "0",
                                    margin: "20px",
                                    borderRadius: "20px",
                                    fontSize: "25px",
                                    padding: "5px"
                                }}>
                            </CloseIcon>
                        ) : (
                            <></>
                        )}
                        <div style={{
                            paddingLeft: "25px",
                            color: "#030303",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: "700",
                            lineHeight: "normal",
                        }} >{post.user}</div>
                        <h3 className="bubble left">{post.post}</h3>
                        <div className='reply-bottom-container'>
                            {user !== null ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}>
                                    <textarea className="text-field" id={"reply-" + post.id} />
                                    <Button id="myButton" variant="contained" onClick={() => replyPost(post.id)}>
                                        Reply
                                    </Button>
                                    <br />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Accordion
                                sx={{
                                    backgroundColor: 'transparent', // Make the background transparent
                                    border: 'none', // Remove the border
                                    boxShadow: 'none',
                                    '&:before': {
                                        display: 'none',
                                    }
                                }}
                            >
                                <AccordionSummary>
                                    <Button id="myButton1" variant="contained" >
                                        Replies
                                    </Button>
                                </AccordionSummary>
                                <AccordionDetails
                                >
                                    {post.reply ? (
                                        <Replies post={post} user={user} loader={loader} setLoader={setLoader} isLoading={isLoading} setIsLoading={setIsLoading} ></Replies>
                                    ) : (
                                        <>No Replies Yet</>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default ViewPost