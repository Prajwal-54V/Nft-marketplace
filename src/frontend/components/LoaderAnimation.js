import React from "react";

function LoaderAnimation() {
  return (
    
    <div className="animation-container">

    <div className="loading">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>

    </div>
      <p className="loading-text">Awaiting Metamask Connection...</p>
    </div>
    
  );
}

export default LoaderAnimation;