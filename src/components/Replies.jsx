/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import "./Replies.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const Replies = ({
  post,
  user,
  loader,
  setLoader,
  isLoading,
  setIsLoading,
}) => {
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
    <>
      <div className="reply-div">
        {post.reply.map((reply, id) => {
          return (
            <div key={id}>
              {user !== null && user.id === reply.uid ? (
                <>
                  <CloseIcon
                    onClick={() => {
                      deleteReply(reply.id);
                    }}
                    style={{
                      color: "white",
                      backgroundColor: "red",
                      position: "absolute",
                      marginTop: "-30px",
                      borderRadius: "20px",
                      fontSize: "15px",
                      padding: "5px",
                    }}
                  >
                    X
                  </CloseIcon>
                </>
              ) : (
                <></>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "fit-content",
                  marginTop: "-30px",
                  marginBottom: "40px",
                  float: "right",
                }}
              >
                <div>
                  <h3 className="bubble right">{reply.reply}</h3>
                </div>
                <div
                  style={{
                    marginRight: "-20px",
                    width: "200px",
                    paddingLeft: "30px",
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
                  />
                  <div>
                    <div style={{ fontSize: "17px" }}>{reply.user}</div>
                    <div style={{ fontSize: "12px" }}>{reply.date}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Replies;
