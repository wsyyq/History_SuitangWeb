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
    Q15:{answer:'一方 → 另一方 → 双方关系 → 其他相关因素（有材料时）。\n角度用于组织思路，每项结论仍须史实支持，不必凑齐四项。',explanation:'例：唐与吐蕃。吐蕃方面可找工艺、技术、书籍交流；双方可谈友好和经济文化交流。唐朝治理稳定是有条件的分析角度，不能直接冒充本段结论。迁移到甲午题，只提出中国、日本、双方关系、其他国家的观察问题，不用本课教材编写近代史答案。',contentStatus:'teacher-extension',sourceRef:'教师框架·唐/民族2及讲稿“一方、另一方”；'+p36+'—'+p37+'仅支持唐蕃交流例证；审核A16',reviewNote:'其他因素须题目涉及且有证据；甲午与1931不是同一事件，方法不能替代史实。'},
    Q16:{"answer": "核心判断标准：现在中国有没有当前领土。", "compact": true, "contentStatus": "needs-verification", "sourceRef": "教师 MX-FIX01 定稿；教材 PDF 4—5/6｜印刷37—38页及教师讲稿；审核 A08", "reviewNote": "教师简化口诀，有局限，待课堂审定；现代疆域不等于古代直接管辖。"},
    Q18:{"answer": "中央集权削弱\n边防空虚\n唐朝由盛转衰\n藩镇割据\n严重破坏北方经济\n经济重心开始南移", "compact": true, "contentStatus": "needs-verification", "sourceRef": "教师 MX-FIX01 定稿；教材 PDF 4—5/6｜印刷37—38页及教师讲稿；审核 A04/A09", "reviewNote": "前四条教材支持；北方经济受损与南移开始的断代需跨课核验。", "prompt": "安史之乱的影响"},
    Q21:{"answer": "不利于中央集权\n客观上延续了唐朝的统治", "compact": true, "contentStatus": "needs-verification", "sourceRef": "教师 MX-FIX01 定稿；教材 PDF 4—5/6｜印刷37—38页及教师讲稿；审核 A10", "reviewNote": "削弱中央控制有教材支持；延续唐统治机制属待证教师解释。", "prompt": "藩镇割据的影响"},
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
  notes['an-process--an-process']=note('755年起兵，历时八年',[block('人物与地点','身兼三镇节度使的安禄山在范阳起兵，与部将史思明发动叛乱。'),block('结束与转折','叛乱历时八年，后被唐平定；影响跨页接读第38页。')],p37+'过程段',{note:'沿用教材“历时八年”，不凭推算补写精确结束年份或皇帝行程。'});
  notes['an-impact--an-impact']=note('安史之乱的影响',[...chain.nodes.slice(2,4)],p37+'—'+p38+'跨页正文',{sequence:chain});
  notes['an-impact--fanzhen']=note('藩镇不等于割据',[block('范围与影响','有些藩镇独立性强，形成割据局面；持续100多年，严重削弱唐朝统治。'),block('讨论边界','不同藩镇互相制约而延续统治是待证解释，不能从“持续100多年”直接推出因果。','needs-verification')],p38+'藩镇段；审核A10');
  const endNote=note('黄巢与朱温：打击统治和政治终结',[block('背景与起义','唐后期宦官专权、朋党之争加剧。875年黄巢起义，一度攻占长安，沉重打击统治。'),block('谁在907年废唐？','朱温先降唐任节度使，联合藩镇镇压起义并逐渐掌权；907年废唐建后梁。黄巢没有建立后梁。')],p38+'黄巢起义至五代十国段',{sequence:endTimeline});
  notes['tang-end--huangchao']=endNote;
  notes['five--five']=note('五代十国：顺序与构成',[block('五代','后梁、后唐、后晋、后汉、后周。后唐都洛阳，其余都开封。'),block('十国','南方先后九个割据政权，加山西的北汉；不是南方十国，也不都同时存在。'),block('课堂历史归纳','唐末藩镇割据局面的延续与演变，不是完全不变的等号。','teacher-extension')],p38+'五代十国段',{sequence:endTimeline});
  notes['five--map-five']=note('后周时点，不是十国全同期',[block('先读图题与注记','图为后周时期，标951—960年，并有“951年，南唐灭楚”注记。'),block('结合正文看构成','正文的十国是南方先后九政权加北汉，不能只数这一个时点的图上政权。','teacher-extension')],p38+'《五代十国形势图（后周时期）》与正文');
  const q04=L.flows.canal.items[0],q06=L.flows.canal.items[2];
  const reviewData=[
    {answer:q04.answer,contentStatus:'textbook-supported',sourceRef:'教材 PDF 1/6｜印刷第34页；Q04',reviewNote:'文化交流为课堂拓展；按题目材料选角度。'},
    {answer:q06.timeline.map(b=>b.title+'：'+b.text).join('\n'),contentStatus:'needs-verification',sourceRef:'教师框架四节点；Q06；本课六页无完整断代依据',reviewNote:'跨课知识复习：分期需核对。安史、靖康不是瞬时完成南移的时点。'},
    {answer:'一方 → 另一方 → 双方关系 → 其他相关因素（有材料时）。\n先找角度，再用史实证明；不强凑四点。',contentStatus:'teacher-extension',sourceRef:'教师框架·内容回顾3；Q15；唐蕃例证见教材 PDF 3—4/6｜印刷36—37页',reviewNote:'方法不能替代历史证据。'},
    {answer:additions.Q16.answer,compact:true,contentStatus:'needs-verification',sourceRef:'教师MX-FIX01定稿·内容回顾4；Q16；教材 PDF 3—4/6｜印刷36—37页为背景，不证明现代国界通则',reviewNote:'教师简化表述/有局限，待课堂审定；详见MX_FIX01_CONTENT_AUDIT.md。'}
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
