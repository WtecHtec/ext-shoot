import React from 'react';
import useUpdateIcon from '~hooks/useUpdateIcon';
import "~tabs/welcome.css";
export default function WelcomeRender() {

  useUpdateIcon();

  return (
      <div
          style={ {
              display: 'flex',
              flexDirection: 'column',
              padding: 16,
          } }>
          <h2>The next-generation extension management platform for developers</h2>
          <h2>🔍 Search and Reach Instantly</h2>
					<ul style={ { listStyleType:'disc', margin: '0', padding: '0 0 0 16px' } }>
						<li><h2 className="txt">Efficient keyword-matched plugin search <span className="tag-info"> default shortcut Command+I </span></h2></li>
						<li><h2 className="txt">Automatically sorts by usage habits and timing, prioritizing frequently used extensions</h2></li>
						<li><h2 className="txt">Complete search and installation within one interface, without leaving the console</h2></li>
					</ul>
          <h2> ⚡️ Quick Access</h2>
					<ul style={ { listStyleType:'disc', margin: '0', padding: '0 0 0 16px' } }>
						<li> <h2 className="txt"> Activate and launch extensions in one step</h2> </li>
						<li> <h2 className="txt"> Displays all custom extension pages for quick navigation</h2> </li>
						<li> <h2 className="txt"> One-click management of extensions, including enabling, disabling, and uninstalling </h2> </li>
					</ul>
          
          <h2> 🗂️ Extension Management  </h2>
					<ul style={ { listStyleType:'disc', margin: '0', padding: '0 0 0 16px' } }>
						<li><h2 className="txt"> Supports extension runtime snapshots, enabling or disabling in bulk</h2> </li>
						<li><h2 className="txt"> Flexible rule matching to equip each website with the best extension</h2> </li>
					</ul>
          
					<h2> 🛠️ Exclusive for Developers  </h2>
					<ul style={ { listStyleType:'disc', margin: '0', padding: '0 0 0 16px' } }>
						<li><h2 className="txt"> One-click access to the plugin source code, supporting both local and network downloads</h2> </li>
						<li><h2 className="txt"> Independent Solo running mode to ensure a clean testing environment</h2> </li>
						<li><h2 className="txt">Easily copy extension titles and IDs to improve development efficiency</h2></li>
					</ul>
         
					<h2> 🚀 Smooth Experience </h2>
					<ul style={ { listStyleType:'disc', margin: '0', padding: '0 0 0 16px' } }>
						<li><h2 className="txt"> Minimalist design, lightweight operation, reducing resource burden</h2> </li>
						<li><h2 className="txt"> Compatible with multiple browsers, including Chrome, Edge, and Arc</h2> </li>
						<li><h2 className="txt">Rule import feature, facilitating seamless migration from other extension managers</h2></li>
					</ul>
					<h2>💁 Additional Notes  </h2>
					<ul style={ { listStyleType:'disc', margin: '0', padding: '0 0 0 16px' } }>
						<li><h2 className="txt"> <span className="tag-info"> Show in Finder. </span> Need to start service. <a href="https://www.npmjs.com/package/extss">extss</a></h2> </li>
					</ul>
         <h2>💌 Extenion Shoot, reshaping your extension management experience!</h2>
      </div>
  );
}