import React from 'react';

const TaskCard = ({ children, className = "" }) => {
  return (
    <div className={`card max-w-2xl mx-auto task-transition ${className}`}>
      {children}
    </div>
  );
};

export default TaskCard;