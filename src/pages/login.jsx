import { useState } from "react";
import { Button } from "@mui/material";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showCreateUser, setShowCreateUser] = useState(false);

  const toggleHelloWorld = () => {
    setShowCreateUser(!showCreateUser);
  };

  const createNewUser = () => {
    const username = document.getElementById("nusername").value;
    const password = document.getElementById("npassword").value;

    if (!username || !password) {
      window.alert("Please enter both username and password.");
      return;
    }

    axios
      .post(
        `http://hyeumine.com/forumCreateUser.php`,
        {
          username,
          password,
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

        window.alert("User successfully created!");
        setShowCreateUser(!showCreateUser);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const loginUser = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      window.alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post(
        `http://hyeumine.com/forumLogin.php`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        console.log(user);
        navigate("home", { state: { user: userData } });
      } else {
        window.alert("User not found!");
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const clearInputFields = () => {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const nUsernameInput = document.getElementById("nusername");
    const nPasswordInput = document.getElementById("npassword");

    if (usernameInput) {
      usernameInput.value = "";
    }
    if (passwordInput) {
      passwordInput.value = "";
    }
    if (nUsernameInput) {
      nUsernameInput.value = "";
    }
    if (nPasswordInput) {
      nPasswordInput.value = "";
    }
    if (usernameInput && passwordInput) {
      usernameInput.value = "";
      passwordInput.value = "";
    }
    if (nUsernameInput && nPasswordInput) {
      nUsernameInput.value = "";
      nPasswordInput.value = "";
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="title">
          <div>
            <h1
              className="bubble left"
              style={{
                fontSize: "100px",
                padding: "70px",
                textAlign: "center",
                color: "#fd638f",
              }}
            >
              FORUM
            </h1>
            <h1 className="bubble right"></h1>
          </div>
        </div>
        <div className="login-card-container">
          <div className="login-card">
            {showCreateUser ? (
              <>
                <div className="header-text">Create Account</div>
                <input
                  type="text"
                  id="nusername"
                  placeholder="Username"
                  autoComplete="off"
                />
                <input
                  type="password"
                  id="npassword"
                  placeholder="Password"
                  autoComplete="off"
                />
                <Button
                  id="log-button"
                  variant="contained"
                  onClick={createNewUser}
                >
                  Register
                </Button>
                <div className="for-flip">
                  Already have an account?{" "}
                  <span
                    className="clickable-text"
                    onClick={() => {
                      toggleHelloWorld();
                      clearInputFields();
                    }}
                  >
                    Login.
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="header-text">Welcome Back!</div>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  autoComplete="off"
                />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  autoComplete="off"
                />
                <Button id="log-button" variant="contained" onClick={loginUser}>
                  Login
                </Button>
                <div className="for-flip">
                  No account yet?{" "}
                  <span
                    className="clickable-text"
                    onClick={() => {
                      toggleHelloWorld();
                      clearInputFields();
                    }}
                  >
                    Get started.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
