import React from 'react';

import { Topic } from './topic';

interface TopicLabelProps {
  topic: Topic;
}

const TopicLabel: React.FC<TopicLabelProps> = ({ topic }) => {
  return (
    <div
      className="py-[4px] px-3 min-w-16 rounded-full ml-4 text-[14px] text-center"
      style={{ backgroundColor: topic.appearance.backgroundColor, color: topic.appearance.textColor ?? '#fff' }}>
      #{topic.name}
    </div>
  );
};

export default TopicLabel;
