# MX_FIX01_CONTENT_AUDIT｜课堂精简内容审核

MX-FIX01（2026-10-22）为第六阶段后专项修订，不启动第七阶段。当前有效结构：一级3页、二级6模块、11子目23教材片段、12组15题、二级4项回顾；参考时间3/8/13/7/6/3共40分钟。教师本次定稿优先于下列历史规范。

本轮按教师指令实施课堂显示；核对既有PDF与第5/6阶段审核，没有新增外部史学研究。教师定稿、教材支持与待核史实分开登记。

## 1. 定稿文字

|题号|教师定稿问题|唯一课堂答案|内部证据标签|
|---|---|---|---|
|Q02|为什么同时出现长安、洛阳两都？|两京制。隋文帝定都长安，隋炀帝迁都洛阳，将长安降为陪都。|needs-verification|
|Q03|义仓的功能及影响是什么？|功能：秋收后按收成缴纳粮食，饥荒时开仓赈灾。<br>影响：初期备荒救灾稳定社会，后期官办化、赋税化。|needs-verification|
|Q05|仓库、洛阳与运河为什么一起建设，怎样联系？|大运河连接经济与政治军事中心。|teacher-extension|
|Q16|民族/边疆关系与外交/对外关系怎样区分？|核心判断标准：现在中国有没有当前领土。|needs-verification|
|Q18|安史之乱的影响|中央集权削弱<br>边防空虚<br>唐朝由盛转衰<br>藩镇割据<br>严重破坏北方经济<br>经济重心开始南移|needs-verification|
|Q21|藩镇割据的影响|不利于中央集权<br>客观上延续了唐朝的统治|needs-verification|

R04唯一答案：核心判断标准：现在中国有没有当前领土。

Q05同时展示教师PNG；精简题的来源、审核说明保留数据字段与审计文档，不额外投射旧解释、卡片或图示。R01对应Q04、R02对应Q06、R03对应Q15、R04对应Q16。

## 2. 审核边界

|审核项|当前课堂表达与证据状态|仍需人工审定|
|---|---|---|
|A01 / Q02|教师定稿按原句展示；两都存在见PDF1/6印刷34页、PDF6/6印刷39页|迁都洛阳、长安降为陪都及制度时点未获本课教材直接证明；needs-verification|
|A02 / Q03|赈济用途有教材支持；“按收成”由本轮教师明确定稿|征粮口径、官办化赋税化及分期为教师拓展，未作外部核验|
|A03 / Q05|教师提供真实PNG已到位；一句话是课堂概括|图片不是原教材PDF插图；不以配图证明工程唯一动机|
|A04/A09 / Q06、Q18、R02|Q06四节点及审核状态原样保留；Q18末两条按教师定稿展示|北方经济受损范围、“开始南移”的断代与完成标准需跨课补证；不称六页教材已经证明|
|A07 / 地图|669年地图原件和四对象定位保留，Q14非活动|保留图例及702/713/726后置注记；定位框不是疆界，编图含义仍待核|
|A08 / Q16、R04|教师简化表述/有局限，待课堂审定|现代疆域不能充分判定古代民族/外交关系，不可推断唐直接治理今天中国全部区域|
|A10 / Q21|不利中央集权有教材支持；延续唐统治为待证教师解释|持续100多年不证明延续因果；需具体藩镇、时期及机制证据|


## 3. 教材与教师图片

- 教师原图 `assets/teacher/sui_canal_granary_map.png`：416×404，SHA-256 `5a0a0492417368bb290ebe702317f9b6f3ec0dbb8093ad3e26e29a048785591f`，Q05引用；非原教材PDF插图，原样使用，原“缺图”状态已解除。课标截图已存在。
- `assets/lesson/an-impact-crosspage-merged.png`：1160×370。来自PDF4—5/6、印刷37—38页；an-process.png裁框[0,0,1122,292]原像素置于[0,0]，an-impact.png完整[0,0,1160,70]置于[0,300]。仅去尾部白边，无缩放、无重写；“占”接下一行“领河西陇右地区。从此，唐朝由盛转衰。”原段落四行与续句完整。
- 原图PDF页内来源坐标仍见HEAD的textbook-assets.js原目录及当前an-process条目；完整派生坐标、尺寸与SHA见 `assets/lesson/fix01-derivatives.json`。`an-process--an-process`不变；只合并影响子目的两张图。
- `assets/lesson/tang-thinking-point.png`：530×217，从alliance.png的[430,35,960,252]原像素裁出，附在tang-relations--frontier教材正文后；无独立新页。保留“隋唐盛世形成的原因有哪些？”，不带会盟碑及图注。
- 32张原教材PNG、PDF、框架、讲稿、课标图共36个原件与HEAD逐字节或LFS oid比对通过；详情 `review/fix01/source-and-content-check.json`。


## 4. 非活动页面和问题

- `sui-prosper--granary`
- `sui-end--yangdi`
- `tang-relations--jiaohe`
- `tang-relations--tribute`
- `tang-relations--alliance`
- `tang-relations--ethnic-policy`
- `an-impact--army-source`
- `tang-end--five`
- `five--chairong`
- `an-impact--an-process`

非活动/教师要求移除：Q13、Q14、Q19、Q20及map-reading组。不得自动恢复；Q12、Q18、Q21各为所在组唯一题。删除的是课堂入口，原教材证据仍存。
另移除an-cause--an-cause讲解栏，其教材页保留。会盟碑旁思考点附回frontier，不恢复原独立页。Q23时间线中的柴荣内容不因删除独立片段而误删。

## 5. 当前目录及一致性

|子目|当前教材片段顺序（完整路由）|活动题组/题序|
|---|---|---|
|sui-found|sui-found--sui-found|无|
|sui-prosper|sui-prosper--sui-prosper|two-capitals: Q02；granaries: Q03；canal: Q04,Q05,Q06|
|sui-end|sui-end--sui-end → sui-end--sui-poem|goguryeo: Q07,Q08；sui-burden: Q09|
|tang-found|tang-found--tang-found|无|
|tang-prosper|tang-prosper--tang-zhenguan → tang-prosper--tang-prosper → tang-prosper--plough-text → tang-prosper--plough-image → tang-prosper--sancai|economy: Q11|
|tang-relations|tang-relations--turks-intro → tang-relations--turks → tang-relations--huihe → tang-relations--tubo → tang-relations--frontier → tang-relations--map-669|relations: Q12；perspectives: Q15；concepts: Q16|
|an-cause|an-cause--an-cause|无|
|an-process|an-process--an-process|无|
|an-impact|an-impact--an-impact → an-impact--fanzhen|impact: Q18；fanzhen-flow: Q21|
|tang-end|tang-end--huangchao|无|
|five|five--five → five--map-five|five-flow: Q23|

9条未授权更改的活动问题与修改前数据逐字段相同；Q04/Q06/Q15/Q23保留。课堂六模块及40分钟未变，板书键按有效题序生成。自动测试只证明文字符合指令和交互正常，不证明历史判断充分。

## 6. 教师复核重点

请审定A01两京制度、A02征粮与官办化、A04/A09南移断代、A08口诀适用范围、A10延续机制；检查合成图接句与思考点、运河原图图题。验收前不进入第七阶段。
