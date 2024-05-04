import React from 'react';

/**
 * Props for the List component
 */
type ListProps = {
    /**
     * A reference to an ActionPanel. It will only be shown when there aren't any children.
     */
    actions: React.ReactNode,
    /**
     * List sections or items. If List.Item elements are specified, a default section is automatically created.
     */
    children: React.ReactNode,
    /**
     * Toggles MotionShot filtering. When true, MotionShot will use the query in the search bar to filter the items. When false, the extension needs to take care of the filtering.
     */
    filtering: boolean | { keepSectionOrder: boolean },
    /**
     * Indicates whether a loading bar should be shown or hidden below the search bar
     */
    isLoading: boolean,
    /**
     * Whether the List should have an area on the right side of the items to show additional details about the selected item.
     */
    isShowingDetail: boolean,
    /**
     * The main title for that view displayed in MotionShot
     */
    navigationTitle: string,
    /**
     * Configuration for pagination
     */
    pagination: { hasMore: boolean; pageSize: number; onLoadMore: (page: number) => void },
    /**
     * Placeholder text that will be shown in the search bar.
     */
    searchBarPlaceholder: string,
    /**
     * The text that will be displayed in the search bar.
     */
    searchText: string,
    /**
     * Selects the item with the specified id.
     */
    selectedItemId: string,
    /**
     * Defines whether the onSearchTextChange handler will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to true when using custom filtering logic with asynchronous operations (e.g. network requests).
     */
    throttle: boolean,
    /**
     * Callback triggered when the search bar text changes.
     */
    onSearchTextChange: (text: string) => void,
    /**
     * Callback triggered when the item selection in the list changes.
     */
    onSelectionChange: (id: string) => void
};

type OptionalListProps = Partial<ListProps>;


export default function List(props: OptionalListProps) {
    const { children } = props;
    return (
        <div>
            {
                children
            }

        </div>
    );
}
