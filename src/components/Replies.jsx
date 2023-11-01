import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
const Replies = ({ post, user, loader, setLoader, isLoading, setIsLoading }) => {


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

    return (
        <div>
            {post.reply.map((reply, id) => {
                return (
                    <div
                        key={id}
                    >
                        {user !== null && user.id === reply.uid ? (
                            <>
                                <button
                                    onClick={() => {
                                        deleteReply(reply.id);
                                    }}
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
        </div>
    )
}

export default Replies