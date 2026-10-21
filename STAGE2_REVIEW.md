# 第二阶段人工验收报告

## 1. 执行状态

**已完成第二阶段开发与自检，待教师人工验收。** 唯一主入口为根目录 [index.html](index.html)。无需安装、构建或开发服务器；双击即可打开。未进入第三阶段，未提交或发布。

本阶段有意保留：课标截图、运河仓储分布图缺失；四级正式问题答案与揭示流程尚未填充；回顾答案待第五/六阶段核实与填充。它们按第二阶段要求保留占位，不冒称完成正式课程内容。第一阶段审核的16项史实问题没有被写成确定课堂答案。

## 2. 页面结构与导航模型

- 一级3页：`title` 标题与教材大运河今貌插图 → `standard` 课标占位 → `outline` 课堂脉络。
- 二级6模块：`standards` 课标研读、`sui` 隋、`tang` 唐、`anshi` 安史之乱、`fall` 唐的灭亡、`review` 内容回顾。
- 常规三级11个子目、33个片段路由（复用31张不同教材切片，另1张用于首页）；列表如下。
- 四级13个主题占位组；同一主题可从多个片段进入，共68个带来源的热点路径。占位组不是最终问题数。路由 `flow/主题ID/来源片段ID`，返回具体原片段并恢复滚动位置。
- 回顾四项同时直接显示在二级，左右切换当前卡片；题目下方直接展示答案待填充状态，没有三级教材或四级揭示中间层。
- 页眉面包屑和课堂脉络入口始终可达；三级前后页按所属模块内的子目及片段顺序遍历，末页有完成本模块按钮；无下级入口隐藏、同级边界按钮禁用并提供原因。支持左右键和Esc，原生选择框不被全局快捷键拦截。

|三级ID|所属模块 / 子目|片段数|片段顺序（资产ID）|
|---|---|---:|---|
|sui-found|隋 / 建立|1|sui-found|
|sui-prosper|隋 / 兴盛|2|sui-prosper、granary|
|sui-end|隋 / 灭亡|3|sui-end、sui-poem、yangdi|
|tang-found|唐 / 建立|1|tang-found|
|tang-prosper|唐 / 繁荣与盛世表现|5|tang-zhenguan、tang-prosper、plough-text、plough-image、sancai|
|tang-relations|唐 / 民族关系与区域开发|10|turks-intro、turks、huihe、jiaohe、tribute、tubo、frontier、alliance、map-669、ethnic-policy|
|an-cause|安史之乱 / 原因|1|an-cause|
|an-process|安史之乱 / 过程|1|an-process|
|an-impact|安史之乱 / 影响|4|an-process（保留跨页前半段）、an-impact、fanzhen、army-source|
|tang-end|唐的灭亡 / 黄巢起义与朱温废唐称帝|2|huangchao、five（保留跨片衔接）|
|five|唐的灭亡 / 五代十国|3|five、chairong、map-five|

片段路由统一为 `三级ID--资产ID`；具体路径与来源也见素材清单。

|四级主题ID|内容范围|问题库引用|
|---|---|---|
|two-capitals|长安、洛阳与两京制|Q02|
|granaries|义仓的含义与制度演变|Q03|
|canal|运河作用、整体联系及经济重心|Q04—Q06，暂合容器，拆分未定|
|goguryeo|高句丽/高丽与征伐背景|Q07—Q08|
|sui-burden|隋亡与民力负担|Q09|
|economy|曲辕犁、唐三彩|Q11|
|relations|民族关系处理方式|Q12—Q13|
|map-reading|669年地图阅读|Q14|
|perspectives|关系题四视角|Q15|
|concepts|民族边疆与外交关系|Q16|
|impact|安史之乱影响|Q18—Q19|
|fanzhen-flow|藩镇割据与统治|Q20—Q21|
|five-flow|五代十国与藩镇|Q23|

Q01保留在课标入口；Q10、Q17、Q22保留三级教材，不强制独立四级页。各主题的审核ID、候选题ID、占位状态字段位于 `js/lesson-data.js`，页面没有正式答案。

## 3. 视觉与离线实现

采用朱砂 `#873C32`、铜金 `#B99355`、宣纸白 `#F6F0E4`、浓墨 `#282821`、青黛 `#3F6168`；统一页眉印章、细线、卡片、按钮与缺失素材样式。首页用教师提供教材中的大运河今貌，保留图注和双页码，无网络装饰图片。

标题宋体字体链，正文黑体字体链，均以通用serif/sans-serif兜底；不分发字体文件，不调用在线字体服务。在本机Windows Edge中实际截图未见缺字或方块；其他系统使用可用字体回退，未声称已测试所有终端。

经典脚本按顺序加载静态数据，无运行时fetch、ES module、CDN或API。所有网页必需资源相对引用。JSON清单供开发追溯，不是网页运行依赖；相同图片数据由 `js/textbook-assets.js` 提供。教材容器保留原图比例，长栏及地图在固定阅读区域自然滚动，不为一屏塞满而缩成小字；上方有滚动提示。

后续接口：`main-content`、`textbook-viewport`、`textbook-surface`、`annotation-layer`、`interaction-toolbar`；`lesson:navigate` 事件携带当前路由和模式。当前只点选导航，手绘层为空且不可交互，移动/放大/绘画仅文字标注第三阶段启用。

## 4. 教材切片与追溯

原PDF六页（印刷34—39）文字核验，并对照第一阶段整页核对结果和本阶段3000px高的原页渲染，导出32张无损PNG，总计约6.10 MiB。32张均通过接触表目视复查；第39页“问题探究”上沿在复查后已修正并重新查看。未修改原PDF、讲稿或框架，SHA-256与第一阶段基线一致。

两张地图均为独立高清资产。669年图保留古今地名表、图题、南海附图、图例与702/713/726年注；五代图保留“后周时期”、951—960年及951年南唐灭楚说明。上下滚动可完整阅读图题与边界，底部截图和实际滚动位置见补充测试记录。

测量裁切坐标、像素尺寸、SHA-256和页面关系完整记录于 [manifest.json](assets/textbook/manifest.json)。脚本 `tools/prepare_textbook.py` 使用Pillow，从Poppler六张源图重建；源图位于仓库外本次可视化目录，运行成品不需要源图、Python或PDF工具。

|本地切片路径|双页码|内容|服务页面ID|
|---|---|---|---|
|`assets/textbook/canal-photo.png`|PDF 1/6 · 教材34页|大运河今貌（含图注）|title|
|`assets/textbook/sui-found.png`|PDF 1/6 · 教材34页|隋朝建立与统一|sui-found--sui-found|
|`assets/textbook/sui-prosper.png`|PDF 1/6 · 教材34页|仓储、两都与大运河|sui-prosper--sui-prosper|
|`assets/textbook/sui-end.png`|PDF 1/6 · 教材34页|隋朝灭亡|sui-end--sui-end|
|`assets/textbook/sui-poem.png`|PDF 1/6 · 教材34页|学思之窗：皮日休诗与提问|sui-end--sui-poem|
|`assets/textbook/tang-found.png`|PDF 2/6 · 教材35页|唐朝建立|tang-found--tang-found|
|`assets/textbook/tang-zhenguan.png`|PDF 2/6 · 教材35页|贞观之治|tang-prosper--tang-zhenguan|
|`assets/textbook/tang-prosper.png`|PDF 2/6 · 教材35页|武则天时期与开元盛世|tang-prosper--tang-prosper|
|`assets/textbook/plough-text.png`|PDF 2/6 · 教材35页|历史纵横：唐朝曲辕犁|tang-prosper--plough-text|
|`assets/textbook/plough-image.png`|PDF 2/6 · 教材35页|敦煌莫高窟壁画唐朝牛耕图中的曲辕犁|tang-prosper--plough-image|
|`assets/textbook/sancai.png`|PDF 2/6 · 教材35页|唐三彩盘及说明|tang-prosper--sancai|
|`assets/textbook/turks-intro.png`|PDF 2/6 · 教材35页|突厥兴起与分裂（接下片）|tang-relations--turks-intro|
|`assets/textbook/turks.png`|PDF 3/6 · 教材36页|突厥、安西与北庭都护府|tang-relations--turks|
|`assets/textbook/huihe.png`|PDF 3/6 · 教材36页|历史纵横：回纥|tang-relations--huihe|
|`assets/textbook/jiaohe.png`|PDF 3/6 · 教材36页|交河故城及图注|tang-relations--jiaohe|
|`assets/textbook/tribute.png`|PDF 3/6 · 教材36页|《职贡图》及图注|tang-relations--tribute|
|`assets/textbook/tubo.png`|PDF 3/6 · 教材36页|吐蕃与文成公主（末句接下片）|tang-relations--tubo|
|`assets/textbook/frontier.png`|PDF 4/6 · 教材37页|唐蕃会盟、靺鞨与边疆开发（续前片）|tang-relations--frontier|
|`assets/textbook/alliance.png`|PDF 4/6 · 教材37页|唐蕃会盟碑及说明（保留邻近思考点）|tang-relations--alliance|
|`assets/textbook/map-669.png`|PDF 4/6 · 教材37页|唐朝前期形势和边疆各族分布图（669年）及古今地名表|tang-relations--map-669|
|`assets/textbook/an-cause.png`|PDF 4/6 · 教材37页|安史之乱原因|an-cause--an-cause|
|`assets/textbook/an-process.png`|PDF 4/6 · 教材37页|安史之乱过程及影响开端（续下页）|an-process--an-process、an-impact--an-process|
|`assets/textbook/an-impact.png`|PDF 5/6 · 教材38页|安史之乱影响（承教材37页末句）|an-impact--an-impact|
|`assets/textbook/fanzhen.png`|PDF 5/6 · 教材38页|藩镇割据|an-impact--fanzhen|
|`assets/textbook/army-source.png`|PDF 5/6 · 教材38页|史料阅读：《新唐书·兵志》|an-impact--army-source|
|`assets/textbook/huangchao.png`|PDF 5/6 · 教材38页|黄巢起义与朱温废唐（末行接下片）|tang-end--huangchao|
|`assets/textbook/five.png`|PDF 5/6 · 教材38页|五代与十国的定义（含衔接上文）|five--five、tang-end--five|
|`assets/textbook/chairong.png`|PDF 5/6 · 教材38页|后周世宗柴荣|five--chairong|
|`assets/textbook/map-five.png`|PDF 5/6 · 教材38页|五代十国形势图（后周时期）|five--map-five|
|`assets/textbook/granary.png`|PDF 6/6 · 教材39页|问题探究：《通典·食货典》仓储材料|sui-prosper--granary|
|`assets/textbook/yangdi.png`|PDF 6/6 · 教材39页|《资治通鉴》炀帝材料与隋亡提问|sui-end--yangdi|
|`assets/textbook/ethnic-policy.png`|PDF 6/6 · 教材39页|学习拓展：隋唐民族政策|tang-relations--ethnic-policy|

## 5. 自检结果与证据

浏览器：Microsoft Edge 155.0.4283.62，Playwright无界面实测。浏览器上下文设为 `offline: true` **后再打开本地file://**；不是先联网加载再断网。首个沙箱内启动因Edge临时配置权限失败，随后经工具授权在沙箱外完成测试，未修改浏览器全局设置。没有在线部署或发布。

|验收组|实测结果与证据|
|---|---|
|A 入口/相对路径/离线|通过：本地file://完整加载、零外部请求、零脚本异常；根目录唯一HTML；静态路径与图片哈希检查通过|
|A 项目子路径|通过本机HTTP `/History_SuitangWeb/index.html` 地图页加载，无404；**未实测GitHub Pages上线**|
|B 结构及导航|通过：一级3页、二级6模块、11子目33片段；114路由；68次热点进入/返回；额外122次三级导航按钮实际点击|
|B 回顾/无下级/边界|通过：二级直接4卡、无教材图；无热点的建立页不出现下级；末页完成返回、边界禁用、异常hash回首页|
|B 键盘/历史|通过：左右、Esc、选择框原生键盘操作；浏览器后退；返回原片段和滚动位置恢复|
|C 教材与史实|通过：6页真实来源、32无损切片，双页码；地图图例/图注保留；无正式争议答案|
|D 视觉/离线字体|通过本机截图检查：统一主题，中文、标点和占位均正常；无在线字体、未授权字体文件|
|D 三种横屏|通过1920×1080、1366×768、1280×720；每种检查114路由，共342次布局检查；无主导航越界、横向溢出、图片加载失败|
|D 扩展与规范|通过：稳定DOM/事件接口；未伪装画笔等可用；仅最小追加开发规范|
|E 交付与边界|报告、逐项文件表、素材表与截图已提供；未执行Git add/commit/push/PR；未进入第三阶段|

自动化原始结果：[test-results.json](review/stage2/test-results.json)、[reading-results.json](review/stage2/reading-results.json)、[static-results.json](review/stage2/static-results.json)。开发验收脚本只需要开发环境Playwright，课堂运行不需要。复跑时设置 `NODE_PATH` 指向已有Playwright模块目录、`BROWSER_EXECUTABLE` 指向Edge/Chrome，再运行 `node tools/check_stage2.cjs` 和 `node tools/check_reading.cjs`。

截图：`review/stage2/` 内7种页面×3分辨率共21张（title、outline、textbook、map669、mapFive、review、flow）；另3张1280×720长图底部截图、4张切片接触表。地图首屏保留大字自然滚动，底部图用于证明图例、图题未裁断；不能把滚动区域当前可见范围误认为资产裁切边界。

没有尚未解决的本阶段功能测试失败。测试脚本曾修正异步hash等待、原生select方向键预期及同目标双按钮定位；最终两套浏览器测试均退出0。真实投影距离、不同设备字体观感仍需教师人工验收。

## 6. 可照做的操作路径

1. 双击 `index.html` → 开始授课 → 课标占位 → 下一页 → 课堂脉络 → 隋 → 兴盛 → 点“大运河：作用、联系与经济重心” → 四级占位 → 返回触发此问题的教材片段，回到兴盛原片段。
2. 课堂脉络 → 唐 → 民族关系与区域开发 → 在“教材片段”下拉选择第9项669年地图 → 在白色阅读区上下滚动查看全图 → 返回本模块菜单。
3. 课堂脉络 → 内容回顾 → 直接看到四张回顾卡片（题目和答案待填充状态）→ 点选卡片或前后切换 → 返回上一级，回到课堂脉络。
4. 唐的灭亡 → 五代十国 → 第3片地图 → 滚动查看后周时期图题 → 完成本模块。

## 7. 缺失材料与人工确认

- 课标原截图仍未入库，一级第2页及课标研读二级都诚实显示“课标截图待提供”。
- 补充隋运河—仓储—洛阳分布图仍缺，运河四级保留素材插槽；没有用大运河今貌冒充路线图。
- 运河Q04—Q06是否拆链；各子目旁的主题热点是否符合课堂操作习惯。
- 669年地图及五代图目前自然滚动展示；请优先在实际投影距离检查地图字号、图例和长栏阅读宽度，第三阶段再做缩放/漫游。
- 请确认主辅色、系统字体观感、首页插图；本阶段教师已允许自行选择教材本地图，所以选用今貌照片，不代表其为隋代历史照片。
- 第一阶段16项审核仍有效；结构验收通过不等于争议史实已裁决，后续正式答案填充前需逐项处理。

## 8. Markdown规则修订及原始资料

未发现旧规范中“强制黑白”“其他首页名”“在线字体”等实际要求，因此没有无理由替换原文。只追加阶段二实施补充：

|修改文件|原规则/新规则及原因|
|---|---|
|AGENTS.md|原仅规定阶段确认/Skill/资料/Git；末尾新增两条：唯一index.html、隋唐主题、离线系统字体和相对路径，以及最新阶段要求优先、最小修订并登记|
|.agents/skills/sui-tang-lesson/SKILL.md|保留第一阶段边界历史记录；在其后新增第二阶段已授权范围与长期入口/风格/离线规则，明确当前仅四级占位及第三阶段未授权|
|.agents/skills/sui-tang-lesson/references/lesson-outline.md|在原记录前新增“第二阶段实施补充”，落实MX-T02已明确的M1与一级页复用、M6二级卡片、33片段/13占位和具体返回语义；未改六模块顺序及历史内容|

原始 `隋唐讲解框架.md`、`隋唐讲解原文.md`、PDF及第一阶段审核/来源/问题库/验收记录均未修改；现有指令文件亦未修改。教师新增 `MX-T02_CODEX_INSTRUCTION.md` 当前未跟踪，这是用户输入，不是Codex创建的产物。

## 9. 文件变更清单

修改3份：

- `AGENTS.md`
- `.agents/skills/sui-tang-lesson/SKILL.md`
- `.agents/skills/sui-tang-lesson/references/lesson-outline.md`

删除：无。

本次新增（逐项；不含教师提供的MX-T02指令）：

- `index.html`
- `STAGE2_REVIEW.md`
- `assets/textbook/alliance.png`
- `assets/textbook/an-cause.png`
- `assets/textbook/an-impact.png`
- `assets/textbook/an-process.png`
- `assets/textbook/army-source.png`
- `assets/textbook/canal-photo.png`
- `assets/textbook/chairong.png`
- `assets/textbook/ethnic-policy.png`
- `assets/textbook/fanzhen.png`
- `assets/textbook/five.png`
- `assets/textbook/frontier.png`
- `assets/textbook/granary.png`
- `assets/textbook/huangchao.png`
- `assets/textbook/huihe.png`
- `assets/textbook/jiaohe.png`
- `assets/textbook/manifest.json`
- `assets/textbook/map-669.png`
- `assets/textbook/map-five.png`
- `assets/textbook/plough-image.png`
- `assets/textbook/plough-text.png`
- `assets/textbook/sancai.png`
- `assets/textbook/sui-end.png`
- `assets/textbook/sui-found.png`
- `assets/textbook/sui-poem.png`
- `assets/textbook/sui-prosper.png`
- `assets/textbook/tang-found.png`
- `assets/textbook/tang-prosper.png`
- `assets/textbook/tang-zhenguan.png`
- `assets/textbook/tribute.png`
- `assets/textbook/tubo.png`
- `assets/textbook/turks-intro.png`
- `assets/textbook/turks.png`
- `assets/textbook/yangdi.png`
- `css/style.css`
- `js/app.js`
- `js/lesson-data.js`
- `js/textbook-assets.js`
- `tools/check_reading.cjs`
- `tools/check_stage2.cjs`
- `tools/prepare_textbook.py`
- `review/stage2/an-impact-army-source-bottom-1280x720.png`
- `review/stage2/crops-1.png`
- `review/stage2/crops-2.png`
- `review/stage2/crops-3.png`
- `review/stage2/crops-4.png`
- `review/stage2/five-map-five-bottom-1280x720.png`
- `review/stage2/flow-1280x720.png`
- `review/stage2/flow-1366x768.png`
- `review/stage2/flow-1920x1080.png`
- `review/stage2/map669-1280x720.png`
- `review/stage2/map669-1366x768.png`
- `review/stage2/map669-1920x1080.png`
- `review/stage2/mapFive-1280x720.png`
- `review/stage2/mapFive-1366x768.png`
- `review/stage2/mapFive-1920x1080.png`
- `review/stage2/outline-1280x720.png`
- `review/stage2/outline-1366x768.png`
- `review/stage2/outline-1920x1080.png`
- `review/stage2/reading-results.json`
- `review/stage2/review-1280x720.png`
- `review/stage2/review-1366x768.png`
- `review/stage2/review-1920x1080.png`
- `review/stage2/static-results.json`
- `review/stage2/tang-relations-map-669-bottom-1280x720.png`
- `review/stage2/test-results.json`
- `review/stage2/textbook-1280x720.png`
- `review/stage2/textbook-1366x768.png`
- `review/stage2/textbook-1920x1080.png`
- `review/stage2/title-1280x720.png`
- `review/stage2/title-1366x768.png`
- `review/stage2/title-1920x1080.png`

仓库外辅助源图：本次可视化目录内 `stage2-source-1.png` 至 `stage2-source-6.png`，是原PDF整页高分辨率渲染，仅供重建切片，不属于上课部署依赖。

## 10. 阶段边界与交接

教师可先双击首页，按上述路线复查，再用UGit查看变更并提交。Git仅只读检查，未由Codex暂存、提交、推送、创建PR或发布。未实现画笔、橡皮、自由拖动、完整缩放、模式互斥、正式逐题揭示、正式答案或各模块分钟分配。

**等待教师验收及通过UGit提交；未经再次授权，不开始第三阶段。**
