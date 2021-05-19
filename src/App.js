import React, { useEffect, useState } from "react";
import "./App.css";
import TelegramLoginButton from "telegram-login-button";
import { TwitterFollowButton, TwitterShareButton } from "react-twitter-embed";
import axios from "axios";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

function App() {
  const [telegramID, setTelegramID] = useState("");
  const [loadingTelegram, setLoadingTelegram] = useState(false);
  const [telegramName, setTelegramName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [walletAddressChecked, setWalletAddressChecked] = useState("");
  const [emailAddressChecked, setEmailAddressChecked] = useState("");
  const [token, setToken] = useState("");
  const [walletError, setWalletError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [tweetClicked, setTweetClicked] = useState(false);
  const [followClicked, setFollowClicked] = useState(false);
  const [saved, setSaved] = useState(false)

  const getUserData = async (x) => {
    const config = {
      headers: {
        Authorization: x,
      },
    };
    try {
      const res = await axios.get("https://cardenceformbackend.herokuapp.com/users/information", config);
      const {
        TelegramID,
        name,
        familyName,
        email,
        walletAdress,
        tweet,
        follow,
        saved,
      } = res.data;
      setTelegramName(name);
      setFamilyName(familyName);
      setTelegramID(TelegramID);
      setWalletAddressChecked(walletAdress);
      setEmailAddressChecked(email);
      setTweetClicked(tweet);
      setFollowClicked(follow);
      setSaved(saved)
    } catch (error) {
    }

    setLoadingTelegram(false);
  };

  useEffect(() => {
    setLoadingTelegram(true);
    const readToken = localStorage.getItem("token");
    if (readToken) {
      getUserData(readToken);
    }else{
      setLoadingTelegram(false)
    }
  }, [token]);

  const handleTelegramResponse = async (response) => {
    try {
      const payload = {
        telegramID: response.id,
        telegramName: response.first_name,
        familyName: response.last_name,
        telegramAuthDate: response.auth_date,
      };
      const res = await axios.post("https://cardenceformbackend.herokuapp.com/users/telegramCred", payload);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (error) {
    }
  };

  const saveData = async () => {
    if (!walletError && !emailError && telegramID && tweetClicked && followClicked ) {
      const data = { emailAddress, walletAddress, telegramID, tweetClicked, followClicked };
      try {
        const res = await axios.post("https://cardenceformbackend.herokuapp.com/users/saveData", data);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      } catch (error) {
      }
    }
  };

  const verifyWalletAdress = () => {
    if (walletAddress.length === 42) {
      setWalletError(false);
    } else {
      setWalletError(true);
    }
  };

  const verifyEmailAdress = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(emailAddress).toLowerCase())) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  return (
    <div className="home_container">
      <div className="home_top">
        <div className="home_title">
          <h1>
            {" "}
            <span> Welcome to cardence. </span> <br /> Fill in the following
            details to participate in Token airdrop.
          </h1>
        </div>
      </div>
      <div>
        <div className="home_box">
          <div className={telegramID ? "tick success" : "tick"}>
            {" "}
            <CheckCircleOutlineIcon style={{fontSize: '3vmin'}} />{" "}
          </div>
          <h6>Connect your Telegram:</h6>
          <div className="telegram_container">
            {loadingTelegram ? (
              <h5>please wait ..</h5>
            ) : telegramID ? (
              <h5>{"Connected to: " + telegramName + " " + familyName}</h5>
            ) : (
              <TelegramLoginButton
                buttonSize="small"
                botName="cardencebot"
                dataOnauth={(user) => handleTelegramResponse(user)}
                className="telegram_btn"
              />
            )}
          </div>
        </div>
        <div className="home_box">
          <div
            className={ walletAddressChecked || walletAddress.length === 42 ? "tick success" : "tick"}
          >
            {" "}
            <CheckCircleOutlineIcon style={{fontSize: '3vmin'}} />{" "}
          </div>
          <h6>
            Verify Wallet:{" "}
            <span className={walletError ? "errorMSG" : "none"}>
              please submit a valid wallet address
            </span>
          </h6>
          {walletAddressChecked ? (
            <h5>{"Your wallet: " + walletAddressChecked}</h5>
          ) : (
            <div>
              <input
                className={walletError ? "error" : "input"}
                type="text"
                placeholder="Enter your wallet address"
                onChange={(e) => setWalletAddress(e.target.value)}
                onBlur={() => verifyWalletAdress()}
              />
            </div>
          )}
        </div>
        <div className="home_box">
          <div
            className={ emailAddressChecked ||(!emailError && emailAddress) ? "tick success" : "tick"}
          >
            {" "}
            <CheckCircleOutlineIcon style={{fontSize: '3vmin'}} />{" "}
          </div>
          <h6>
            Connect Email:{" "}
            <span className={emailError ? "errorMSG" : "none"}>
              please submit a valid email address
            </span>
          </h6>
          {emailAddressChecked ? (
            <h5>{"Your email: " + emailAddressChecked}</h5>
          ) : (
            <div>
              <input
                className={emailError ? "error" : "input"}
                type="text"
                placeholder="Enter your email address"
                onChange={(e) => setEmailAddress(e.target.value)}
                onBlur={() => verifyEmailAdress()}
              />
            </div>
          )}
        </div>
        <div className="home_box">
          <div
            className={followClicked && tweetClicked ? "tick success" : "tick"}
          >
            {" "}
            <CheckCircleOutlineIcon style={{fontSize: '3vmin'}} />{" "}
          </div>
          <h6>Follow us on twitter and retweet:</h6>
          <div>
            <TwitterFollowButton
              onLoad={() => {
                window.twttr.ready(function (twttr) {
                  twttr.events.bind("follow", function (ev) {
                    setFollowClicked(true);
                  });
                });
              }}
              screenName={"cardence_io"}
              data-size="large"
            />
            <TwitterShareButton
              onLoad={() => {
                window.twttr.ready(function (twttr) {
                  twttr.events.bind("tweet", function (ev) {
                    setTweetClicked(true);
                  });
                });
              }}
              url={"cardence.io"}
              options={{ text: "check out " }}
            />
          </div>
        </div>
        <div className="save_Btn">
          <button
            disabled={emailError || walletError || !telegramID || saved || !tweetClicked || !followClicked }
            onClick={() => saveData()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
