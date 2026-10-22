# MX_FIX03_REVIEW

## 交付结论

Codex开发完成，自动化自检通过，等待教师人工验收。未执行Git add/commit/push、PR或部署；未启动额外阶段。开工HEAD：3c2736ca8da8ce41f7f98f69b2ae9e2d2b7d946f，工作区仅有教师未跟踪的MX-FIX03_CODEX_INSTRUCTION.md，没有覆盖其他未提交修改。以本地最新仓库增量开发，未用公网覆盖本地。

|项目|开工|完成|
|---|---|---|
|唯一入口|index.html|不变（文件字节也未修改）|
|一级/模块/教材片段/回顾|3/6/23/4|不变|
|活动题组/问题|12/15|13/15|
|六模块参考分钟|3+8+13+7+6+3=40|不变|

## 教学变更与活动树

移除goguryeo的Q07/Q08和sui-burden的Q09，新增Q24秦隋比较、Q25运河功过、Q26盛世成因。前两组在隋亡2个片段均可进入；后一组在唐繁荣5个片段均可进入，置于原Q11之后。题干答案按本轮指令逐条核对，无新增教材片段。

|活动题组|活动题号|来源子目与返源|
|---|---|---|
|two-capitals|Q02|sui-prosper；完成返回本次触发片段|
|granaries|Q03|sui-prosper；完成返回本次触发片段|
|canal|Q04, Q05, Q06|sui-prosper；完成返回本次触发片段|
|sui-qin-comparison|Q24|sui-end；完成返回本次触发片段|
|sui-canal-merits|Q25|sui-end；完成返回本次触发片段|
|economy|Q11|tang-prosper；完成返回本次触发片段|
|sui-tang-prosperity-causes|Q26|tang-prosper；完成返回本次触发片段|
|relations|Q12|tang-relations；完成返回本次触发片段|
|perspectives|Q15|tang-relations；完成返回本次触发片段|
|concepts|Q16|tang-relations；完成返回本次触发片段|
|impact|Q18|an-impact；完成返回本次触发片段|
|fanzhen-flow|Q21|an-impact；完成返回本次触发片段|
|five-flow|Q23|five；完成返回本次触发片段|


开工全部活动组为two-capitals(Q02)、granaries(Q03)、canal(Q04/Q05/Q06)、goguryeo(Q07/Q08)、sui-burden(Q09)、economy(Q11)、relations(Q12)、perspectives(Q15)、concepts(Q16)、impact(Q18)、fanzhen-flow(Q21)、five-flow(Q23)。前后每题来源和板书键见review/fix03/{baseline,final}/model.json。

Q06与R02共用四行数据和渲染函数，以questionId查找，取消旧解释与审稿旁注。全站从渲染层分离内部审核元数据，真实教学限定、地图图例年份和原图保留。新答案采用大字三列/两列卡片；长题在原白板舞台内滚动，未重建坐标系统。

## 旧链接迁移与板书

`#flow/goguryeo/<origin>`、`#flow/sui-burden/<origin>`：来源仍有效则返回该教材片段；若来源是已迁移片段，先解析原迁移表（例如sui-end--yangdi→sui-end--sui-poem）；无效或空来源回sui-end--sui-end。使用location.replace，无循环，不错映射成新题。旧map-reading和旧删片段迁移继续通过。

Q24/Q25/Q26首题板书键分别为flow/sui-qin-comparison、flow/sui-canal-merits、flow/sui-tang-prosperity-causes；不复用旧组键。相同题从不同来源可共享该题会话笔迹，但完成总是返回本次触发来源。Q/A预留几何保持不变，切页复位点选与视图，刷新清除沿用原行为。

## 实际测试结果

开工4套全部通过；最终5套全部通过：231布局、41热点返源、86问答操作、34既有迁移、12轮24撤销、24笔色笔粗组合、本地64活动入口。专项77路由×五尺寸，640次公开文本/属性扫描、215次答案揭示、10停用组迁移、18本地子路径额外用例通过。新增三题4倍移动及揭示的图墨误差小于0.00006像素。具体限制、失败记录和命令见[测试矩阵](MX_FIX03_TEST_MATRIX.md)。

首次专项失败为测试脚本坐标字段错误，第二次断言通过但测试连接清理阻止进程退出。两项测试工具问题均已修复，第三次完整重跑正常退出；历史记录保留，未把失败当作通过。45张专项截图已生成，并抽查主屏及短窗的答案、末行和回顾。短窗内容随固定舞台缩小，可放大滚读；后排投影可读性需现场检验，未以截图宣告真机通过。

公网只读访问成功，仍为23片段/12组15题；本轮6个JS/CSS变更文件与线上不同。未推送或部署，线上全站和本轮新题上线后验证由教师进行。

## 文件变更清单

网站6文件：js/lesson-data.js（绑定和题组）、js/question-data.js（三增三删与四阶段）、js/stage6-content.js（按ID同步回顾、审稿块分离）、js/teaching-notes.js（清理审稿性旁注）、js/app.js（迁移/课堂渲染）、css/fix01.css（答案分栏与四行布局）。index.html、interaction.js、教材配置与素材不变。

知识文件：.agents/skills/sui-tang-lesson/SKILL.md及references下lesson-outline.md、question-bank.md、historical-fact-audit.md、source-manifest.md、textbook-map.md，顶部登记本轮有效规范并保留历史记录。

新增报告：MX_FIX03_REVIEW.md、MX_FIX03_CONTENT_AUDIT.md、MX_FIX03_TEST_MATRIX.md。
新增工具：tools/check_fix03.cjs、check_fix03_baseline.cjs、check_fix03_regression.cjs、check_fix03_online.cjs、snapshot_fix03.cjs、write_fix03_reports.py。
新增证据：review/fix03/。教师原指令为开工已有文件，未修改。44个受保护文件SHA-256一致，原PDF、讲稿、框架与所有图片保留。

## 教师人工验收路线

|路线|实际进入与操作|预期结果|
|---|---|---|
|1|首页→课堂脉络→隋→灭亡→秦和隋朝的相似之处→揭示→完成|三类定稿完整；返回触发的教材页。换诗歌片段再测一次|
|2|隋→灭亡→隋朝大运河的功过→揭示|利2项、弊3项；画线、擦除撤销后可完成返源|
|3|直接打开#flow/goguryeo/sui-end--sui-poem与#flow/sui-burden/invalid|前者回诗歌，后者回隋亡正文；菜单无Q07—09|
|4|唐→繁荣→Q11→返回→隋唐盛世的形成原因|Q11保留，新题五角度完整；滚动/移动可读到民族关系末行|
|5|隋→兴盛→大运河Q04→Q05→Q06→回顾02|Q05原教师图存在；Q06与R02四行逐字一致，无审核旁注|
|6|按六模块遍历教材、问答与四回顾；展开工具、悬停控件|无审稿状态文字；重要历史限定、图例及年代未删|
|7|669地图点四对象→圈画→3倍→缩小→进入新题并标注→回地图|图墨对齐；新题与地图笔迹独立，各页返回保留|
|8|1280×720与1024×576/853×480展开工具、揭示Q26、读末行、完成返回|左侧按钮不重叠且可操作；真实触控笔及投影效果现场记录|
|9|断网file打开→本地/History_SuitangWeb/→教师以后发布的公网|无破图/必需外网资源；公网需教师提交部署后重新验证|

失败请记录路由、题号、操作顺序、浏览器版本、分辨率、照片/录像；真实笔、电子白板、教室投影及课堂时间均未验证。新题历史归纳、经济重心跨课分期及A01/A02/A08/A10疑点见[内容审核](MX_FIX03_CONTENT_AUDIT.md)，未因移除公开审核词而升级为全面核准。完成本轮开发后停止，等待教师验收。
