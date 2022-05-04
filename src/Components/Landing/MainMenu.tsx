import React from 'react';

function MainMenu({switchAdd, Account, changeAccount}:{switchAdd: any, Account: string[], changeAccount: any}) {

  const HandleAddClick = () => {
    if (Account[1] === 'guest') changeAccount();
    else switchAdd();
  }

  return (
      <div className="Landing-content">
        <div className="Landing-title">Recipes Site</div>
        <p onClick={HandleAddClick} className="Landing-btn-layout Landing-btn">Add Recipe</p>
        <a href="#Main" className="Landing-start-btn-layout Landing-btn">Let's Cook!<br />⇩</a>
      </div>
  );
}

export default MainMenu;