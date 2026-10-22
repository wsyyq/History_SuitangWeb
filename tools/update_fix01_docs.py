"""Maintain developer indexes from the reviewed FIX01 runtime; not classroom content generation."""
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
data=json.loads((R/'review/fix01/source-and-content-check.json').read_text(encoding='utf8'))
flows=data['flows'];questions={q['questionId']:q for g in flows.values() for q in g['items']}
deleted=['sui-prosper--granary','sui-end--yangdi','tang-relations--jiaohe','tang-relations--tribute','tang-relations--alliance','tang-relations--ethnic-policy','an-impact--army-source','tang-end--five','five--chairong','an-impact--an-process']
scope='MX-FIX01（2026-10-22）为第六阶段后专项修订，不启动第七阶段。当前有效结构：一级3页、二级6模块、11子目23教材片段、12组15题、二级4项回顾；参考时间3/8/13/7/6/3共40分钟。教师本次定稿优先于下列历史规范。'
inactive='非活动/教师要求移除：Q13、Q14、Q19、Q20及map-reading组。不得自动恢复；Q12、Q18、Q21各为所在组唯一题。删除的是课堂入口，原教材证据仍存。'
audit='''|审核项|当前课堂表达与证据状态|仍需人工审定|
|---|---|---|
|A01 / Q02|教师定稿按原句展示；两都存在见PDF1/6印刷34页、PDF6/6印刷39页|迁都洛阳、长安降为陪都及制度时点未获本课教材直接证明；needs-verification|
|A02 / Q03|赈济用途有教材支持；“按收成”由本轮教师明确定稿|征粮口径、官办化赋税化及分期为教师拓展，未作外部核验|
|A03 / Q05|教师提供真实PNG已到位；一句话是课堂概括|图片不是原教材PDF插图；不以配图证明工程唯一动机|
|A04/A09 / Q06、Q18、R02|Q06四节点及审核状态原样保留；Q18末两条按教师定稿展示|北方经济受损范围、“开始南移”的断代与完成标准需跨课补证；不称六页教材已经证明|
|A07 / 地图|669年地图原件和四对象定位保留，Q14非活动|保留图例及702/713/726后置注记；定位框不是疆界，编图含义仍待核|
|A08 / Q16、R04|教师简化表述/有局限，待课堂审定|现代疆域不能充分判定古代民族/外交关系，不可推断唐直接治理今天中国全部区域|
|A10 / Q21|不利中央集权有教材支持；延续唐统治为待证教师解释|持续100多年不证明延续因果；需具体藩镇、时期及机制证据|
'''
rows='\n'.join('|'+q+'|'+questions[q]['prompt']+'|'+questions[q]['answer'].replace('\n','<br>')+'|'+questions[q]['contentStatus']+'|' for q in ['Q02','Q03','Q05','Q16','Q18','Q21'])
answers='|题号|教师定稿问题|唯一课堂答案|内部证据标签|\n|---|---|---|---|\n'+rows+'\n\nR04唯一答案：核心判断标准：现在中国有没有当前领土。\n\nQ05同时展示教师PNG；精简题的来源、审核说明保留数据字段与审计文档，不额外投射旧解释、卡片或图示。R01对应Q04、R02对应Q06、R03对应Q15、R04对应Q16。'
tree='|子目|当前教材片段顺序（完整路由）|活动题组/题序|\n|---|---|---|\n'
for section in dict.fromkeys(p['section'] for p in data['activePages']):
 pages=[p for p in data['activePages'] if p['section']==section]
 grouptext='；'.join(f+': '+','.join(flows[f]['qids']) for f in pages[0]['flows']) or '无'
 tree+='|'+section+'|'+' → '.join(p['id'] for p in pages)+'|'+grouptext+'|\n'
removed='\n'.join('- `'+p+'`' for p in deleted)
images='''- 教师原图 `assets/teacher/sui_canal_granary_map.png`：416×404，SHA-256 `5a0a0492417368bb290ebe702317f9b6f3ec0dbb8093ad3e26e29a048785591f`，Q05引用；非原教材PDF插图，原样使用，原“缺图”状态已解除。课标截图已存在。
- `assets/lesson/an-impact-crosspage-merged.png`：1160×370。来自PDF4—5/6、印刷37—38页；an-process.png裁框[0,0,1122,292]原像素置于[0,0]，an-impact.png完整[0,0,1160,70]置于[0,300]。仅去尾部白边，无缩放、无重写；“占”接下一行“领河西陇右地区。从此，唐朝由盛转衰。”原段落四行与续句完整。
- 原图PDF页内来源坐标仍见HEAD的textbook-assets.js原目录及当前an-process条目；完整派生坐标、尺寸与SHA见 `assets/lesson/fix01-derivatives.json`。`an-process--an-process`不变；只合并影响子目的两张图。
- `assets/lesson/tang-thinking-point.png`：530×217，从alliance.png的[430,35,960,252]原像素裁出，附在tang-relations--frontier教材正文后；无独立新页。保留“隋唐盛世形成的原因有哪些？”，不带会盟碑及图注。
- 32张原教材PNG、PDF、框架、讲稿、课标图共36个原件与HEAD逐字节或LFS oid比对通过；详情 `review/fix01/source-and-content-check.json`。
'''
sections={
'lesson-outline.md':scope+'\n\n'+tree+'\n\n'+inactive+'\n\n删页（原证据不删）：\n'+removed+'\n\n前后导航由当前数组派生；旧hash按app.js显式迁移表就近返回同子目有效页。四级完成回本次来源；Q21首题板书键为flow/fanzhen-flow，各题独立。回顾仍二级四卡直接显示。左侧60px图标坞，辅助面板可收起且占用独立空间；顶部/底部各预留60px，保留固定1200逻辑坐标及共同缩放层。',
'question-bank.md':scope+'\n\n'+inactive+'\n\n'+answers+'\n\n'+audit+'\n下文原候选题与旧阶段实现均为历史档案，不是恢复入口或覆盖定稿的依据。',
'textbook-map.md':scope+'\n\n'+images+'\n活动页面完整目录见lesson-outline.md；以下删页仅退出授课展示，原素材索引仍存：\n'+removed+'\n\n'+inactive,
'source-manifest.md':scope+'\n\n新增授权：根目录MX-FIX01_CODEX_INSTRUCTION.md；隋唐第六阶段内容检查.md为教师复查输入，均不改。\n\n'+images+'\n原框架、讲稿、PDF及前阶段报告均保留。没有取得新版地图或新增外部史学证据。',
'historical-fact-audit.md':scope+'\n\n'+audit+'\n'+inactive+'\n教师授权的是课堂简化显示，不等于争议史实已核实。审核元数据与课堂正面分离，详见根目录MX_FIX01_CONTENT_AUDIT.md。旧A09引用Q19仅为历史追踪，当前入口为Q18/Q06/R02。'}
base=R/'.agents/skills/sui-tang-lesson'
for name,content in sections.items():
 p=base/'references'/name;s=p.read_text(encoding='utf8');title,rest=s.split('\n',1)
 # Idempotent: preserve previous stage archive, replace only this revision's current section.
 if '\n## 历史记录（截至第六阶段）\n' in rest:rest=rest.split('\n## 历史记录（截至第六阶段）\n',1)[1]
 p.write_text(title+'\n\n## MX-FIX01 当前有效规范\n\n'+content+'\n\n## 历史记录（截至第六阶段）\n'+rest,encoding='utf8')
p=base/'SKILL.md';s=p.read_text(encoding='utf8');start=s.index('第一至第五阶段已由教师验收') if '第一至第五阶段已由教师验收' in s else s.index('MX-FIX01（2026-10-22）');end=s.index('\n\n按任务选择阅读',start)
s=s[:start]+scope+'\n\n教师明确批准本轮删页与精简答案（详见references当前有效规范及根目录MX_FIX01_CONTENT_AUDIT.md）；不得按旧33页19题恢复被删内容。'+inactive+' 四模式白板、669年地图本体、过程页、五代正文、四卡回顾及离线能力保留。工具坞图标化，不遮住教材；笔迹与内容共用1200宽逻辑舞台。最新教师定稿的精简答案不叠加旧解释，未核史实保留审核状态于元数据及文档。原资料只读；完成等待人工验收及UGit提交，未经再次确认不进入第七阶段。'+s[end:]
s=s.replace('待裁决内容不得直接进入确定答案。','待裁决内容不得冒充教材已证明；本轮教师明确指定的课堂简化按定稿显示，在内部审核中保留疑点。')
p.write_text(s,encoding='utf8')
report='# MX_FIX01_CONTENT_AUDIT｜课堂精简内容审核\n\n'+scope+'\n\n本轮按教师指令实施课堂显示；核对既有PDF与第5/6阶段审核，没有新增外部史学研究。教师定稿、教材支持与待核史实分开登记。\n\n## 1. 定稿文字\n\n'+answers+'\n\n## 2. 审核边界\n\n'+audit+'\n\n## 3. 教材与教师图片\n\n'+images+'\n\n## 4. 非活动页面和问题\n\n'+removed+'\n\n'+inactive+'\n另移除an-cause--an-cause讲解栏，其教材页保留。会盟碑旁思考点附回frontier，不恢复原独立页。Q23时间线中的柴荣内容不因删除独立片段而误删。\n\n## 5. 当前目录及一致性\n\n'+tree+'\n9条未授权更改的活动问题与修改前数据逐字段相同；Q04/Q06/Q15/Q23保留。课堂六模块及40分钟未变，板书键按有效题序生成。自动测试只证明文字符合指令和交互正常，不证明历史判断充分。\n\n## 6. 教师复核重点\n\n请审定A01两京制度、A02征粮与官办化、A04/A09南移断代、A08口诀适用范围、A10延续机制；检查合成图接句与思考点、运河原图图题。验收前不进入第七阶段。\n'
(R/'MX_FIX01_CONTENT_AUDIT.md').write_text(report,encoding='utf8')
print('Updated six Skill/index files and MX_FIX01_CONTENT_AUDIT.md.')
