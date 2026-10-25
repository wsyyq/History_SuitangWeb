from pathlib import Path
from xml.sax.saxutils import escape
from docx import Document
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph as DParagraph
from docx.table import Table as DTable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER,TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,KeepTogether
from pypdf import PdfReader
import re,json
B=Path(__file__).resolve().parent;ROOT=B.parent
src=ROOT/'output'/'第6课_从隋唐盛世到五代十国_教案.docx';out=src.with_suffix('.pdf')
d=Document(src)
pdfmetrics.registerFont(TTFont('SimSun','C:/Windows/Fonts/simsun.ttc',subfontIndex=0))
pdfmetrics.registerFont(TTFont('SimHei','C:/Windows/Fonts/simhei.ttf'))
pdfmetrics.registerFontFamily('SimSun',normal='SimSun',bold='SimHei',italic='SimSun',boldItalic='SimHei')
styles={
 'Normal':ParagraphStyle('normal',fontName='SimSun',fontSize=11,leading=16,spaceAfter=6,wordWrap='CJK'),
 'Title':ParagraphStyle('title',fontName='SimHei',fontSize=20,leading=28,alignment=TA_CENTER,spaceAfter=15,wordWrap='CJK',keepWithNext=True),
 'Heading 1':ParagraphStyle('h1',fontName='SimHei',fontSize=15,leading=21,spaceBefore=10,spaceAfter=7,wordWrap='CJK',keepWithNext=True),
 'Heading 2':ParagraphStyle('h2',fontName='SimHei',fontSize=12,leading=18,spaceBefore=8,spaceAfter=5,wordWrap='CJK',keepWithNext=True),
 'cell':ParagraphStyle('cell',fontName='SimSun',fontSize=10,leading=14,wordWrap='CJK'),
 'center':ParagraphStyle('center',fontName='SimSun',fontSize=10,leading=14,wordWrap='CJK',alignment=TA_CENTER),
}
def rich(p):
 result=''
 for child in p._p:
  if child.tag==qn('w:r'):
   t=''.join(child.itertext()) if False else ''.join(n.text or '' for n in child.iter(qn('w:t')))
   t=escape(t);prop=child.find(qn('w:rPr'))
   if prop is not None and prop.find(qn('w:b')) is not None and prop.find(qn('w:b')).get(qn('w:val'))!='0':t='<b>'+t+'</b>'
   result+=t
  elif child.tag==qn('w:hyperlink'):
   label=''.join(n.text or '' for n in child.iter(qn('w:t')));url=p.part.rels[child.get(qn('r:id'))].target_ref
   result+='<link href="'+escape(url,{'"':'&quot;'})+'" color="#245B75">'+escape(label)+'</link>'
 return result
story=[];expected=[]
for el in d.element.body:
 if el.tag==qn('w:p'):
  p=DParagraph(el,d);t=rich(p)
  if not t:continue
  style=styles.get(p.style.name,styles['Normal']);item=Paragraph(t,style)
  if p.paragraph_format.keep_with_next:item.keepWithNext=True
  story.append(item);expected.append(''.join(el.itertext()) if False else ''.join(n.text or '' for n in el.iter(qn('w:t'))))
 elif el.tag==qn('w:tbl'):
  tab=DTable(el,d);n=len(tab.columns);data=[]
  for ri,row in enumerate(tab.rows):
   cells=[]
   for ci,cell in enumerate(row.cells):
    t='<br/>'.join(rich(p) for p in cell.paragraphs);cells.append(Paragraph(t,styles['center' if ri==0 or (n==4 and ci==1) else 'cell']));expected.append(cell.text)
   data.append(cells)
  width=A4[0]-3.6*cm
  widths=([6.4,11] if len(data)==5 else [3.4,14]) if n==2 else [2.5,1.7,7.3,5.9]
  table=Table(data,colWidths=[w/sum(widths)*width for w in widths],repeatRows=1,hAlign='CENTER')
  table.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,colors.HexColor('#D9D9D9')),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#E5EBEF')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
  story.extend([table,Spacer(1,8)])
def footer(canvas,doc):
 canvas.saveState();canvas.setFont('SimSun',9);canvas.setFillColor(colors.HexColor('#666666'));canvas.drawCentredString(A4[0]/2,1*cm,f'第 {doc.page} 页');canvas.restoreState()
doc=SimpleDocTemplate(str(out),pagesize=A4,leftMargin=1.8*cm,rightMargin=1.8*cm,topMargin=1.8*cm,bottomMargin=1.8*cm,title=d.core_properties.title,author='')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(out);alltext=re.sub(r'\s+','',''.join(p.extract_text() or '' for p in r.pages))
missing=[t for t in expected if re.sub(r'\s+','',t) not in alltext]
assert not missing,missing
(B/'conversion-check.json').write_text(json.dumps({'source':str(src),'pdf':str(out),'pageCount':len(r.pages),'contentBlocksChecked':len(expected),'missing':missing,'converter':'DOCX OOXML to ReportLab; native Office rendering unavailable'},ensure_ascii=False,indent=2),encoding='utf8')
print(f'PDF: {len(r.pages)} pages, {len(expected)} content blocks verified')

