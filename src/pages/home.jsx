import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ViewPost from "../components/ViewPost";
function Home() {
  const location = useLocation();
  const user = location.state.user || null;
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
        console.log(posts);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [page, loader]);

  function postPost() {
    setIsLoading(true);
    const postContent = document.getElementById("poster").value;

    if (postContent.trim() === "") {
      console.log("empty post");
      return;
    }
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

  function logout() {
    navigate("/");
  }

  return (
    <>
      <div className="home-page">
        <div className="posting">
          <div className="user-deets">
            <AccountCircleIcon style={{ fontSize: "20px" }} />
            <span style={{ marginTop: "1px", paddingLeft: "5px" }}>
              #{user.id}: {user.username}
            </span>
          </div>
          <textarea id="poster" placeholder="What's on your mind?" /> <br />
          <Button id="post-button" onClick={postPost}>
            Post
          </Button>
          <br />
          <Button id="log1-button" variant="contained" onClick={logout}>
            Logout
          </Button>
        </div>
        <div className="right-side">
          <ViewPost
            user={user}
            page={page}
            loader={loader}
            setLoader={setLoader}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          ></ViewPost>

          <div className="page-navigation">
            <Button
              id="page"
              variant="contained"
              onClick={() => {
                setPage(page > 1 ? page - 1 : 1);
              }}
            >
              Prev Page
            </Button>
            <Button
              id="page1"
              variant="contained"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Next Page
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
