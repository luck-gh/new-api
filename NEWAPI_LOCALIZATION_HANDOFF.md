# NEWAPI 本地化改造交接说明

更新时间：2026-07-23  
目标仓库：`D:\BaiduSyncdisk\01_Code\GIT\new-api\`  
已验证源码：`D:\BaiduSyncdisk\01_Code\CodeX\API_Docs\newapi-integration-staging-v3\`
最小交接包：`D:\BaiduSyncdisk\01_Code\CodeX\API_Docs\newapi-localization-handoff-2026-07-23\`

## 1. 当前结论

当前沙盒中的功能实现已经完成构建和浏览器验收，但还没有把最新版全部同步到目标仓库。下一步应在以目标仓库为工作区的新沙盒中，从最小交接包逐文件合入；不能复制整个 `API_Docs` 目录，也不能覆盖目标仓库已有的未提交改动。

目标仓库当前不是干净工作树，已经包含关于页、错误页、主页入口、文档基础文件、多语言文件和路由生成文件等改动。新沙盒接手后必须先执行 `git status --short`，再按本文件清单合并。

## 2. 必须遵守的仓库约束

- 保留所有与 `new-api` 和 `QuantumNous` 有关的原始项目名称、归属、元数据、版权和许可信息。
- 站点自定义名称和徽标可以读取系统配置，但不能以此删除或替换上游项目必须保留的归属声明。
- 所有用户可见文案必须使用项目现有 i18n 体系，并覆盖 `en`、`zh`、`zh-TW`、`fr`、`ru`、`ja`、`vi`。
- 导航应使用 TanStack Router 的 `Link` 或 `useNavigate`；内部文档页不得使用新标签或 `window.location` 跳转。
- API 令牌不得写入源码、日志或持久化存储。文档示例的令牌注入只应存在于当前会话内，并在复制或展示时明确提示风险。
- 修改 TS/TSX 后必须执行类型检查、受影响文件 Lint、生产构建和用户可见行为回归测试。

## 3. 目标仓库已有内容：保留并在其上继续

以下内容已经存在于目标仓库，不应从测试副本整目录反向覆盖：

- `web/src/features/about/index.tsx`
- `web/src/features/about/default-about.tsx`
- `web/src/features/errors/error-page-brand.tsx`
- `web/src/features/errors/*-error.tsx`
- `web/src/features/home/index.tsx`
- `web/public/docs/`
- `web/src/routes/docs/`
- `design-qa.md`

`web/src/i18n/static-keys.ts` 与已验证暂存版本内容一致，目前不需要复制。

## 4. 下一阶段需要合入的运行时源码

### 4.1 目标仓库尚缺失的文件

| 暂存源文件 | 目标文件 |
| --- | --- |
| `source-home/source-home-character-field.tsx` | `web/src/features/home/components/source-home/source-home-character-field.tsx` |
| `source-home/source-home-easter-egg.tsx` | `web/src/features/home/components/source-home/source-home-easter-egg.tsx` |
| `source-home/source-home-request-journey.tsx` | `web/src/features/home/components/source-home/source-home-request-journey.tsx` |
| `docs/docs-token-injection.tsx` | `web/src/features/docs/docs-token-injection.tsx` |
| `docs/docs-token-store.ts` | `web/src/features/docs/docs-token-store.ts` |
| `support/index.tsx` | `web/src/features/support/index.tsx` |
| `support-route.tsx` | `web/src/routes/_authenticated/support/index.tsx` |

### 4.2 与目标仓库现有版本不同，必须审阅后合并

主页：

- `source-home/index.tsx`
- `source-home/source-home-policy-and-request.tsx`

文档：

- `docs/api-reference.tsx`
- `docs/docs-navigation.tsx`
- `docs/guide-page.tsx`
- `docs/index.tsx`

导航、通知和工单入口：

- `use-top-nav-links.ts`
- `notification-popover.tsx`
- `use-notifications.ts`
- `use-sidebar-data.ts`

多语言：

- `locales/en.json`
- `locales/zh.json`
- `locales/zh-TW.json`
- `locales/fr.json`
- `locales/ru.json`
- `locales/ja.json`
- `locales/vi.json`

多语言 JSON 必须按键合并，不能直接用暂存文件覆盖目标文件，以免丢失目标仓库随后新增的翻译。

### 4.3 已一致、无需重复复制

- `docs/docs-copy.ts`
- `docs/docs-home.tsx`
- `docs/types.ts`
- `docs/use-docs-data.ts`
- `source-home/source-home-hero.tsx`
- `source-home/source-home-trust.tsx`
- `static-keys.ts`

### 4.4 生成文件

- 不要复制暂存目录中的 `routeTree.gen.ts`。
- 添加工单路由后，在目标仓库使用项目脚本重新生成 `web/src/routeTree.gen.ts`。
- 不要合入 `locales/_reports/_sync-report.json`，如有需要应在目标仓库重新执行 i18n 同步生成。

## 5. 不应合入目标仓库的临时内容

- `newapi-test-build-v3/`
- `qa-v3/`、浏览器截图和验收日志
- `node_modules/`、`dist/`
- `serve_preview_v3.py`
- `mock_newapi_backend.py`
- `qa_v3.py`
- `qa_easter_nav.py`
- 其他下载、抓取、预览或 Mock 中间文件

这些内容仅用于当前沙盒构建和验证，不属于 NEWAPI 产品源码。

## 6. 已通过的验证

暂存版本已完成：

- 前端生产构建
- TypeScript 类型检查
- 受影响文件 Lint
- 多语言与版权检查
- Chrome 页面验收
- 主页字符切片彩蛋：鼠标经过时产生小方块碎片，约 1.55 秒逐步恢复
- 文档导航：在同一标签、同一应用壳内进入 `/docs`
- 文档令牌选择与示例注入
- 工单中心入口与通知入口

最近一次浏览器验收记录：碎片像素数量 `4847`、恢复成功、文档同标签跳转成功、严重控制台错误 `0`。

## 7. 本次工作的经验与教训

1. **真实仓库应直接作为沙盒根目录。** 在旁路目录开发会产生权限、路径、构建副本和同步成本，也容易出现“测试版本通过但真实仓库仍是旧版本”的情况。
2. **先检查脏工作树，再做任何复制。** 本次目标仓库已有大量未提交和未跟踪文件，整目录覆盖会破坏先前成果。
3. **视觉参考应复刻交互机制，不复制第三方品牌。** 可参考动画节奏、布局和交互反馈，但站点身份必须来自本项目配置，同时保留许可证要求的原始项目归属。
4. **交互动画不能只看静态截图。** 字符切片、鼠标区域发光、滚动锁定和逐步恢复必须用真实指针与滚轮事件验收。
5. **应用内页面必须复用现有壳层。** 文档页曾经因为外链和弹窗式接入显得割裂；应使用原生路由、现有导航、主题与语言上下文。
6. **i18n 必须从组件设计阶段接入。** 只翻译中文和英文会导致其他已支持语言出现混合界面；所有七种语言必须同时处理，并验证实时切换。
7. **品牌配置与项目归属是两个概念。** `branding.logo_url` 和系统名称可用于部署者的站点展示，但不能删除 `new-api`、`QuantumNous` 或第三方许可要求保留的声明。
8. **生成文件应在最终仓库生成。** 路由树和 i18n 报告携带目录状态，复制测试副本的生成文件容易造成漂移。
9. **长期运行的预览服务不是交付物。** 预览端口可能因任务结束而失效；最终验收应以目标仓库可重复执行的开发命令为准。
10. **每轮验收都要覆盖导航目的地。** 页面本身正确不代表入口正确，尤其要检查是否同标签、是否保留主题和语言、是否经过正确鉴权壳层。

## 8. 新沙盒实施计划

1. 新建沙盒，工作路径直接设置为 `D:\BaiduSyncdisk\01_Code\GIT\new-api\`。
2. 阅读根目录 `AGENTS.md` 和 `web/AGENTS.md`。
3. 执行 `git status --short`，保存当前变更清单；不要清理或重置工作树。
4. 建议创建专用分支或本地检查点，确保当前未提交成果可以恢复。
5. 先合入缺失文件，再逐个合并存在差异的文件。
6. 多语言文件按键合并，运行 `bun run i18n:sync` 并审阅结果。
7. 重新生成路由树，不复制暂存生成文件。
8. 补充符合 `web/AGENTS.md` 的行为回归测试，重点覆盖同标签文档导航、字符切片恢复、工单入口和令牌会话边界。
9. 执行受影响测试、`bun run typecheck`、Lint 和 `bun run build`。
10. 启动真实工程，用 Chrome 验收主页、文档、关于、工单、语言、主题、404 和移动端布局。
11. 审阅 `git diff`，确认没有删除受保护品牌与版权声明后再提交。

## 9. 新沙盒首条任务建议

> 按仓库根目录 `NEWAPI_LOCALIZATION_HANDOFF.md` 执行合入。先检查并保护当前脏工作树，再从 `D:\BaiduSyncdisk\01_Code\CodeX\API_Docs\newapi-localization-handoff-2026-07-23\` 合并缺失和差异源码；不要复制测试构建、生成报告或临时 QA 文件。完成后重新生成路由，运行 i18n、typecheck、lint、build 和浏览器验收。
