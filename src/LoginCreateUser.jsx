// LoginCreateUser.js
import { useState } from "react";
import axios from "axios";
import { Box, Button } from "@mui/material";

function LoginCreateUser() {
  const [isLoading, setIsLoading] = useState(false);

  function createNewUser() {
    setIsLoading(true);
    axios
      .post(
        "http://hyeumine.com/forumCreateUser.php",
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
        if (response.status === 200 && response.statusText === "OK") {
          // User creation success logic
          console.log("User created:", response.data);
        } else {
          console.error("Network response was not ok");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsLoading(false);
      });
  }

  function loginUser() {
    setIsLoading(true);
    axios
      .post(
        "http://hyeumine.com/forumLogin.php",
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
        if (response.status === 200 && response.statusText === "OK") {
          // Login success logic
          console.log("User logged in:", response.data.user);
        } else {
          console.error("Network response was not ok");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsLoading(false);
      });
  }

  return (
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
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login User"}
      </Button>

      <hr />

      <input type="text" id="nusername" />
      <input type="password" id="npassword" />
      <Button
        variant="contained"
        onClick={() => {
          createNewUser();
        }}
        disabled={isLoading}
      >
        {isLoading ? "Creating User..." : "Create New User"}
      </Button>
    </Box>
  );
}

export default LoginCreateUser;
