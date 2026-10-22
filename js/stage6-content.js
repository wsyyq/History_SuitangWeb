/* Scoped stage 6 additions. No network, route changes, or stage 5 replacements. */
(()=>{
  const L=window.LESSON;
  const p36='教材 PDF 3/6｜印刷第36页',p37='教材 PDF 4/6｜印刷第37页',p38='教材 PDF 5/6｜印刷第38页';
  const block=(title,text,evidenceType='textbook-supported')=>({title,text,evidenceType});
  const chain={title:'因果关系示意 · 教师据教材整理（不是单因决定论）',nodes:[
    block('三类背景','边疆形势紧张；军镇增设、节度使兵力扩大，外重内轻；玄宗后期朝政腐败。'),
    block('755年起 · 历时八年','安禄山在范阳起兵，与史思明发动叛乱，后被唐平定。'),
    block('平叛与盛衰转折','将领拥兵自重，中央集权削弱；边防空虚；唐由盛转衰。'),
    block('期间及以后 · 部分藩镇割据','内地增设藩镇，有些独立性强；割据持续100多年，严重削弱统治力量。'),
    block('长期政治格局','上述变化是理解唐末衰败及五代十国分裂的重要线索之一，并非唯一原因。','teacher-extension')],sourceRef:p37+'原因、过程；'+p38+'影响、藩镇与五代十国'};
  const endTimeline={title:'唐末至五代十国 · 教材事件与课堂时序整理',nodes:[
    block('875年 · 黄巢起义','起义军一度攻占长安，沉重打击唐朝统治。'),
    block('朱温降唐 · 逐渐掌权','由起义军将领降唐，任节度使，与其他藩镇镇压起义，逐渐控制政权。'),
    block('907年 · 废唐建梁','朱温废唐称帝，建梁，史称后梁；唐朝灭亡。'),
    block('五代相继更替','后梁 → 后唐 → 后晋 → 后汉 → 后周；十国为南方先后九个政权加北汉。'),
    block('后周世宗柴荣','清除弊政、增强实力，为后来北宋结束分裂奠定基础。')],sourceRef:p38+'黄巢、五代十国及柴荣段'};
  const additions={
    Q12:{answer:'突厥：战争、联合行动；唐在西域设置安西、北庭都护府。\n回纥：合作、册封首领。\n吐蕃：和亲、会盟。\n靺鞨粟末部：册封首领。',explanation:'唐太宗反击东突厥，被草原各族尊为“天可汗”；唐高宗联合回纥灭西突厥。682年后突厥建立，744年唐与回纥等联手平定。玄宗册封骨力裴罗为怀仁可汗、大祚荣为渤海郡王。周边民族政权为边疆开发作出积极贡献。',contentStatus:'textbook-supported',sourceRef:p36+'突厥正文、回纥栏、吐蕃段；'+p37+'靺鞨与边疆开发',reviewNote:'这些事件跨越不同时期，不都发生在669年；一种交往方式不等于永久关系，设置都护府也不等于直接管辖图中所有周边政权。'},
    Q13:{answer:'和亲：唐太宗将文成公主嫁给松赞干布，促进汉藏友好关系和经济文化交流。\n交流：带去手工艺品、多种技术和医药书籍。\n会盟：9世纪前期唐蕃会盟，此后基本停止纷争。',explanation:'先定位吐蕃，再以和亲、会盟两种方式观察交往。会盟碑是唐穆宗时长庆会盟的遗物，和亲与会盟不是同一次事件。',contentStatus:'textbook-supported',sourceRef:p36+'吐蕃段续'+p37+'首段及唐蕃会盟碑图注',reviewNote:'“基本停止纷争”不等于从此永无冲突；不能由和亲推出唐直接统治吐蕃全境。'},
    Q14:{answer:'先核对图题、669年、图例及各处注记，再区分族群分布称谓与具体汗国政权。\n图中保留东、西突厥字样，还注有北庭702年、渤海713年、黑水726年置。',explanation:'这幅图兼有形势与边疆各族分布信息，不能把所有标注读成669年同时存在的政权或机构。仅凭一处族名不能判定同名汗国仍在，也不足以宣布教材错误。',contentStatus:'needs-verification',sourceRef:p37+'《唐朝前期形势和边疆各族分布图（669年）》；'+p36+'突厥正文；审核A07',reviewNote:'具体编图意图、标签性质和疆界解释仍需编图说明或可靠补证；讲稿的630、657年及新版地图对比未在本课资料中核准。'},
    Q15:{answer:'一方 → 另一方 → 双方关系 → 其他相关因素（有材料时）。\n角度用于组织思路，每项结论仍须史实支持，不必凑齐四项。',explanation:'例：唐与吐蕃。吐蕃方面可找工艺、技术、书籍交流；双方可谈友好和经济文化交流。唐朝治理稳定是有条件的分析角度，不能直接冒充本段结论。迁移到甲午题，只提出中国、日本、双方关系、其他国家的观察问题，不用本课教材编写近代史答案。',contentStatus:'teacher-extension',sourceRef:'教师框架·唐/民族2及讲稿“一方、另一方”；'+p36+'—'+p37+'仅支持唐蕃交流例证；审核A16',reviewNote:'其他因素须题目涉及且有证据；甲午与1931不是同一事件，方法不能替代史实。'},
    Q16:{answer:'先看时代、交往主体、当时管辖与交往方式，再看教材和题目的叙述框架。\n现代疆域可辅助定位，不能直接倒推古代管辖或无条件认定为现代“内政”。',explanation:'本课在民族交融与边疆开发框架下讨论唐与吐蕃；这不等于唐直接治理吐蕃全境。近代中国与日本可作对外关系的对比，具体判断仍依历史语境。',contentStatus:'teacher-extension',sourceRef:'教师框架·唐/民族3、讲稿及MX-T06第4.4节的必要限缩；'+p36+'《职贡图》图注；'+p37+'边疆开发；审核A08',reviewNote:'反例：“今天属于中国，所以唐朝必然直接治理”不成立。保留分类训练目标，取消仅凭现代国界判题的绝对口诀。'},
    Q18:{answer:'中央集权：平叛将领拥兵自重，中央集权被削弱。\n边防：边防空虚，吐蕃趁机占领河西、陇右。\n盛衰：唐朝由盛转衰。',explanation:'课堂概念提示：中央集权侧重中央与地方权力关系；君主专制侧重皇权决策与政治权力配置。依题目材料辨析，不用“只要干扰皇帝就只能选君主专制”的绝对规则。',contentStatus:'textbook-supported',sourceRef:p37+'安史之乱段跨页续'+p38+'首句；概念提示来自教师讲稿；审核A16',reviewNote:'图示将教材事实按教学顺序连接，不把每条背景当成单独必然导致叛乱的原因。',sequence:chain},
    Q19:{answer:'可沿“北方战乱 → 人口迁移与南方开发 → 经济格局逐步变化”提出纵向复习问题。\n这一讲解链还需跨课教材或史料支持，不能把安史之乱定为南移瞬时开始或完成的唯一原因。',explanation:'本课37—38页直接支持战争、政治影响与盛衰转折，没有完整证明人口迁移规模和经济重心南移分期。与隋兴盛Q06保持同一证据口径。',contentStatus:'needs-verification',sourceRef:'教师框架·安史/影响1及讲稿；'+p37+'—'+p38+'为战争背景，不是完整南移论证；审核A04/A09',reviewNote:'北方经济受损程度、迁徙范围、各阶段开始和完成标准仍待补证。保留长期过程思路，不填未经核实的断代。',diagram:{title:'课堂拓展 · 待跨课核验的关系示意',nodes:['北方战乱','人口迁移 / 南方开发','经济格局逐步变化']}},
    Q20:{answer:'不是一回事。安史之乱是叛乱事件；设置藩镇是军事与地方管理安排；部分藩镇独立性很强，形成割据局面。\n教材写的是“有些”，不是所有藩镇都割据。',explanation:'安史之乱期间和以后，内地陆续增设藩镇。可概括为战乱推动割据局面形成，但不同地区与时期的中央—地方关系并不相同。',contentStatus:'textbook-supported',sourceRef:p38+'藩镇段与《新唐书·兵志》史料阅读',reviewNote:'不能把安史之乱、藩镇设置、藩镇割据画等号，也不能说所有藩镇同年同时割据。'},
    Q21:{answer:'教材结论：藩镇割据持续100多年，严重削弱唐朝统治力量，不利于中央对地方的控制。\n“不同藩镇相互制约而延续唐统治”是待证的有条件解释，不能由持续时间直接推出因果。',explanation:'开放讨论可比较地方势力差异、中央与地方互动和彼此制约，需要具体案例与时段。没有补证时，不把“割据延续统治”作为单一标准结论。',contentStatus:'textbook-supported',sourceRef:p38+'藩镇段、史料阅读；教师框架·安史/影响2；审核A10',reviewNote:'教材支持削弱统治；延续机制仍待史学证据。不能写成割据加强中央集权或所有藩镇主动维护唐朝。'},
    Q23:{answer:'五代：黄河流域先后出现后梁、后唐、后晋、后汉、后周。后唐都洛阳，其余四代都开封。\n十国：南方先后九个割据政权，加五代末期在山西建立的北汉。',explanation:'课堂历史归纳：五代十国分裂局面承续并演变了唐末藩镇割据格局，不是毫无变化的等号。后周世宗柴荣清除弊政、增强实力，为北宋结束分裂奠定基础。',contentStatus:'textbook-supported',sourceRef:p38+'五代十国段、柴荣段、《五代十国形势图（后周时期）》；审核A15',reviewNote:'地图是后周时点，不是十国同时存在的全景；建立者身份与具体延续机制不作无证扩写。',sequence:endTimeline}
  };
  for(const g of Object.values(L.flows)){
    for(const q of g.items)if(additions[q.questionId])Object.assign(q,additions[q.questionId],{contentVersion:'stage6',evidenceType:additions[q.questionId].contentStatus,sourceRef:additions[q.questionId].sourceRef+'；question-bank.md · '+q.questionId});
    if(g.items.some(q=>q.contentVersion==='stage6'))g.contentStatus='stage6-populated';
  }
  const notes=L.teachingNotes;
  const note=(title,blocks,sourceRef,extra={})=>({title,blocks,sourceRef,contentVersion:'stage6',...extra});
  notes['tang-relations--turks-intro']=note('突厥：从兴起到分裂',[block('衔接下一片','突厥兴起于阿尔泰山地区，建立政权，后分为东、西突厥。下一片继续读唐朝的战争、联合行动与西域管理。')],'教材 PDF 2/6｜印刷第35页末段；'+p36+'首段');
  notes['tang-relations--turks']=note('突厥与西域管理',[block('战争与合作','唐太宗反击东突厥；草原各族尊奉其为“天可汗”。唐高宗联合回纥灭西突厥。'),block('设置管理机构','先后设安西、北庭都护府，统辖天山南北，加强西域管理。'),block('时序要分清','682年后突厥建立；744年唐与回纥、葛逻禄等联手平定。')],p36+'突厥正文',{note:'这是跨时期的交往线索，不能全归入669年，更不能推定唐直接统治所有周边政权。'});
  notes['tang-relations--huihe']=note('回纥、回鹘与交融',[block('合作与册封','回纥与唐合作；唐玄宗册封骨力裴罗为怀仁可汗。后来改称回鹘。'),block('迁徙与融合','9世纪回鹘政权瓦解，部分迁入内地，大部分西迁河西走廊和西域，与当地居民融合。教材称隋唐回纥人为维吾尔族先民的主体。')],p36+'历史纵横·回纥',{note:'历史演变不等于名称、政权与现代族群完全不变的简单等号。'});
  notes['tang-relations--tubo']=note('吐蕃：和亲与交流',[block('人物与方式','7世纪前期，松赞干布统一青藏高原；唐太宗以文成公主和亲。'),block('影响与后续','手工艺品、技术、医药书籍交流促进汉藏友好。9世纪前期会盟的结尾须接读下一页。')],p36+'吐蕃段续'+p37+'首段');
  notes['tang-relations--frontier']=note('会盟、册封与边疆开发',[block('吐蕃 · 会盟','9世纪前期唐蕃会盟，此后基本停止纷争。'),block('靺鞨粟末部 · 册封','唐玄宗封大祚荣为渤海郡王。'),block('区域开发','周边少数民族建立的政权对边疆地区开发作出积极贡献。')],p37+'首部三段');
  notes['tang-relations--alliance']=note('会盟碑：联系时代与关系',[block('长庆会盟','会盟碑位于拉萨大昭寺门前，是唐穆宗时唐与吐蕃会盟的遗物。'),block('解读边界','会盟与和亲不是同一事件；“基本停止纷争”不等于没有任何冲突。','teacher-extension')],p37+'唐蕃会盟碑图注及首段');
  notes['tang-relations--tribute']=note('《职贡图》：两类来访主体',[block('图注提供的信息','教材称此图传为阎立本所作，既有外国使节，也有边远少数民族使臣。'),block('辨析提示','不能仅凭“来贡”就判定政治管辖；须结合具体主体、时代与实际关系。','teacher-extension')],p36+'《职贡图》图注；审核A08');
  notes['tang-relations--jiaohe']=note('交河与西域管理',[block('教材定位','交河位于吐鲁番西10余千米，安西都护府曾设于此。'),block('证据边界','管理机构的具体设置有时空范围，不可外推为唐对整幅地图各政权的直接管辖。','teacher-extension')],p36+'交河故城图注');
  notes['an-cause--an-cause']=note('安史之乱：三类背景',[...chain.nodes.slice(0,1)],p37+'原因段',{sequence:chain,note:'讲稿中的中央与边镇兵力数字未核准，不作为确定结论。'});
  notes['an-process--an-process']=note('755年起兵，历时八年',[block('人物与地点','身兼三镇节度使的安禄山在范阳起兵，与部将史思明发动叛乱。'),block('结束与转折','叛乱历时八年，后被唐平定；影响跨页接读第38页。')],p37+'过程段',{note:'沿用教材“历时八年”，不凭推算补写精确结束年份或皇帝行程。'});
  notes['an-impact--an-process']=note('跨页阅读：从平叛到影响',[...chain.nodes.slice(2,3)],p37+'末段续'+p38+'首句');
  notes['an-impact--an-impact']=note('安史之乱的影响',[...chain.nodes.slice(2,4)],p37+'—'+p38+'跨页正文',{sequence:chain});
  notes['an-impact--fanzhen']=note('藩镇不等于割据',[block('范围与影响','有些藩镇独立性强，形成割据局面；持续100多年，严重削弱唐朝统治。'),block('讨论边界','不同藩镇互相制约而延续统治是待证解释，不能从“持续100多年”直接推出因果。','needs-verification')],p38+'藩镇段；审核A10');
  notes['an-impact--army-source']=note('史料阅读：地方与中央',[block('提取现象','教材所引《新唐书·兵志》描述兵骄逐帅、帅强叛上及号令自出。'),block('解释方向','据材料讨论中央难以控制地方；不把它当作“割据有利于中央集权”的证据。','teacher-extension')],p38+'史料阅读·《新唐书·兵志》');
  const endNote=note('黄巢与朱温：打击统治和政治终结',[block('背景与起义','唐后期宦官专权、朋党之争加剧。875年黄巢起义，一度攻占长安，沉重打击统治。'),block('谁在907年废唐？','朱温先降唐任节度使，联合藩镇镇压起义并逐渐掌权；907年废唐建后梁。黄巢没有建立后梁。')],p38+'黄巢起义至五代十国段',{sequence:endTimeline});
  notes['tang-end--huangchao']=endNote;
  notes['tang-end--five']=note('907年以后：衔接五代十国',[block('政治终结','907年朱温废唐建后梁；起义打击、逐渐掌权与最后废唐应分层理解。')],p38+'正文',{sequence:endTimeline});
  notes['five--five']=note('五代十国：顺序与构成',[block('五代','后梁、后唐、后晋、后汉、后周。后唐都洛阳，其余都开封。'),block('十国','南方先后九个割据政权，加山西的北汉；不是南方十国，也不都同时存在。'),block('课堂历史归纳','唐末藩镇割据局面的延续与演变，不是完全不变的等号。','teacher-extension')],p38+'五代十国段',{sequence:endTimeline});
  notes['five--chairong']=note('后周世宗柴荣',[block('清除弊政、增强实力','为后来北宋结束五代十国分裂局面奠定基础；不提前展开宋史。')],p38+'柴荣段');
  notes['five--map-five']=note('后周时点，不是十国全同期',[block('先读图题与注记','图为后周时期，标951—960年，并有“951年，南唐灭楚”注记。'),block('结合正文看构成','正文的十国是南方先后九政权加北汉，不能只数这一个时点的图上政权。','teacher-extension')],p38+'《五代十国形势图（后周时期）》与正文');
  const q04=L.flows.canal.items[0],q06=L.flows.canal.items[2];
  const reviewData=[
    {answer:q04.answer,contentStatus:'textbook-supported',sourceRef:'教材 PDF 1/6｜印刷第34页；Q04',reviewNote:'文化交流为课堂拓展；按题目材料选角度。'},
    {answer:q06.timeline.map(b=>b.title+'：'+b.text).join('\n'),contentStatus:'needs-verification',sourceRef:'教师框架四节点；Q06/Q19；本课六页无完整断代依据',reviewNote:'跨课知识复习：分期需核对。安史、靖康不是瞬时完成南移的时点。'},
    {answer:'一方 → 另一方 → 双方关系 → 其他相关因素（有材料时）。\n先找角度，再用史实证明；不强凑四点。',contentStatus:'teacher-extension',sourceRef:'教师框架·内容回顾3；Q15；唐蕃例证见教材 PDF 3—4/6｜印刷36—37页',reviewNote:'方法不能替代历史证据。'},
    {answer:additions.Q16.answer,contentStatus:'teacher-extension',sourceRef:'教师框架·内容回顾4及MX-T06第4.4节；Q16；教材 PDF 3—4/6｜印刷36—37页',reviewNote:'现代地图辅助定位，不能直接证明古代管辖。'}
  ];
  L.reviewItems=L.reviewItems.map((q,i)=>({...q,...reviewData[i],contentVersion:'stage6',evidenceType:reviewData[i].contentStatus}));
  // Natural-image pixels on the unchanged 1696 × 894 crop; boxes locate labels, not territories.
  L.map669={width:1696,height:894,sourceRef:p37+'669年图；交往事实见'+p36+'—'+p37,objects:[
    {id:'turks',name:'突厥',position:'西部“西突厥”及北部“东突厥”字样',boxes:[[205,215,260,125],[605,275,180,105]],text:'战争、联合行动；在西域设置安西、北庭都护府。事件跨时期，不能视为669年同时发生。'},
    {id:'huihe',name:'回纥',position:'北部“回纥”字样，安北都护府附近',boxes:[[610,151,70,125]],text:'与唐合作；玄宗册封骨力裴罗为怀仁可汗。后改称回鹘，迁徙与融合不能简化为政权始终不变。'},
    {id:'tubo',name:'吐蕃',position:'西南“吐蕃”字样，逻些以北',boxes:[[413,482,167,59]],text:'唐太宗以文成公主和亲；9世纪前期会盟。促进友好与经济文化交流，不等于唐直接管辖吐蕃全境。'},
    {id:'mohe',name:'靺鞨／粟末',position:'东北靺鞨字样及粟末部位置',boxes:[[970,88,150,216]],text:'唐玄宗册封粟末部首领大祚荣为渤海郡王。注意图上渤海713年、黑水726年的后置注记。'}
  ]};
})();
