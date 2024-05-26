import { Command } from "motion-cmdk";
import React from "react";

import { NotFoundIcon } from "~component/icons";

const BaseNotFound = ({ child }: { child: React.ReactNode }) => {
  return <Command.Empty> {child}</Command.Empty>;
};

const TextNotFound = ({ text = "No results found" }: { text?: string }) => {
  return <BaseNotFound child={<span className="">{text}</span>} />;
};

const NotFoundWithIcon = ({
  icon,
  text = "No results found"
}: {
  icon?: React.ReactNode
  text?: string
}) => {
  if (icon === undefined) {
    icon = <NotFoundIcon className="w-16" />;
  }
  return (
    <BaseNotFound
      child={
        <>
          {icon}
          <span>{text}</span>
        </>
      }
    />
  );
};

const NotFound = {
  BaseNotFound,
  TextNotFound,
  NotFoundWithIcon
};

export default NotFound;
