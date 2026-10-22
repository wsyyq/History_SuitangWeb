# 第七阶段测试矩阵

日期2026-10-22；Windows、Node24.19.0、Playwright驱动本机Edge155.0.4283.62（无头）。基准提交3dbdb7f56e87280286a8aed03a9ac1af696370ef。baseline与final均实际执行，未覆盖旧review目录。

|功能×页面|环境|结果|实际覆盖/证据|
|---|---|---|---|
|活动路由、菜单、问答源页、前后导航|离线file，1920×1080/1366×768/1280×720|Pass|216布局、36热点入口、80问答操作、34旧链接迁移；final/results.json|
|四模式、笔/橡皮/撤销/跨页/缩放|同上，合成鼠标|Pass|12压力循环、24次撤销、36往返；final/whiteboard-regression/test-results.json|
|运河教师图、合并图、长内容底部|DPR1/2，file|Pass|24色宽组合；最大图墨相对误差0.0001101像素；final/details-results.json|
|清空取消/确认/撤销|合成浏览器操作|Pass|final/details-results.json；不证明实体笔手感|
|品牌居中、44px触达、左侧控件、键盘/合成tap|三主横屏|Pass|final/ui-results.json；46受保护文件一致|
|短窗口控件遮挡|1024×576、853×480修复前|Fail|baseline/extended-results.json及截图|
|短窗口/1600、图墨定位及辅助面板|1600×900、960×600、1024×576、853×480修复后|Pass|final/extended-results.json；全部可触达|
|首页/课标/目录/模块/短长教材/地图/合并图/问答/回顾|三主尺寸及1600×900离线|Pass（截图与图片加载检查）|visual/results.json及44截图；不是逐像素全自动美观认证|
|本地项目子路径|/History_SuitangWeb/|Pass|59路由；final/details-results.json|
|资源相对路径、大小写、图片解码|本地源审计|Pass|46引用、36PNG解码；source-audit.json；HTMLParser及浏览器重复ID检查，不是W3C完整验证器|
|六模块串联、15题揭示、4回顾|1366×768离线|Pass|rehearsal/results.json；18.806秒快速回放|
|GitHub Pages公网首页|https://wsyyq.github.io/History_SuitangWeb/|Pass（有限范围）|online-results.json；首页及13依赖响应200，零脚本异常；12文本资源11项与本地一致，CSS含本地未部署修复故不同|
|公网全站与本轮CSS上线|真实公网|Not Tested|未部署；不能以本地子路径测试代替线上全部路线|
|实际125%/150%浏览器缩放|真实浏览器菜单缩放|Not Tested|小CSS视口仅作额外覆盖，不冒充该项|
|真实白板/触控笔/教室投影|教室设备|Not Tested|见课堂模拟报告人工表|
|教师真实40分钟及学生应答|真实课堂|Not Tested|不得以18.806秒自动回放判定通过|
|Safari/Firefox、其他操作系统|未具备环境|Not Tested|本轮仅Edge|

复现：安装本机可用Node和Playwright，设置NODE_PATH与BROWSER_EXECUTABLE指向实际环境。先运行 `node tools/run_stage7.cjs`，再运行 `check_stage7_extended.cjs`、`check_stage7_rehearsal.cjs`、`check_stage7_visual.cjs`、`check_stage7_online.cjs`（均在tools目录）；源审计用 `python tools/audit_stage7_sources.py`。默认写final，修复前基线由STAGE7_RUN=baseline产生，勿为重测覆盖历史基线。具体命令、时间和退出码见final/run.json。某些复用日志的固定“未测公网”字样仅指该子套件，独立公网结果以上述online证据为准；results.json的before/after高度对比是早期FIX01参考值，不能当成本轮修复前后差异。
