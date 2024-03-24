import React from 'react';
import useUpdateIcon from '~hooks/useUpdateIcon';
export default function WelcomeRender() {

  useUpdateIcon();

  return (
      <div
          style={ {
              display: 'flex',
              flexDirection: 'column',
              padding: 16,
          } }>
          <h2>感谢使用 Ext shoot</h2>
          <h2>🔍 快速搜索</h2>
          关键词快速匹配插件
          依据使用频次和打开时间自动排序
          <h2>  ⚡️ 两步直达</h2>

          两步操作，即可直达任何插件的任何页面，无须繁琐跳转
          一键启动/禁用/卸载插件，管理更便捷
          设置别名，给每个扩展起一个你喜欢的名字。
          <h2>  🗂️ 插件分组</h2>

          基于组批量启用/禁用插件，管理更轻松
          支持规则匹配，根据不同网站管理相关的扩展
          <h2>  🛠️ 开发者模式</h2>

          只启动开发者模式下的插件，方便测试和开发
          <h2> 🚀 丝滑交互</h2>

          简约设计，轻量运行，不占用过多资源
          多浏览器兼容，扩展功能等你探索
          导入规则，支持从其他拓展管理器无缝迁移
          💌 Extenion Shoot，让你的浏览器插件管理更上一层楼！
      </div>
  );
}