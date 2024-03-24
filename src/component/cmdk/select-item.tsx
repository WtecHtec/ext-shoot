/* eslint-disable react/display-name */

import React from 'react';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon } from 'lucide-react';

const SelectItem =  React.forwardRef(
({ children, className, ...props }: any, forwardedRef) => {
		return (
			<Select.Item
				className={classnames('SelectItem', className)}
				{...props}
				ref={forwardedRef}>
				<Select.ItemText>{children}</Select.ItemText>
				<Select.ItemIndicator className="SelectItemIndicator">
					<CheckIcon />
				</Select.ItemIndicator>
			</Select.Item>
		);
	},
);
export default SelectItem;
