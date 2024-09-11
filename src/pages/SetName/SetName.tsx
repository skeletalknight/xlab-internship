import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './SetName.css';


const Welcome = ()=> {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const handleSend = async () => {
    if (inputValue.trim()) {
      const userName = inputValue.trim();
      navigate("/room", { state: userName });
    }
  };

  return (
    <div className="welcome-container">
      <div className="overlay">
          <h1 className="welcome-title">登陆聊天室</h1>
          <div className="form-group">
            <label className="username">用户名</label><br />
            <input type="text"
            className="form-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} />
          </div>
          <button type="submit" className="submit-button" onClick={()=>handleSend()}>提交</button>
      </div>
    </div>
  );
};

export default Welcome;
