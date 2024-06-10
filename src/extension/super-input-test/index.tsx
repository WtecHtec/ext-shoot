import React from 'react';

const SuperInputTest = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };
  return (
    <div>
      <h1 onClick={handleClick}>Hello, world!</h1>
      <p>This is a paragraph.</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export { SuperInputTest };
