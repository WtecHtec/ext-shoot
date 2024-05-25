// TopicLabel.tsx
import React from 'react';
import { Topic } from './topic';

interface TopicLabelProps {
    topic: Topic;
}

const TopicLabel: React.FC<TopicLabelProps> = ({ topic }) => {
    return (
        <div
            className='px-3 py-[3px] min-w-14 rounded-xl ml-4 text-sm text-center'
            style={{ backgroundColor: topic.color, color: '#fff' }}
        >
            #{topic.name}
        </div>
    );
};

export default TopicLabel;
