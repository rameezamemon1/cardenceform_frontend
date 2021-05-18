import React from "react";
import TelegramLoginButton from "telegram-login-button";

const handleTelegramResponse = (response) => {
  console.log(response);
};

function Home() {

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
        <div className="telegram_container">
          <TelegramLoginButton
            buttonSize="large"
            botName="cardencebot"
            dataOnauth={(user) => handleTelegramResponse(user)}
            className="telegram_btn"
          />
        </div>
      </div>
      <div>
        <div className="home_box">
          <h6>Connect to Telegram</h6>
          <h5>{"Connected to: " + ""}</h5>
        </div>
        <div className="home_box">
          <h6>Verify Wallet</h6>
          <h5>{"Your wallet: " + "qzservhdtjybngbd'-ièntgyè,i__ègnfbv''cv"}</h5>
        </div>
        <div className="home_box">
          <h6>Connect Email</h6>
          <h5>{"Your email: " + "makki@gmail.com"}</h5>
        </div>
      </div>
    </div>
  );
}

export default Home;
