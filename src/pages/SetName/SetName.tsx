import React from 'react';
import './SetName.css';


const Welcome = ()=> {
  return (
    <div className="welcome-container">
      <div className="overlay">
        <form className="welcome-form">
          <h1 className="welcome-title">欢迎</h1>
          <div className="form-group">
            <label htmlFor="username">用户名</label><br />
            <input type="text" id="username" name="username" className="form-input" />
          </div>
          <button type="submit" className="submit-button">提交</button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
