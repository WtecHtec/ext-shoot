import { Command } from 'motion-cmdk';
import React from 'react';

import { ExtensionIcon } from '~component/icons';

const fakeData = [
  {
    id: '1',
    iconURL:
      'https://lh3.googleusercontent.com/rLhEeo6TgST5H4WmCNWKO4fDJDvZVGfoXJNt035pGtnamBRJenmcXhqiI3RvZbRM71LWlQkTL6B825XzbAwAx52c9Q',
    title: 'Monica - Your AI Copilot powered by ChatGPT4',
    rating: '4.902817425840884',
    reviewCount: '16114',
    coverURL:
      'https://lh3.googleusercontent.com/qlN70mLwKZnfWS8U51LGosEj1fOaF3gt_q5PDfN2HalyTpO2Dxh997y4CoZWE1N7oW3ISP9Y0ZxyUlrrTxJmHLaFbQ',
    description:
      'Your AI Copilot powered by GPT-4. Answers complex questions. Writes emails reads articles searches smartly. Usable everywhere.',
    publish: 'monica.im',
    ifEstablish: 'true',
    ifFeatured: 'true',
    category: 'productivity/tools',
    categoryNo: '5',
    userCount: '2000000'
  },
  {
    id: '2',
    iconURL:
      'https://lh3.googleusercontent.com/HdWI7e2ftmvKA6tmnW7Cyhlq3pkA_hrjWih2I7kBAWbbEIhoVTYsn-hAO1AJNFvVY2wH0KOZb4ZVLUv8PtmDtXV-wQ',
    title: 'Monica Search - New Tab for AI Search',
    rating: '3.857142857142857',
    reviewCount: '21',
    coverURL:
      'https://lh3.googleusercontent.com/MtbY2KnnR_3RJi6y5-VHVST_ht4B9GnQQpWbvVdWEdIVFCcOyMj1ba8XMiJ9YNI6Yy_vOFTs9abNtCk2BnZ_5pOJp-o',
    description: 'Experience the free unlimited search capabilities of ChatGPT!',
    publish: 'monica.im',
    ifEstablish: 'true',
    ifFeatured: 'null',
    category: 'productivity/workflow',
    categoryNo: '4',
    userCount: '10000'
  },
  {
    id: '3',
    iconURL:
      'https://lh3.googleusercontent.com/_WjLv3duUHKMcxhNLvh8F8foITtjesi4Z0YvZIb0C1HXzgz83oTqs-qMi_Fzz0vl5AkElbjjYPuztLnQEyvL-_cXsA',
    title: 'Jarvis AI: Chat GPT Bing Claude Bard Grok',
    rating: '4.932038834951456',
    reviewCount: '412',
    coverURL:
      'https://lh3.googleusercontent.com/M6xkr64CgaD0MriN4DF8VN3ngKCt_Vygqaj4jC2ffDmnKRC-M_z2D97mldC-4UAepPKGLQvIgqih61JC3GH6I3HD',
    description:
      'Jarvis AI Copilot Chatbot by ChatGPT quillbot Grok Jasper Xai to write email better grammar checker \\u0026 spelling mail enhancer',
    publish: 'jarvis.cx',
    ifEstablish: 'true',
    ifFeatured: 'true',
    category: 'productivity/tools',
    categoryNo: '5',
    userCount: '7000'
  },
  {
    id: '4',
    iconURL:
      'https://lh3.googleusercontent.com/ryEkCSc1OmhpVzBwIDKFuQUPBRSu1y-OlMovs6BJr20a6U9CBKmtK0oU8yfhxmbdOqDz8iqhkj6Pm2oxLEStRW9HW6s',
    title: 'ChatGPT for Amazon with GPT4 Shulex Copilot',
    rating: '4.582608695652174',
    reviewCount: '115',
    coverURL:
      'https://lh3.googleusercontent.com/EfA7pcjTchKeBkQ62SPDPHWH_DEwHNF0kxpKZuyMLYpMfl2jb3G0om_5JqQvMvWTMARQ9pQ2pssD4VdCIiFNeA3-IA',
    description:
      'Copilot but for ecommerce \\u0026 sellers. Browser sidebar Review Analysis AI assistant can deal with anything you need.',
    publish: 'voc.ai',
    ifEstablish: 'true',
    ifFeatured: 'true',
    category: 'productivity/workflow',
    categoryNo: '4',
    userCount: '70000'
  },
  {
    id: '5',
    iconURL:
      'https://lh3.googleusercontent.com/YNALi40TB8BCcAV0XrtYMrBzN2TF_DNpxPMkDEupcEUaAX_W83bybwjXDq30D1728YNBOtvNH-K_j888DeQ9kvVUdA',
    title: 'Santa Monica Ferris Wheel - Full HD - Axlg',
    rating: '4.316831683168317',
    reviewCount: '202',
    coverURL:
      'https://lh3.googleusercontent.com/o-7UCl4i_Nr-n_j2eb0saeTYntRG_6rKrGuup6o6fCuZ2te3RIFbh9cCT6qtIOjCMtIz0z6jUSWbKITpvSLy_uZYLCY',
    description: 'Santa Monica Ferris Wheel - Full HD - Axlg',
    publish: 'axl-g.com',
    ifEstablish: 'true',
    ifFeatured: 'null',
    categoryNo: '2',
    userCount: '393'
  },
  {
    id: '6',
    iconURL:
      'https://lh3.googleusercontent.com/HdWI7e2ftmvKA6tmnW7Cyhlq3pkA_hrjWih2I7kBAWbbEIhoVTYsn-hAO1AJNFvVY2wH0KOZb4ZVLUv8PtmDtXV-wQ',
    title: 'Monica Search - New Tab for AI Search',
    rating: '3.857142857142857',
    reviewCount: '21',
    coverURL:
      'https://lh3.googleusercontent.com/MtbY2KnnR_3RJi6y5-VHVST_ht4B9GnQQpWbvVdWEdIVFCcOyMj1ba8XMiJ9YNI6Yy_vOFTs9abNtCk2BnZ_5pOJp-o',
    description: 'Experience the free unlimited search capabilities of ChatGPT!',
    publish: 'monica.im',
    ifEstablish: 'true',
    ifFeatured: 'null',
    category: 'productivity/workflow',
    categoryNo: '4',
    userCount: '10000'
  },
  {
    id: '7',
    iconURL:
      'https://lh3.googleusercontent.com/_WjLv3duUHKMcxhNLvh8F8foITtjesi4Z0YvZIb0C1HXzgz83oTqs-qMi_Fzz0vl5AkElbjjYPuztLnQEyvL-_cXsA',
    title: 'Jarvis AI: Chat GPT Bing Claude Bard Grok',
    rating: '4.932038834951456',
    reviewCount: '412',
    coverURL:
      'https://lh3.googleusercontent.com/M6xkr64CgaD0MriN4DF8VN3ngKCt_Vygqaj4jC2ffDmnKRC-M_z2D97mldC-4UAepPKGLQvIgqih61JC3GH6I3HD',
    description:
      'Jarvis AI Copilot Chatbot by ChatGPT quillbot Grok Jasper Xai to write email better grammar checker \\u0026 spelling mail enhancer',
    publish: 'jarvis.cx',
    ifEstablish: 'true',
    ifFeatured: 'true',
    category: 'productivity/tools',
    categoryNo: '5',
    userCount: '7000'
  },
  {
    id: '8',
    iconURL:
      'https://lh3.googleusercontent.com/ryEkCSc1OmhpVzBwIDKFuQUPBRSu1y-OlMovs6BJr20a6U9CBKmtK0oU8yfhxmbdOqDz8iqhkj6Pm2oxLEStRW9HW6s',
    title: 'ChatGPT for Amazon with GPT4 Shulex Copilot',
    rating: '4.582608695652174',
    reviewCount: '115',
    coverURL:
      'https://lh3.googleusercontent.com/EfA7pcjTchKeBkQ62SPDPHWH_DEwHNF0kxpKZuyMLYpMfl2jb3G0om_5JqQvMvWTMARQ9pQ2pssD4VdCIiFNeA3-IA',
    description:
      'Copilot but for ecommerce \\u0026 sellers. Browser sidebar Review Analysis AI assistant can deal with anything you need.',
    publish: 'voc.ai',
    ifEstablish: 'true',
    ifFeatured: 'true',
    category: 'productivity/workflow',
    categoryNo: '4',
    userCount: '70000'
  },
  {
    id: 'jkacmgdgemhedpcoiihkin7fppnmapogi',
    iconURL:
      'https://lh3.googleusercontent.com/YNALi40TB8BCcAV0XrtYMrBzN2TF_DNpxPMkDEupcEUaAX_W83bybwjXDq30D1728YNBOtvNH-K_j888DeQ9kvVUdA',
    title: 'Santa Monica Ferris Wheel - Full HD - Axlg',
    rating: '4.316831683168317',
    reviewCount: '202',
    coverURL:
      'https://lh3.googleusercontent.com/o-7UCl4i_Nr-n_j2eb0saeTYntRG_6rKrGuup6o6fCuZ2te3RIFbh9cCT6qtIOjCMtIz0z6jUSWbKITpvSLy_uZYLCY',
    description: 'Santa Monica Ferris Wheel - Full HD - Axlg',
    publish: 'axl-g.com',
    ifEstablish: 'true',
    ifFeatured: 'null',
    categoryNo: '2',
    userCount: '393'
  },
  {
    id: 'pmbmfhhbllfiifceolpogjoago0iollkc',
    iconURL:
      'https://lh3.googleusercontent.com/HdWI7e2ftmvKA6tmnW7Cyhlq3pkA_hrjWih2I7kBAWbbEIhoVTYsn-hAO1AJNFvVY2wH0KOZb4ZVLUv8PtmDtXV-wQ',
    title: 'Monica Search - New Tab for AI Search',
    rating: '3.857142857142857',
    reviewCount: '21',
    coverURL:
      'https://lh3.googleusercontent.com/MtbY2KnnR_3RJi6y5-VHVST_ht4B9GnQQpWbvVdWEdIVFCcOyMj1ba8XMiJ9YNI6Yy_vOFTs9abNtCk2BnZ_5pOJp-o',
    description: 'Experience the free unlimited search capabilities of ChatGPT!',
    publish: 'monica.im',
    ifEstablish: 'true',
    ifFeatured: 'null',
    category: 'productivity/workflow',
    categoryNo: '4',
    userCount: '10000'
  },
  {
    id: 'kbhaffhbhcfmogkkbfanilniagcefnh3i',
    iconURL:
      'https://lh3.googleusercontent.com/_WjLv3duUHKMcxhNLvh8F8foITtjesi4Z0YvZIb0C1HXzgz83oTqs-qMi_Fzz0vl5AkElbjjYPuztLnQEyvL-_cXsA',
    title: 'Jarvis AI: Chat GPT Bing Claude Bard Grok',
    rating: '4.932038834951456',
    reviewCount: '412',
    coverURL:
      'https://lh3.googleusercontent.com/M6xkr64CgaD0MriN4DF8VN3ngKCt_Vygqaj4jC2ffDmnKRC-M_z2D97mldC-4UAepPKGLQvIgqih61JC3GH6I3HD',
    description:
      'Jarvis AI Copilot Chatbot by ChatGPT quillbot Grok Jasper Xai to write email better grammar checker \\u0026 spelling mail enhancer',
    publish: 'jarvis.cx',
    ifEstablish: 'true',
    ifFeatured: 'true',
    category: 'productivity/tools',
    categoryNo: '5',
    userCount: '7000'
  },
  {
    id: 'fchbhcjlkcdchcaklpkdofllfoimelgb1',
    iconURL:
      'https://lh3.googleusercontent.com/ryEkCSc1OmhpVzBwIDKFuQUPBRSu1y-OlMovs6BJr20a6U9CBKmtK0oU8yfhxmbdOqDz8iqhkj6Pm2oxLEStRW9HW6s',
    title: 'ChatGPT for Amazon with GPT4 Shulex Copilot',
    rating: '4.582608695652174',
    reviewCount: '115',
    coverURL:
      'https://lh3.googleusercontent.com/EfA7pcjTchKeBkQ62SPDPHWH_DEwHNF0kxpKZuyMLYpMfl2jb3G0om_5JqQvMvWTMARQ9pQ2pssD4VdCIiFNeA3-IA',
    description:
      'Copilot but for ecommerce \\u0026 sellers. Browser sidebar Review Analysis AI assistant can deal with anything you need.',
    publish: 'voc.ai',
    ifEstablish: 'true',
    ifFeatured: 'true',
    category: 'productivity/workflow',
    categoryNo: '4',
    userCount: '70000'
  },
  {
    id: 'jkacmgdgemhedpcoiihkinfppnmapogi2',
    iconURL:
      'https://lh3.googleusercontent.com/YNALi40TB8BCcAV0XrtYMrBzN2TF_DNpxPMkDEupcEUaAX_W83bybwjXDq30D1728YNBOtvNH-K_j888DeQ9kvVUdA',
    title: 'Santa Monica Ferris Wheel - Full HD - Axlg',
    rating: '4.316831683168317',
    reviewCount: '202',
    coverURL:
      'https://lh3.googleusercontent.com/o-7UCl4i_Nr-n_j2eb0saeTYntRG_6rKrGuup6o6fCuZ2te3RIFbh9cCT6qtIOjCMtIz0z6jUSWbKITpvSLy_uZYLCY',
    description: 'Santa Monica Ferris Wheel - Full HD - Axlg',
    publish: 'axl-g.com',
    ifEstablish: 'true',
    ifFeatured: 'null',
    categoryNo: '2',
    userCount: '393'
  }
];

function StoreSearch() {
  return (
    <Command.List>
      {fakeData.map((item) => (
        <Command.Item
          key={item.id}
          value={item.id}
          keywords={[item.title, item.description]}
          onSelect={() => {
            console.log('Open store:', item.title);
          }}>
          <ExtensionIcon base64={item.iconURL} />
          <div>
            <h3>{item.title}</h3>
            {/* <p>{item.description}</p> */}
          </div>
        </Command.Item>
      ))}
    </Command.List>
  );
}

const ChromeStoreSearchApp = {
  name: 'Store Search',
  App: StoreSearch
};

export { ChromeStoreSearchApp };
