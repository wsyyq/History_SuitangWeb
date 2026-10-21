/* Stable curriculum model. No historical answers are populated in stage 2. */
(() => {
  const modules = [
    {id:'standards',title:'课标研读',eyebrow:'明晰目标',description:'从课程要求出发，把握本课学习线索。',sections:[]},
    {id:'sui',title:'隋',eyebrow:'统一与兴亡',description:'建立、兴盛与灭亡，读懂盛极一时的隋朝。',sections:['sui-found','sui-prosper','sui-end']},
    {id:'tang',title:'唐',eyebrow:'盛世与交融',description:'从繁荣景象走向民族关系与区域开发。',sections:['tang-found','tang-prosper','tang-relations']},
    {id:'anshi',title:'安史之乱',eyebrow:'盛衰的转折',description:'梳理原因、过程与影响，辨析藩镇割据。',sections:['an-cause','an-process','an-impact']},
    {id:'fall',title:'唐的灭亡',eyebrow:'王朝与分合',description:'黄巢起义、朱温废唐与五代十国。',sections:['tang-end','five']},
    {id:'review',title:'内容回顾',eyebrow:'回望与贯通',description:'回到四个问题，整理本课的思考方法。',sections:[]}
  ];
  const defs = [
    ['sui-found','建立','sui',['sui-found'],[]],
    ['sui-prosper','兴盛','sui',['sui-prosper','granary'],['two-capitals','granaries','canal']],
    ['sui-end','灭亡','sui',['sui-end','sui-poem','yangdi'],['goguryeo','sui-burden']],
    ['tang-found','建立','tang',['tang-found'],[]],
    ['tang-prosper','繁荣与盛世表现','tang',['tang-zhenguan','tang-prosper','plough-text','plough-image','sancai'],['economy']],
    ['tang-relations','民族关系与区域开发','tang',['turks-intro','turks','huihe','jiaohe','tribute','tubo','frontier','alliance','map-669','ethnic-policy'],['relations','map-reading','perspectives','concepts']],
    ['an-cause','原因','anshi',['an-cause'],[]],
    ['an-process','过程','anshi',['an-process'],[]],
    ['an-impact','影响','anshi',['an-process','an-impact','fanzhen','army-source'],['impact','fanzhen-flow']],
    ['tang-end','黄巢起义与朱温废唐称帝','fall',['huangchao','five'],[]],
    ['five','五代十国','fall',['five','chairong','map-five'],['five-flow']]
  ];
  const sections=Object.fromEntries(defs.map(([id,title,module,assets,flows])=>[id,{id,title,module,assets,flows}]));
  const flowDefs=[
    ['two-capitals','长安、洛阳与两京制',['Q02'],['A01']],
    ['granaries','义仓的含义与制度演变',['Q03'],['A02']],
    ['canal','大运河：作用、联系与经济重心',['Q04','Q05','Q06'],['A03','A04']],
    ['goguryeo','高句丽、高丽与征伐背景',['Q07','Q08'],['A05','A06']],
    ['sui-burden','隋亡：建设与民力负担',['Q09'],['A12','A13']],
    ['economy','曲辕犁与唐三彩',['Q11'],['A14']],
    ['relations','民族关系的处理方式',['Q12','Q13'],[]],
    ['map-reading','669年地图的阅读与辨析',['Q14'],['A07']],
    ['perspectives','两者关系题的四个视角',['Q15'],['A16']],
    ['concepts','民族边疆与对外外交关系',['Q16'],['A08']],
    ['impact','安史之乱的影响',['Q18','Q19'],['A09','A16']],
    ['fanzhen-flow','藩镇割据与唐朝统治',['Q20','Q21'],['A10']],
    ['five-flow','五代十国与唐末藩镇',['Q23'],['A15']]
  ];
  const flows=Object.fromEntries(flowDefs.map(([id,title,qids,audits])=>[id,{id,title,qids,audits,status:'placeholder',questionIndex:null,revealState:'unpopulated'}]));
  const reviews=['修路、修运河作用','经济重心南移阶段','如何回答两者之间的关系类问题','如何区分民族边疆关系与对外外交关系'];
  window.LESSON={modules,sections,flows,reviews,interactionMode:'select',futureModes:['move','zoom','select','draw']};
})();
