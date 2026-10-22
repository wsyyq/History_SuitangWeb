# MX_FIX03_TEST_MATRIX

收尾日期2026-10-23（前次运行原始时间戳保留），Windows本机，Node v24.19.0，Playwright驱动Edge 155.0.4283.62无头浏览器。既有回归只更新本轮授权的13组及停用题断言；UI保护文件排除4个本轮内容文件，其余保护继续执行，额外快照核验44个原件/运行基础文件。历史测试与证据未覆盖。

|测试|环境与范围|实际结果|证据|
|---|---|---|---|
|开工4套既有回归|原23片段/12组15题；离线及本地HTTP|Pass，4套各1次|baseline/run.json及4日志|
|最终结构、菜单、热点、QA、前后导航|1920×1080、1366×768、1280×720|Pass，231布局，41热点返源，86问答操作，34原迁移|final/results.json|
|既有白板压力|鼠标、合成pen/touch、三主尺寸、DPR2|Pass，12轮24撤销、模式互斥、跨页与刷新清除|final/whiteboard-regression/test-results.json|
|教师图/笔色笔粗/清空|DPR1/2、24组合、清空取消/确认/撤销|Pass，最大图墨误差0.00011003像素|final/details-results.json|
|左侧品牌、键盘/合成tap与控件|三主横屏|Pass|final/ui-results.json|
|短窗回归|1600×900、960×600、1024×576、853×480|Pass，工具与导航不重叠，面板不盖教材|final/extended-results.json|
|全站公开提示动态扫描|77活动路由×五尺寸，另含揭示答案/地图面板/辅助面板|Pass，640次扫描、215次揭示检查，无禁用审稿词|special/results.json|
|新题定稿与长答案末行|三主尺寸及1024×576、853×480|Pass，Q24三类/Q25利弊/Q26五角度逐条一致；可滚至末行|special/五尺寸截图，共45张|
|Q06/R02|同五尺寸，实际DOM及共享数据身份|Pass，四行一致；Q06揭示不移动既有笔迹|special/results.json及Q06/R02截图|
|停用组URL迁移|两组×正常/第二来源/旧删片段/无效/空来源|Pass，10用例，不转新题|special/results.json migrations|
|新增三题笔迹、双击、历史|Q→A、4×拖动、缩小、离开返回、后退前进、刷新|Pass，独立板书键；最大定位误差0.00005719像素|special/results.json newBoards|
|本地项目子路径|/History_SuitangWeb/|Pass，64活动教材/题组入口，另18新题/迁移/回顾/教师图用例|final/details-results.json；special/results.json|
|离线资源|断网file://完整活动路线|Pass，零外部必需请求、零破图及脚本异常|各final与special结果|
|原件保护|开工与收尾SHA-256|Pass，44文件未变，包含PDF、原框架讲稿、图片、index.html、interaction.js|baseline/model.json、final/model.json|
|公开GitHub Pages|只读首页及脚本样式对照|Loaded，线上仍为12组15题，尚未含本轮迭代|online-results.json、online.png|
|真实触控笔、电子白板、教室投影|未使用实体课堂设备|Not Tested|教师现场验收|
|真实40分钟课堂、真实125%/150%缩放、其他浏览器|未进行|Not Tested|不以小视口/合成输入替代|

## 实际执行与失败记录

- `node tools/check_fix03_baseline.cjs`：1次，四子套件通过；时间见baseline/run.json。
- `node tools/check_fix03_regression.cjs`：1次，五子套件通过；时间、命令、退出码见final/run.json。
- `node tools/check_fix03.cjs`：3次。首次失败是测试脚本把Playwright的boundingBox误当作有bottom字段（实际为y+height），不是网站缺陷；记录special/attempt1-failed.json。第二次修正测量字段后全部断言通过，但本地HTTP连接清理顺序导致进程未正常退出，已保存special/attempt2-assertions-passed.json并终止该测试进程。第三次先关闭浏览器再关闭服务器连接，重跑全部断言并确认正常退出；最终实际开始2026-10-22T17:07:55.136Z，结束2026-10-22T17:10:36.078Z（UTC）。
- `node tools/check_fix03_online.cjs`：1次，只读公网对照，不能代表本轮功能已上线。
- `node tools/snapshot_fix03.cjs baseline`及`final`：保存逐题flowId、questionId、来源、返源和板书键；收尾比较原件哈希。
- 本轮PDF只读提取保存pdf-text.txt，不改原PDF。最终JS语法及git diff --check另作收尾检查。

所有证据相对于review/fix03/。Node/Playwright由本机现有运行时提供，复现时设置NODE_PATH与BROWSER_EXECUTABLE为实际路径；脚本不是网页运行依赖。最终回归中的before/after高度仍是旧FIX01参考值，不是本轮前后对比；某些固定“未测公网”日志仅指其子套件，公网独立结果见online文件。
