"""Write FIX03 reports from actual outputs; --skills updates only repository knowledge files."""
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]
def load(p): return json.loads((root/p).read_text(encoding='utf-8-sig'))
def write(p,s): (root/p).write_text(s,encoding='utf-8')
before=load('review/fix03/baseline/model.json'); after=load('review/fix03/final/model.json')
groups={}
for q in after['questions']: groups.setdefault(q['flowId'],[]).append(q['questionId'])
tree='|活动题组|活动题号|来源子目与返源|\n|---|---|---|\n'
for flow,ids in groups.items():
    q=next(q for q in after['questions'] if q['flowId']==flow)
    tree+=f"|{flow}|{', '.join(ids)}|{q['originRoutes'][0].split('--')[0]}；完成返回本次触发片段|\n"
notice='''## MX-FIX03 当前有效规范（2026-10-22）

教师已授权第七阶段后的定向迭代，不是第八阶段。以下旧阶段“当前”或暂停条款仅作历史档案；与本段冲突时，以根目录MX-FIX03_CODEX_INSTRUCTION.md为准。保留3一级、6模块、23教材片段、4回顾及40分钟；现为13组15题。新增Q24秦隋比较、Q25运河功过、Q26盛世成因；Q07/Q08/Q09和goguryeo/sui-burden退出活动库。旧题链接回有效原片段，否则回sui-end--sui-end，不转成新题。

Q06/R02共用Q06.timeline四行数据，通过questionId查询；新题定稿逐字保留。课堂不渲染审核状态、reviewNote及无关sourceRef长段，内部needs-verification/teacher-extension不变。地图的真实图题、年份、图例和“不代表疆界”等教学限定保留。新答案仍在1200逻辑舞台内预留布局，揭示不重排板书。

验收依据：MX_FIX03_REVIEW.md、MX_FIX03_CONTENT_AUDIT.md、MX_FIX03_TEST_MATRIX.md及review/fix03/；自动化不等于真实触控笔/投影验收，不自行Git暂存、提交、推送、PR或部署。

'''
if '--skills' in sys.argv:
    skill=root/'.agents/skills/sui-tang-lesson/SKILL.md';s=skill.read_text(encoding='utf-8');s=s.replace('# 隋唐课堂教学契约','# 隋唐课堂教学契约\n\n'+notice,1);skill.write_text(s,encoding='utf-8')
    ref=root/'.agents/skills/sui-tang-lesson/references'
    extras={
      'lesson-outline.md':tree+'\n教材片段顺序全部不变；新单题组分别允许隋亡2个来源、唐繁荣5个来源；各组首题键独立为flow/组ID。\n',
      'question-bank.md':tree+'\n四阶段现状以js/question-data.js的Q06.timeline为唯一维护源。新题详细定稿见本轮指令§2，内部逐点核查见MX_FIX03_CONTENT_AUDIT.md；旧Q07—09归档，不因旧表中存在而恢复入口。\n',
      'historical-fact-audit.md':'F03-A01：秦隋“二世而亡”是课堂概括，不能当帝王人数精确统计。F03-A02：运河功过为教师评价，不把隋亡归因于单项工程。F03-A03：制度演进有隋唐阶段差异，兵制与战斗力因果须补证。A04/A09纵向分期以教师四行稿显示，仍需跨课教材；A01/A02/A08/A10状态未获升级。Q07—09退出活动不删除A05/A06/A12/A13历史档案。\n',
      'source-manifest.md':'新增授权来源：MX-FIX03_CODEX_INSTRUCTION.md（教师三新题、四阶段及界面清理定稿）。本轮未新增外部史学证据。原PDF/框架/讲稿/全部素材与开工快照SHA-256一致，见review/fix03/{baseline,final}/model.json。Q05图片assetStatus修正为available，仅修复已存在图片的陈旧缺图元数据，不代表其他史实获证。\n',
      'textbook-map.md':'23个活动片段、全部原图及派生图未变；新增三题不是教材片段。Q24/Q25挂sui-end（PDF1/6印刷34页），Q26挂tang-prosper（PDF2/6印刷35页五片段）。Q26的跨主题依据还包括PDF3—4/6（印刷36—37页）及PDF6/6（印刷39页学习拓展），不是每条答案均为该教材原句。\n'}
    for name,extra in extras.items():
        p=ref/name;s=p.read_text(encoding='utf-8');first,rest=s.split('\n',1);p.write_text(first+'\n\n'+notice+extra+'\n## 以下为历史阶段记录（勿按旧题数恢复入口）\n'+rest,encoding='utf-8')
    print('Updated Skill and five reference files.');sys.exit()
s=load('review/fix03/special/results.json');route=load('review/fix03/final/results.json');detail=load('review/fix03/final/details-results.json');wb=load('review/fix03/final/whiteboard-regression/test-results.json');online=load('review/fix03/online-results.json')
assert s['status']=='passed'
audit='''# MX_FIX03_CONTENT_AUDIT

2026-10-23收尾。教师已授权本轮三道新题、三道停用题及四阶段短句。**教师定稿展示已落实；界面不显示审核词，不等于史实已经全面核准。** 不把teacher-extension或needs-verification改成textbook-supported。

读取依据：本轮指令、原框架和讲稿、教材PDF六页（印刷34—39）、Skills及FIX01/02与第七阶段报告。PDF本轮只读提取见review/fix03/pdf-text.txt；未进行新的外部史学研究。下文教材支持表示该六页能直接支持的范围，不能代替秦史、制度史及跨课经济史补证。

## 三道新题：教师定稿展示 / 教材支持点 / 教师归纳与补证点

'''
evidence={
 'Q24':[
 ('建立','PDF1/6印刷34页支持589年隋灭陈结束南北长期分裂；秦统一部分不在本课六页。','秦隋比较为教师跨课归纳；应联系秦朝教材。'),
 ('发展','PDF1/6印刷34页支持隋各项建设、大运河与改革；没有完整秦隋制度比较。','工程举例、影响深远的制度及其形成时间需跨课材料，当前只展示教师规定概括。'),
 ('灭亡','PDF1/6印刷34页支持隋短命、隋炀帝统治负担与起义、618年灭亡。','“都因为暴政二世而亡”是高度概括。秦末与隋末政权更替、继承称号与实际统治需专门核对；不能当作无例外的精确帝王人数统计。')],
 'Q25':[
 ('利1','PDF1/6印刷34页记两都、仓储、运河贯通南北。','“连接经济中心与政治中心”是教师组织的布局概括，不能由一句教材推出全部工程动机。'),
 ('利2','同页直接支持巩固统一、促进南北经济交流。','加强中央集权及地方控制是教师政治评价角度，不逐句等同教材原文。'),
 ('弊1','同页隋炀帝大兴土木、穷奢极欲及征伐加重社会负担；PDF6/6印刷39页有奢靡材料。','“滥用民力”为教师评价，不能把所有徭役后果只归于运河。'),
 ('弊2','PDF1/6印刷34页直接记生产严重破坏。','将其中农业影响联系运河为分析角度，须和多项建设、战争背景合看。'),
 ('弊3','同页民不聊生、引发大规模起义有据。','“激化阶级矛盾”是教师归纳；不以修运河解释隋亡全部原因。')],
 'Q26':[
 ('政治1','PDF1—2/6印刷34—35页支持隋唐统一；PDF4/6印刷37页为唐前期地图。','疆域辽阔为教师概括，不把669图全部对象视为直接管辖。'),
 ('政治2','本课六页并未系统说明三省六部与科举制度。','确立、形成、发展有隋唐阶段差异，需联系制度史教材，不能以“隋唐”合称抹平过程。'),
 ('政治3','PDF2/6印刷35页明确唐太宗吸取隋亡教训及治理措施。','政局稳定、政策连续性的因果是教师归纳，不承诺各时期无中断。'),
 ('经济1','PDF2/6印刷35页曲辕犁三项改进、江南推广等为技术进步例证。','生产力进步与盛世的总体关系属分析，不由单件器物证明全部经济格局。'),
 ('经济2','同页有轻徭薄赋、劝课农桑、发展生产。','教师归纳有直接材料支点，仍应区分具体统治时期。'),
 ('文化1','本课六页没有系统科举材料。','科举选才与文化作用须联系后课，教师定稿不冒充本课原句。'),
 ('文化2','PDF3/6印刷36页职贡图及唐蕃交流为局部材料。','开放政策与频繁中外文化交流属跨主题归纳，不混同民族关系与全部对外关系。'),
 ('军事','PDF2/6印刷35页记唐玄宗改革兵制。','“提升军队战斗力”的直接因果需具体制度、时期和史料支撑。'),
 ('民族关系','PDF3—4/6印刷36—37页讲交往与开发；PDF6/6印刷39页称两朝民族政策比较开明。','促进民族交融与边疆稳定为教师归纳，不推断所有族群和时期均和平或受直接管辖。')]
}
for qid in ['Q24','Q25','Q26']:
    q=next(q for q in after['questions'] if q['questionId']==qid)
    audit+=f"### {qid} {q['item']['prompt']}\n\n活动组：`{q['flowId']}`；合法来源："+'、'.join('`'+p+'`' for p in q['originRoutes'])+'。内部状态：teacher-extension，来源及reviewNote保留。\n\n**实际数据定稿（浏览器已逐项核对）：**\n\n'
    for b in q['item']['answerSections']:
        audit+=f"- **{b['title']}**："+' '.join(b['items'])+'\n'
    audit+='\n|分项|教材支持点|教师归纳与补证点|\n|---|---|---|\n'
    for row in evidence[qid]: audit+='|'+'|'.join(row)+'|\n'
    audit+='\n'
q06=next(q['item'] for q in after['questions'] if q['questionId']=='Q06')
audit+='''## Q06与R02：四行一致

保留原题干与原框架四节点；本轮指令§4正式批准下列现状短句。Q06.timeline是单一数据源，阶段六通过questionId查找Q06，R02共用同一个数组，渲染使用同一个fourStages函数，无脆弱items[2]绑定。内部仍为needs-verification。

|阶段|两处共同显示|
|---|---|
'''
for row in q06['timeline']:audit+=f"|{row['title']}|{row['text']}|\n"
audit+='''
“靖康之变后，至南宋时期”表示过程区间，不是当天完成。四节点来自原框架，现状措辞来自本轮定稿；本课六页未完整证明纵向四阶段，仍需前后课教材。Q18未获本轮改写授权，保留“经济重心开始南移”；其与Q06过程表述的证据口径问题留在内部A04/A09。

## 停用与公开提示清理

Q07/Q08/Q09已从运行题库删除，goguryeo/sui-burden从活动组和隋亡绑定删除；不删除隋亡正文、皮日休诗或PDF“高丽”字样。旧题及A05/A06/A12/A13档案仍在Skills旧表、STAGE7_CONTENT_AUDIT.md及本轮baseline/model.json中。退出课堂不代表旧争议获证或教材记载被否定。

全站统一不渲染证据标签、内容状态、审核项、reviewNote、问答/回顾/讲解附加来源长段及因果链sourceRef。Q06不再输出旧解释、复习标题或审核旁注。藩镇“讨论边界”块仅在数据保留并显式不呈现；唐繁荣和安史过程的审稿性旁注使用简短教学版本。曲辕犁“证据边界”标题改“观察方法”，实质限定内容保留。没有用CSS遮字或全仓库替换。

教材图片页码、地图图题/图例/跨时年份及“不代表疆域”、部分藩镇“有些”等教学限定仍可见；原地图中的真实边界图例文字不是审稿状态，不修改原图。动态检查包括所有活动路由、揭示答案、四回顾、地图四面板、工具展开及可见title/aria-label；悬停提示使用相同title/aria-label内容。扫描不声称OCR检验所有图片文字。

A01两都制度、A02义仓规则、A08现代疆域判断、A10藩镇延续统治等原有疑点仍未核准；Q02/Q03/Q16/Q18/Q21未改。Q05已存在真实图片，assetStatus由陈旧asset-missing改available，仅纠正素材状态。

公开文字按本轮授权精简，内部史实结论未升级。真实教学是否采用及补证事项由教师验收决定。
'''
write('MX_FIX03_CONTENT_AUDIT.md',audit)
matrix=f'''# MX_FIX03_TEST_MATRIX

收尾日期2026-10-23（前次运行原始时间戳保留），Windows本机，Node v24.19.0，Playwright驱动Edge {s['browser']}无头浏览器。既有回归只更新本轮授权的13组及停用题断言；UI保护文件排除4个本轮内容文件，其余保护继续执行，额外快照核验44个原件/运行基础文件。历史测试与证据未覆盖。

|测试|环境与范围|实际结果|证据|
|---|---|---|---|
|开工4套既有回归|原23片段/12组15题；离线及本地HTTP|Pass，4套各1次|baseline/run.json及4日志|
|最终结构、菜单、热点、QA、前后导航|1920×1080、1366×768、1280×720|Pass，{route['layouts']}布局，{route['entries']}热点返源，{route['operations']}问答操作，{route['migrated']}原迁移|final/results.json|
|既有白板压力|鼠标、合成pen/touch、三主尺寸、DPR2|Pass，12轮24撤销、模式互斥、跨页与刷新清除|final/whiteboard-regression/test-results.json|
|教师图/笔色笔粗/清空|DPR1/2、24组合、清空取消/确认/撤销|Pass，最大图墨误差{detail['maxError']:.8f}像素|final/details-results.json|
|左侧品牌、键盘/合成tap与控件|三主横屏|Pass|final/ui-results.json|
|短窗回归|1600×900、960×600、1024×576、853×480|Pass，工具与导航不重叠，面板不盖教材|final/extended-results.json|
|全站公开提示动态扫描|77活动路由×五尺寸，另含揭示答案/地图面板/辅助面板|Pass，{len(s['scans'])}次扫描、{len(s['reveals'])}次揭示检查，无禁用审稿词|special/results.json|
|新题定稿与长答案末行|三主尺寸及1024×576、853×480|Pass，Q24三类/Q25利弊/Q26五角度逐条一致；可滚至末行|special/五尺寸截图，共{len(s['screens'])}张|
|Q06/R02|同五尺寸，实际DOM及共享数据身份|Pass，四行一致；Q06揭示不移动既有笔迹|special/results.json及Q06/R02截图|
|停用组URL迁移|两组×正常/第二来源/旧删片段/无效/空来源|Pass，10用例，不转新题|special/results.json migrations|
|新增三题笔迹、双击、历史|Q→A、4×拖动、缩小、离开返回、后退前进、刷新|Pass，独立板书键；最大定位误差{max(b['error'] for b in s['newBoards']):.8f}像素|special/results.json newBoards|
|本地项目子路径|/History_SuitangWeb/|Pass，64活动教材/题组入口，另18新题/迁移/回顾/教师图用例|final/details-results.json；special/results.json|
|离线资源|断网file://完整活动路线|Pass，零外部必需请求、零破图及脚本异常|各final与special结果|
|原件保护|开工与收尾SHA-256|Pass，44文件未变，包含PDF、原框架讲稿、图片、index.html、interaction.js|baseline/model.json、final/model.json|
|公开GitHub Pages|只读首页及脚本样式对照|Loaded，线上仍为12组15题，尚未含本轮迭代|online-results.json、online.png|
|真实触控笔、电子白板、教室投影|未使用实体课堂设备|Not Tested|教师现场验收|
|真实40分钟课堂、真实125%/150%缩放、其他浏览器|未进行|Not Tested|不以小视口/合成输入替代|

## 实际执行与失败记录

- `node tools/check_fix03_baseline.cjs`：1次，四子套件通过；时间见baseline/run.json。
- `node tools/check_fix03_regression.cjs`：1次，五子套件通过；时间、命令、退出码见final/run.json。
- `node tools/check_fix03.cjs`：3次。首次失败是测试脚本把Playwright的boundingBox误当作有bottom字段（实际为y+height），不是网站缺陷；记录special/attempt1-failed.json。第二次修正测量字段后全部断言通过，但本地HTTP连接清理顺序导致进程未正常退出，已保存special/attempt2-assertions-passed.json并终止该测试进程。第三次先关闭浏览器再关闭服务器连接，重跑全部断言并确认正常退出；最终实际开始{s['started']}，结束{s['ended']}（UTC）。
- `node tools/check_fix03_online.cjs`：1次，只读公网对照，不能代表本轮功能已上线。
- `node tools/snapshot_fix03.cjs baseline`及`final`：保存逐题flowId、questionId、来源、返源和板书键；收尾比较原件哈希。
- 本轮PDF只读提取保存pdf-text.txt，不改原PDF。最终JS语法及git diff --check另作收尾检查。

所有证据相对于review/fix03/。Node/Playwright由本机现有运行时提供，复现时设置NODE_PATH与BROWSER_EXECUTABLE为实际路径；脚本不是网页运行依赖。最终回归中的before/after高度仍是旧FIX01参考值，不是本轮前后对比；某些固定“未测公网”日志仅指其子套件，公网独立结果见online文件。
'''
write('MX_FIX03_TEST_MATRIX.md',matrix)
review=f'''# MX_FIX03_REVIEW

## 交付结论

Codex开发完成，自动化自检通过，等待教师人工验收。未执行Git add/commit/push、PR或部署；未启动额外阶段。开工HEAD：{before['head']}，工作区仅有教师未跟踪的MX-FIX03_CODEX_INSTRUCTION.md，没有覆盖其他未提交修改。以本地最新仓库增量开发，未用公网覆盖本地。

|项目|开工|完成|
|---|---|---|
|唯一入口|index.html|不变（文件字节也未修改）|
|一级/模块/教材片段/回顾|3/6/23/4|不变|
|活动题组/问题|12/15|13/15|
|六模块参考分钟|3+8+13+7+6+3=40|不变|

## 教学变更与活动树

移除goguryeo的Q07/Q08和sui-burden的Q09，新增Q24秦隋比较、Q25运河功过、Q26盛世成因。前两组在隋亡2个片段均可进入；后一组在唐繁荣5个片段均可进入，置于原Q11之后。题干答案按本轮指令逐条核对，无新增教材片段。

{tree}

开工全部活动组为two-capitals(Q02)、granaries(Q03)、canal(Q04/Q05/Q06)、goguryeo(Q07/Q08)、sui-burden(Q09)、economy(Q11)、relations(Q12)、perspectives(Q15)、concepts(Q16)、impact(Q18)、fanzhen-flow(Q21)、five-flow(Q23)。前后每题来源和板书键见review/fix03/{{baseline,final}}/model.json。

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
'''
write('MX_FIX03_REVIEW.md',review)
print('Wrote three FIX03 reports from actual evidence.')
