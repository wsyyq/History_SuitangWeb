/* Stage 4: teacher question prompts only; all historical answers remain pending. */
(()=>{
  const bank={
  "Q02": {
    "questionId": "Q02",
    "prompt": "为什么同时出现长安、洛阳两都？什么是“两京制”？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q02；框架·隋/兴盛1；讲稿“两京制”；PDF p1/6（教材34页）T34-C、p6/6（教材39页）T39-A；A01"
  },
  "Q03": {
    "questionId": "Q03",
    "prompt": "义仓是什么、起什么作用、后来怎样变化？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q03；框架·隋/兴盛2；PDF p1/6（教材34页）T34-C、p6/6（教材39页）T39-A；A02"
  },
  "Q04": {
    "questionId": "Q04",
    "prompt": "修大运河或修路有什么政治、经济、文化作用？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q04；框架·隋/兴盛3；讲稿“修路的好处”；PDF p1/6（教材34页）T34-A/C；A03"
  },
  "Q05": {
    "questionId": "Q05",
    "prompt": "仓库、洛阳与运河为什么一起建设，怎样联系？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q05；框架·隋/兴盛3；讲稿“这是他的大体的规划”；PDF p1/6（教材34页）T34-C、p6/6（教材39页）T39-A；A03"
  },
  "Q06": {
    "questionId": "Q06",
    "prompt": "经济重心南移经历了哪些阶段？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q06；框架·隋/兴盛3；讲稿“经济重心什么时候开始南移”；本课六页无完整依据；A04、A09"
  },
  "Q07": {
    "questionId": "Q07",
    "prompt": "高句丽与高丽如何区分？教材“征伐高丽”如何读？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q07；框架·隋/灭亡；讲稿“高句丽和高丽有什么区别”；PDF p1/6（教材34页）T34-D；A05"
  },
  "Q08": {
    "questionId": "Q08",
    "prompt": "征伐是否为了防止突厥与高句丽联合？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q08；框架·隋/灭亡；讲稿“让这两个政权连接起来”；PDF p1/6（教材34页）T34-D仅载征伐；A06"
  },
  "Q09": {
    "questionId": "Q09",
    "prompt": "隋朝富强为何仍灭亡？建设如何影响生产？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q09；讲稿“国富而不与民共享”；PDF p1/6（教材34页）T34-D/E、p6/6（教材39页）T39-A/B；A12—A13"
  },
  "Q11": {
    "questionId": "Q11",
    "prompt": "曲辕犁和唐三彩分别说明什么？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q11；框架·唐/繁荣/经济；讲稿“莫高窟”；PDF p2/6（教材35页）T35-B/C；A14"
  },
  "Q12": {
    "questionId": "Q12",
    "prompt": "与突厥、回纥、吐蕃、靺鞨分别怎样交往？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q12；框架·唐/民族1；讲稿“圈起来”；PDF p2/6（教材35页）T35-E、p3/6（教材36页）T36-A/B/D、p4/6（教材37页）T37-A/B"
  },
  "Q13": {
    "questionId": "Q13",
    "prompt": "唐与吐蕃和亲、会盟有什么作用？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q13；框架·唐/民族1—2；PDF p3/6（教材36页）T36-D、p4/6（教材37页）T37-A"
  },
  "Q14": {
    "questionId": "Q14",
    "prompt": "如何理解669年图上的突厥名称与后置年份？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q14；讲稿“它这里肯定标注错误了”；PDF p4/6（教材37页）T37-B、p3/6（教材36页）T36-A；A07"
  },
  "Q15": {
    "questionId": "Q15",
    "prompt": "两者关系类题如何找分析角度？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q15；框架·唐/民族2；讲稿“一方、另一方”及甲午、1931段；PDF p3/6（教材36页）T36-D、p4/6（教材37页）T37-A仅支持唐蕃部分内容；A16"
  },
  "Q16": {
    "questionId": "Q16",
    "prompt": "民族/边疆关系与外交/对外关系怎样区分？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q16；框架·唐/民族3；讲稿“现在的中国统治了这块地方”；PDF p3/6（教材36页）T36-C、p4/6（教材37页）T37-A；A08"
  },
  "Q18": {
    "questionId": "Q18",
    "prompt": "中央集权、边防和盛衰受到什么影响？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q18；框架·安史/影响1；讲稿“中央和地方”；PDF p4/6（教材37页）T37-E续p5/6（教材38页）T38-A；A16"
  },
  "Q19": {
    "questionId": "Q19",
    "prompt": "北方战乱、人口南迁和经济重心有何联系？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q19；框架·安史/影响1；讲稿“经济重心开始南移”；PDF p4—5/6（教材37—38页）仅支持战争与盛衰；A04、A09"
  },
  "Q20": {
    "questionId": "Q20",
    "prompt": "安史之乱、设置藩镇、藩镇割据是一回事吗？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q20；框架·安史/影响；讲稿“不是所有的藩镇都割据”；PDF p5/6（教材38页）T38-A/B"
  },
  "Q21": {
    "questionId": "Q21",
    "prompt": "藩镇割据怎样影响中央集权和唐朝延续？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q21；框架·安史/影响2；讲稿“反而延续”；PDF p5/6（教材38页）T38-A/B；A10"
  },
  "Q23": {
    "questionId": "Q23",
    "prompt": "什么是五代十国？它与唐末藩镇割据有何联系？",
    "answer": "答案与解析待第五／六阶段填充。",
    "explanation": "本阶段仅建立问答流程，尚未形成正式历史答案。",
    "contentStatus": "pending",
    "sourceRef": "question-bank.md · Q23；框架·唐的灭亡2；讲稿“本质”；PDF p5/6（教材38页）T38-C/D/E；A15"
  }
};
  const lesson=window.LESSON;
  for(const group of Object.values(lesson.flows)){
    const section=Object.values(lesson.sections).find(s=>s.flows.includes(group.id));
    group.moduleId=section.module;group.subtopicId=section.id;
    group.items=group.qids.map(q=>({...bank[q]}));
    group.contentStatus='pending';group.mappingStatus='既有分组沿用，题序待教师复查';
  }
  lesson.reviewItems=lesson.reviews.map((prompt,i)=>({questionId:`R0${i+1}`,prompt,
    answer:'答案与解析待第五／六阶段填充。',contentStatus:'pending',sourceRef:`question-bank.md · R0${i+1}`}));
})();
