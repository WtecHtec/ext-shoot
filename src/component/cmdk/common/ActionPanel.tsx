import { Command } from 'cmdk';
import React, { useEffect } from 'react';
import { actionManager } from '../action';

interface ActionPanelProps {
    head?: string;
    children?: React.ReactNode;
}

const ActionPanel = ({ children, head }: ActionPanelProps) => {
    const registeActionTitle = () => {
        // console.log('title', head);
        actionManager.updateTitle(head);
    };

    useEffect(() => {
        registeActionTitle();
    }, []);

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
