import React from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';
import { splitCamelCase } from '~extension/chatgpt/goto/util';
import { InstantLinkIcon } from '~extension/instant-open/icon';

function normalizeLink(link: string): string {
  let normalizedLink = link.trim();
  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    link = `https://www.google.com/search?q=${encodeURIComponent(link)}`;
    return link;
  }
  const url = new URL(link);
  normalizedLink = url.href;
  return normalizedLink;
}

const InstantOpen = ({ search }: { search: string }) => {
  return (
    <MotionPack title="Chrome Store">
      <Motion.Navigator
        icon={<InstantLinkIcon />}
        keywords={['open', search]}
        url={normalizeLink(search) as any}
        title={'instant open ' + splitCamelCase(search as string)}
      />
    </MotionPack>
  );
};
export default InstantOpen;
