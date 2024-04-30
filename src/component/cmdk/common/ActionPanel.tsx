import { Command } from 'cmdk';
import React from 'react';

interface ActionPanelProps {
    children?: React.ReactNode;
}

const ActionPanel = ({ children }: ActionPanelProps) => {
    return (
        <div className='pt-2'>
            {children}
        </div>
    );
};


interface SectionProps {
    title?: string;
    children?: React.ReactNode;
}
const Section = ({ title, children }: SectionProps) => {
    return (
        <Command.Group heading={title}>
            {children}
        </Command.Group>
    );
};


ActionPanel.Section = Section;

export { ActionPanel };
