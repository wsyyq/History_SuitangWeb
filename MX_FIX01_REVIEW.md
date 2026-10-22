# MX_FIX01_REVIEW｜第六阶段后课堂精简与界面优化

执行日期：2026-10-22。授权：`MX-FIX01_CODEX_INSTRUCTION.md`。**这是 MX-FIX01，不是第七阶段。** 以下结果来自本地代码、离线无头 Edge 和本地 HTTP 项目子路径测试；未部署线上、未进行真实电子白板或40分钟课堂试讲。

## 1. 交付状态

|项目|状态|结果|
|---|---|---|
|教材页与问答精简|完成|3个一级页、6模块不变；33→23片段、13→12组、19→15题；回顾4卡保留|
|教师定稿文字|完成|Q02/Q03/Q05/Q16/Q18/Q21按指定文字；R04同步；无旧长解释叠加|
|教材与教师图片|完成|37—38页影响正文合并；思考点保留；教师运河PNG实际接入且哈希相符|
|紧凑界面|完成|60px左侧图标坞、可收起辅助面板、顶部紧凑入口/进度、底部图标导航；面板不覆盖教材视口|
|白板与离线回归|完成|四模式互斥、笔色笔粗、橡皮撤销清空、3×对齐、跨页独立、离线及项目子路径通过|
|Skills和审核资料|完成|Skill及五份知识索引更新，旧记录明确归档；另交付内容审核报告|
|争议史实的外部核准|未完成|本轮没有新增外部史学研究；教师指定的简化答案不等于相关争议已核实|
|教师真机验收、Git提交、线上部署、第七阶段|未执行|等待人工复查；未执行Git add/commit/push，未创建PR，未部署|

## 2. 开发前真实基线

开工时读取教师指令、Skill及相关索引、框架、讲稿、教材和第5/6阶段审核资料，检查现有代码。工作区原有未跟踪输入为 `MX-FIX01_CODEX_INSTRUCTION.md`、`assets/teacher/`、`隋唐第六阶段内容检查.md`；这些均为教师交付，未改写。

实际运行导出的原页面、模块、题组、每题板书键及热点入口见 [baseline.json](review/fix01/baseline.json)。原结构为33片段、13组19题，六模块参考时间3/8/13/7/6/3=40分钟。截图 `review/fix01/before-{1920,1366,1280}.png` 保留修改前画面。当前源映射见 [source-and-content-check.json](review/fix01/source-and-content-check.json)。

## 3. 删除与旧链接迁移

|退出运行的页面|旧hash迁移至|
|---|---|
|sui-prosper--granary|sui-prosper--sui-prosper|
|sui-end--yangdi|sui-end--sui-poem|
|tang-relations--jiaohe|tang-relations--huihe|
|tang-relations--tribute|tang-relations--tubo|
|tang-relations--alliance|tang-relations--frontier；附保留的思考点图片|
|tang-relations--ethnic-policy|tang-relations--map-669|
|an-impact--army-source|an-impact--fanzhen|
|tang-end--five|tang-end--huangchao|
|five--chairong|five--five|
|an-impact--an-process|an-impact--an-impact；唯一连续影响拼接图|

`flow/map-reading/...` 统一迁移到民族关系669年地图；其他保留题组以被删片段为来源的旧链接迁移到有效来源，完成问答后准确返回。无效格式仍返回安全首页；未产生循环或空页面。

Q13/Q14/Q19/Q20退出实际题库与题序；map-reading整组删除，地图“地图辨析问答”按钮删除。relations只剩Q12、impact只剩Q18、fanzhen-flow只剩Q21。Q21成为首题，板书键使用 `flow/fanzhen-flow`，不会继承其他题的笔迹。

保留 `an-process--an-process`、`five--five`、`five--map-five`、669年地图原图及四对象定位。安史原因只删除讲解栏，教材原图仍在。Q23中的柴荣时间线条目仍在。所有页序、下拉数量、热点和导航从有效数组派生，未用CSS隐藏代替删除。

## 4. 教学内容及素材

六处答案逐句验证与教师指令一致；Q05仅一句话及教师图片；Q18仅六条、Q21仅两条。精简题不再渲染旧解释、来源段落、模型图或长序列图，必要审核元数据留在JS与 [MX_FIX01_CONTENT_AUDIT.md](MX_FIX01_CONTENT_AUDIT.md)。Q04/Q06/Q15/Q23等9条未授权修改的活动题与开工基线逐字段一致。

R01对应Q04、R02对应Q06（不再引用已删Q19）、R03对应Q15、R04与Q16同句。回顾仍直接展示二级四卡题答。

- 教师运河图：416×404，SHA-256 `5a0a0492417368bb290ebe702317f9b6f3ec0dbb8093ad3e26e29a048785591f`；原样使用本地相对路径。默认保持原始比例，可借助白板放大。原图分辨率有限，放大不会产生新的图像细节。
- 影响拼接图：1160×370，原像素1:1。第37页完整四行接第38页“领河西陇右地区。从此，唐朝由盛转衰。”无重叠或缺句。
- 思考点：从原会盟碑切片右上裁出530×217，放在frontier教材正文后；没有恢复碑图独立页。
- 派生坐标、出处及哈希见 `assets/lesson/fix01-derivatives.json`；生成脚本为 `tools/prepare_fix01.py`，不覆盖原图。

32张原教材PNG、原PDF、原框架、原讲稿、课标图共36个文件与HEAD逐字节或Git LFS oid对照一致。详见源检查JSON。前三个核心原件SHA-256：

|文件|SHA-256|
|---|---|
|隋唐讲解框架.md|25353d34e15813425abb6e24cff65ec3dc49cc93958265f125a0cc23f640312b|
|隋唐讲解原文.md|a372d2f67027211d8418b7f41680a5e0377a23a787370120ead8dc404260dbd9|
|中外历史纲要上_PDF第41-46页.pdf|6adc270673507556fa3b03c53143f1ad9564130c41d87f1cbe2b240a64e540ba|

## 5. 界面与可视面积实测

同一页面 `sui-prosper--sui-prosper`，默认工具面板收起，测量真实 `#board-viewport` CSS像素范围：

|屏幕|修改前视口|修改后视口|阅读高度增加|
|---|---|---|---|
|1920×1080|1876×750|1828×952|202px，约26.9%|
|1366×768|1322×454|1274×640|186px，约41.0%|
|1280×720|1236×406|1188×592|186px，约45.8%|

对照截图为 `review/fix01/before-*.png` / `after-*.png`。截图已目视检查，主导航与正文无重叠。左侧工具坞宽60px，四种模式使用本地内联SVG，按钮44×44px；辅助面板232px，展开后主视口向右让位。Esc先关闭工具面板，再按Esc仍按原规则返回上级。默认顶部/底部各预留60px，提供轻量入口、面包屑、参考进度和导航，没有恢复原全宽工具横栏。

白板逻辑宽1200保持，内容和笔迹SVG共用变换。面板开合/窗口改变触发既有尺寸重算和视图复位，已存笔迹的逻辑位置不变。长教材、地图和问答通过外层滚轮/移动阅读，底部仍可达；没有为了塞屏压缩逻辑文字。Q/A揭示只改可见性，不重排笔迹坐标。

## 6. 真实自动测试

环境：Windows、本地Playwright及无头Edge 155.0.4283.62。以下脚本仅用于开发验收，不是网页运行依赖。

```powershell
$env:NODE_PATH='C:/Users/29824/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
$env:BROWSER_EXECUTABLE='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
$nodeExe='C:/Users/29824/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
& $nodeExe tools/check_fix01_sources.cjs
& $nodeExe tools/check_fix01.cjs
& $nodeExe tools/check_fix01_whiteboard.cjs
& $nodeExe tools/check_fix01_details.cjs
git -c core.fsmonitor=false diff --check
```

|测试|真实结果|证据|
|---|---|---|
|静态数据与源件|通过：36原件完整、9题不变、23活动片段|source-and-content-check.json|
|导航及内容|通过：72条有效路由×3尺寸=216布局检查；36热点来源、80次揭示/下一步；34条旧链接迁移|results.json|
|答案与历史导航|通过：精简答案逐句匹配、R04一致；上一题/首题禁用/末题回源；快速双击保护；浏览器后退前进|results.json及check_fix01.cjs|
|原白板回归|通过：216布局、36往返、12跨页循环、24次连续撤销、橡皮、缩放、移动、刷新清除、模拟触控/笔|whiteboard-regression/test-results.json|
|地图对齐|通过：669地图1×/3×、移动和窗口改变最大误差0.000071 CSS像素；运河图DPR1/2最大误差0.000069 CSS像素|whiteboard-regression/test-results.json、details-results.json|
|辅助操作|通过：四色×三粗×两个DPR共24组合；清空取消/确认/撤销；绘画/移动不触发地图选择，定位清除不擦笔迹|details-results.json|
|离线及子路径|通过：offline file://；59条教材/问答入口在本地/History_SuitangWeb/子路径加载，Q05图片专项检查|details-results.json|
|必要外部请求、脚本异常、正常素材加载|0外部请求、0脚本错误、0破图；另有故意阻断地图加载的白板降级测试|各测试JSON|
|空白/格式检查|git diff --check通过|命令实际退出0|

首次专项测试的控件检查选择器误选白板视口（也有data-mode属性），导致title断言失败；已将范围限定到工具栏并复跑通过。一次受限环境Edge启动失败，在已授权的本地浏览器环境重跑通过。没有用删减核心断言取得通过；旧阶段测试保留，新白板测试从第六阶段回归脚本适配本轮有效页面和可展开工具栏。

物理触控屏、真实触控笔、投影可读性及公网GitHub Pages未测试。合成PointerEvent只证明代码分支，不替代真机验收。

## 7. 精确文件变更清单

修改已有文件：

- `index.html`：加载本轮样式，首页入口无障碍标签。
- `js/lesson-data.js`：活动片段与题序删减。
- `js/question-data.js`：Q02/Q03/Q05定稿、教师图片、删题；保留审核字段。
- `js/stage6-content.js`：Q16/Q18/Q21及R04定稿，删题删讲解栏，R02去旧Q19引用。
- `js/teaching-notes.js`：删除仓储史料页/炀帝史料页的独立讲解注册。
- `js/textbook-assets.js`：活动pageIds及影响合并图元数据，原素材文件未改。
- `js/app.js`：旧路由迁移、精简答案渲染、思考点、去Q14地图按钮、浮动图标导航。
- `js/interaction.js`：四SVG模式按钮、辅助面板开合、Esc优先及尺寸重算；原绘画算法保留。
- `.agents/skills/sui-tang-lesson/SKILL.md`。
- `.agents/skills/sui-tang-lesson/references/lesson-outline.md`、`question-bank.md`、`textbook-map.md`、`source-manifest.md`、`historical-fact-audit.md`：当前有效规范前置，旧阶段内容归档。

新增实施与交付文件：

- `css/fix01.css`。
- `assets/lesson/an-impact-crosspage-merged.png`、`tang-thinking-point.png`、`fix01-derivatives.json`。
- `tools/prepare_fix01.py`、`update_fix01_docs.py`：衍生图与开发索引维护。
- `tools/fix01-baseline.cjs`：修改前采集脚本；**验收时不要对新版重跑覆盖原baseline证据**。
- `tools/check_fix01.cjs`、`check_fix01_sources.cjs`、`check_fix01_whiteboard.cjs`、`check_fix01_details.cjs`。
- `review/fix01/`：基线、测试JSON及前后截图；`whiteboard-regression/`为白板截图与报告。
- `MX_FIX01_REVIEW.md`、`MX_FIX01_CONTENT_AUDIT.md`。

实际引用但非Codex创建/改写的教师交付：`assets/teacher/sui_canal_granary_map.png`。原指令、教师复查文档及前阶段报告保留。`AGENTS.md`已包含“最新教师指令优先”，无冲突，未修改。

## 8. 十条人工验收路线

双击根目录index.html，或刷新已打开的本地页面。左侧四按钮依次为点选、绘画、移动、放大；“···”展开辅助工具。

1. **Q02及回源**：首页→课堂脉络→隋→兴盛→长安、洛阳与两京制→揭示答案。核对新题干和唯一短答案；放大/移动后完成返回，应回兴盛片段1/1。
2. **Q03及删页**：隋→兴盛→义仓→揭示答案。只显示功能、影响两行；返回后教材下拉不再有《通典》仓储史料页。
3. **运河问答与原图**：兴盛→大运河→Q04揭示→下一题Q05揭示。只有一句话和真实图；滚动可见图题，圈画洛阳，放大至3×后圈注应贴原位置。继续Q06应保留四个复习节点，完成回实际来源页。
4. **669地图**：唐→民族关系→下拉选择669地图。依次点突厥、回纥、吐蕃、靺鞨，定位只标字样；交往方式问答仅Q12一题，无Q13及地图辨析问答入口，地图图题、图例和注记保留。
5. **Q16与回顾**：民族关系→民族边疆与对外外交关系→揭示答案；再课堂脉络→内容回顾→第四卡。两处均为“核心判断标准：现在中国有没有当前领土。”；其适用局限请结合内容审核报告裁决。
6. **安史三子目**：安史之乱→原因（教材图，无三类背景讲解栏）→过程（原图仍在）→影响。检查37—38页接句完整，片段1/2，Q18答案只有指定六条。
7. **藩镇唯一问答**：影响子目→藩镇正文→藩镇题组。只有Q21“藩镇割据的影响”和两条答案；揭示后完成应直接回藩镇正文，没有旧Q20或额外子问。
8. **唐亡及回顾**：唐的灭亡→黄巢子目仅正文→五代十国正文→地图。无重复过渡页及柴荣独立页；Q23时间线可用；内容回顾仍四卡题答同时显示，R01/R02/R03保留。
9. **白板与工具面板**：任意地图→绘画四色三粗、橡皮、撤销；清空先取消再确认后撤销。绘画不跳热点、移动不画线；两页各写不同标记，往返应独立保留。展开/收起工具面板和改变窗口后标注仍贴教材；Esc先收面板，刷新后板书清除。请在实际触控屏与触控笔上复核。
10. **旧书签与思考点**：地址hash依次输入`sui-prosper--granary`、`an-impact--an-process`、`five--chairong`、`flow/map-reading/tang-relations--map-669`，应迁到上表目标，无空白。再唐→民族关系→会盟、靺鞨与边疆开发片段，向下读到保留的教材思考点，不出现独立会盟碑页。

## 9. 等待人工裁决

请重点审定A01两京/陪都、A02义仓演变、A04/A09南移分期、A08现代疆域口诀及A10藩镇延续机制；自动测试只验证按教师要求呈现，不能核准这些历史推论。开发完成后停止，等待教师复查与UGit提交；第七阶段继续暂停。
