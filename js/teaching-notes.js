/* Stage 5: concise reading anchors below the unchanged textbook images. */
(()=>{
  const p34='教材 PDF 1/6｜印刷第34页｜隋朝兴亡',p35='教材 PDF 2/6｜印刷第35页｜唐朝的繁荣与民族交融';
  const fact=(title,text)=>({title,text,evidenceType:'textbook-supported'});
  const extension=(title,text)=>({title,text,evidenceType:'teacher-extension'});
  const notes={
    'sui-found--sui-found':{title:'建立与统一：分清两个时间',sourceRef:p34,blocks:[
      fact('581年 · 杨坚建隋','北周外戚杨坚代周称帝，改国号隋，定都长安，是为隋文帝。励精图治、实行改革，国力日强。'),
      fact('589年 · 灭陈统一','隋文帝派次子杨广率军灭陈，结束南北长期分裂。文帝死后杨广即位，是为隋炀帝。')]},
    'sui-prosper--sui-prosper':{title:'兴盛的三个观察点',sourceRef:p34+'正文与大运河导入',blocks:[
      fact('仓储','两都及地方广设仓库；供应朝廷粮物，义仓备水旱赈济。'),
      fact('洛阳','隋炀帝兴建洛阳城，规模宏大。'),
      fact('大运河','南北贯通、沟通五大水系；巩固统一，促进南北经济交流和沿岸城市发展。')]},
    'sui-end--sui-end':{title:'隋亡主线：负担、生产与反抗',sourceRef:p34+'；'+p35,blocks:[
      fact('负担与起义','大兴土木、穷奢极欲、三次大举征伐（教材称“高丽”）→生产遭到严重破坏、民不聊生→大规模起义。'),
      fact('618年 · 隋朝灭亡','隋炀帝在江都被部将杀死。李渊建唐是同年的另一事件，不能混作同一政权。')]},
    'sui-end--sui-poem':{title:'读诗：功效与负担分开评价',sourceRef:'教材 PDF 1/6｜印刷第34页｜皮日休《汴河怀古二首》及隋朝兴亡',blocks:[
      extension('材料讨论','结合诗歌与正文，分别讨论运河的长期功效、统治者奢侈用度与民力负担。诗歌是评价材料，不能单独证明修河动机。'),
      extension('历史启示','国家工程需要顾及社会承受能力；不能把修运河说成隋亡唯一原因。')]},
    'tang-found--tang-found':{title:'唐朝建立与随后统一',sourceRef:p35,blocks:[
      fact('618年 · 李渊 · 长安','李渊在长安称帝，建立唐朝，是为唐高祖。'),
      fact('随后 · 逐渐统一','唐军逐渐消灭各支起义军和割据势力，统一全国；建唐不等于当日已经完成统一。')]},
    'tang-prosper--tang-zhenguan':{title:'唐太宗：吸取隋亡教训',sourceRef:p35,blocks:[
      fact('治理措施','李世民轻徭薄赋、劝课农桑、戒奢从简、知人善任、虚怀纳谏。'),
      fact('贞观之治','统治时期出现开明政治局面。与唐玄宗时期的开元盛世相区别。')]},
    'tang-prosper--tang-prosper':{title:'走向盛世的三个教学阶段',sourceRef:p35,blocks:[
      fact('唐太宗 · 贞观之治','吸取隋亡教训，轻徭薄赋、劝课农桑，戒奢从简、知人善任、虚怀纳谏。'),
      fact('武则天当权时期','唐高宗时参与朝政，后废唐称帝、改国号周。当权期间社会经济持续发展。'),
      fact('唐玄宗 · 开元盛世','李隆基选贤任能、改革吏治、发展生产、大兴文治、改革兵制，将唐朝推向全盛。')],note:'课堂概括：“承上启下”指发展线索，不把武周与唐朝混成同一朝号；兵制细节仍待补证。'},
    'tang-prosper--plough-text':{title:'曲辕犁：三项改进',sourceRef:'教材 PDF 2/6｜印刷第35页｜历史纵横·唐朝曲辕犁',blocks:[
      fact('短曲辕','由长直辕改为轻便的短曲辕。'),fact('犁评','加装犁评，调节耕作深浅。'),fact('犁壁','改进犁壁；这种犁在江南水田推广，耕犁基本定型。')]},
    'tang-prosper--plough-image':{title:'观察牛耕图：图像与传播范围要区分',sourceRef:'教材 PDF 2/6｜印刷第35页｜敦煌莫高窟壁画唐朝牛耕图中的曲辕犁',blocks:[
      fact('配图定位','图题明确为“敦煌莫高窟壁画唐朝牛耕图中的曲辕犁”；结合旁栏三项改进观察农具。'),
      extension('证据边界','壁画所在地不能单独证明技术起源或实际推广范围；不据此推定敦煌为曲辕犁发源地。')]},
    'tang-prosper--sancai':{title:'唐三彩盘：观察工艺',sourceRef:'教材 PDF 2/6｜印刷第35页｜唐三彩盘图注',blocks:[
      fact('器物信息','出土于陕西乾县唐永泰公主墓；该盘釉色绿、褐、白相间，兼具图案规律与釉色自然流动的特点。'),
      extension('经济门类','可归入手工业中的陶瓷工艺与装饰技术。该盘的三色不是全部唐三彩颜色的严格定义，也不能由一件文物推算贸易规模。')]}
  };
  for(const note of Object.values(notes))note.contentVersion='stage5';
  window.LESSON.teachingNotes=notes;
})();
