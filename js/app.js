const PROMPT = "[역할]\n당신은 대학 행정업무를 지원하는 AI 개발자다. 현재 프로젝트 폴더에 대학의 각종 규정 PDF 파일이 저장되어 있다. 각 PDF 파일명에는 규정 제목과 최신 개정일 정보가 포함되어 있다. 이 PDF들을 권위 있는 원문 데이터로 사용하여 “대학 규정 AI 지능형 검색 및 업무근거 추천 시스템”을 구현하라.\n\n[목표]\n기존의 단순 키워드 검색이 아니라 사용자의 질문이나 기안문 문맥을 이해하여 의미적으로 관련된 규정 조항을 찾아주고, 답변의 근거를 정확히 제시하는 웹 기반 시스템을 만든다.\n\n[데이터 처리]\n1. 프로젝트 폴더에 있는 모든 규정 PDF를 자동으로 탐색한다.\n2. PDF에서 텍스트와 표를 가능한 한 구조적으로 추출하되, 페이지 번호와 규정 파일명을 함께 보존한다.\n3. 규정은 조·항·호·목·별표 등 가능한 작은 의미 단위로 분할하여 검색할 수 있도록 한다.\n4. 파일명에서 규정명과 개정일을 추출하여 메타데이터로 저장한다.\n5. 동일 규정의 여러 개정본이 존재하면 개정일이 가장 최근인 파일을 기본 검색 대상으로 우선하고, 구버전이 함께 존재한다는 사실도 알 수 있도록 한다.\n6. 표 안의 승진점수, 등급, 금액, 기간 등도 검색 대상에서 누락되지 않도록 한다.\n7. 개인정보가 포함되어 있다면 화면이나 로그에 불필요하게 노출하지 않는다.\n\n[검색 방식]\n단순 문자열 일치가 아니라 의미 기반 검색을 구현한다. 사용 가능한 환경에서 Gemini API의 문서 검색/File Search 또는 임베딩 기반 벡터 검색을 우선 활용하고, 직접 지원되지 않는 경우에는 서버 측에서 PDF 텍스트를 추출하고 의미 검색 인덱스를 구성하는 방식으로 구현한다.\nAPI 키가 필요한 경우 코드에 직접 입력하지 말고 환경변수로 관리한다.\n\n[화면 구성]\n하나의 깔끔한 HTML 웹앱으로 만들고, 상단에 다음 두 개의 모드를 탭 또는 버튼으로 제공한다.\n\nA. “규정에 대해 질문하기”\n- 사용자가 자연어로 질문할 수 있는 큰 입력창을 제공한다.\n- 예: “직원이 3급에서 2급으로 승진하려면 어떤 조건이 필요한가?”\n- 질문의 핵심 의도를 파악한 뒤 관련 규정과 조항을 찾아 답변한다.\n- 단순히 검색 결과 목록만 보여주지 말고, 관련 조항을 종합하여 이해하기 쉬운 답변을 먼저 제시한다.\n\nB. “기안문에서 근거 찾기”\n- 사용자가 작성 중인 기안문 또는 품의문 전체 내용을 붙여 넣을 수 있는 큰 입력창을 제공한다.\n- 문서의 목적, 행위, 대상, 예산·인사·계약·학사 등 업무 맥락을 분석한다.\n- 관련성이 높은 규정 근거를 3~5개 후보로 제시한다.\n- 사용자가 최종적으로 어떤 근거를 사용할지는 직접 판단할 수 있도록 각 후보의 관련 이유를 짧게 설명한다.\n\n[답변 표시 형식]\n모든 답변은 다음 순서로 보여준다.\n1. AI 요약 답변\n2. 관련 규정 근거 카드 3~5개\n3. 각 근거 카드에는 반드시 아래 정보를 포함한다.\n   - 규정명\n   - 조·항·호·목 또는 별표명\n   - 해당 PDF 페이지\n   - 개정일\n   - 관련 원문 인용(필요 최소 범위)\n   - “이 근거가 관련되는 이유” 한 줄 설명\n   - 원문 PDF 열기/확인 버튼\n4. 사용자가 기안문에 붙여넣기 쉽도록 “근거 문구 복사” 버튼을 제공한다.\n\n[중요한 답변 원칙]\n- 프로젝트 폴더의 규정 PDF 원문을 최우선·유일한 근거로 사용한다.\n- 웹검색이나 모델의 일반지식으로 규정 내용을 보충하거나 만들어내지 않는다.\n- 답변에 사용한 내용은 반드시 실제 규정 원문에서 확인되어야 한다.\n- 정확한 근거를 찾지 못한 경우 “현재 등록된 규정에서 관련 근거를 확인하지 못했습니다.”라고 명확히 표시한다.\n- 서로 충돌하는 규정이나 복수의 해석 가능성이 있으면 하나를 임의로 확정하지 말고 각각의 근거를 보여준다.\n- 최신 개정본을 우선 적용하되, 동일 규정의 과거 버전이 존재하면 사용자에게 표시한다.\n- 숫자, 점수, 기간, 금액, 직급 기준 등은 원문 표나 조문을 다시 확인한 후 그대로 제시한다.\n\n[검색 결과의 신뢰성 표시]\n각 답변에 “근거 확인됨 / 추가 확인 필요” 상태를 표시한다.\n- 근거 확인됨: 답변의 핵심 내용이 관련 규정 원문에서 직접 확인되는 경우\n- 추가 확인 필요: 관련 가능성은 있으나 명확한 조문이 부족하거나 여러 규정이 충돌하는 경우\n\n[사용성]\n- 전체 디자인은 대학 행정시스템처럼 단정하고 전문적으로 구성한다.\n- PC 화면을 기준으로 하되 모바일에서도 기본 기능을 사용할 수 있는 반응형 UI로 만든다.\n- 검색 중에는 진행 상태를 표시하고, 결과가 없을 때도 안내 메시지를 제공한다.\n- 최근 질문 또는 예시 질문을 화면에 3~5개 정도 표시해 사용자가 쉽게 테스트할 수 있도록 한다.\n- 검색 결과 카드에서 규정명 또는 조문을 클릭하면 원문 PDF를 해당 페이지 중심으로 확인할 수 있도록 가능한 범위에서 연결한다.\n\n[필수 테스트 시나리오]\n구현 후 아래 시나리오로 반드시 직접 테스트하고 결과를 확인한다.\n1. “직원이 3급에서 2급으로 승진하려면 어떤 조건이 필요한가?”와 같은 질문을 입력했을 때 관련 인사규정·인사평정 관련 조항과 표를 찾아주는지 확인한다.\n2. 특정 사업·구매·인사·학사 업무를 설명하는 기안문 예시를 입력했을 때 관련 근거 규정 후보를 3~5개 제시하는지 확인한다.\n3. 규정에 없는 질문을 입력했을 때 내용을 추정하여 답하지 않고 “근거를 확인하지 못했다”고 안내하는지 확인한다.\n4. 모든 답변에서 규정명, 조항, 페이지, 개정일, 원문이 실제 PDF와 일치하는지 확인한다.\n5. 동일 규정의 구버전과 신버전이 함께 있는 경우 최신 개정본을 우선 적용하는지 확인한다.\n\n[산출물]\n- 실행 가능한 웹앱 전체 소스코드\n- 메인 HTML 인터페이스\n- 필요한 백엔드/검색 처리 코드\n- PDF 색인 또는 검색 인덱스 생성 기능\n- 환경설정 예시 파일(.env.example 등, 실제 API 키 제외)\n- 실행 방법을 설명한 README\n- 주요 기능과 테스트 결과 요약\n\n[완료 기준]\n단순히 화면 모양만 만든 목업으로 끝내지 말고, 프로젝트 폴더에 있는 실제 규정 PDF를 읽고 검색하여 실제 근거 조항을 반환하는 동작 가능한 프로토타입까지 구현한다. 구현 중 기술적 제약이 발생하면 임의로 기능을 삭제하지 말고, 가능한 대체 구현 방법을 선택하고 README에 그 이유와 한계를 기록한다.";

/* ---------- data ---------- */
const VIZ_STD=['추이선','부서/학과/유형 비교 막대','비율 차트','위험순위 또는 히트맵'];
const TEAMS=[
{id:1,dept:'교무처',team:'학사운영팀',title:'학사운영 위험징후 대시보드',
 key:'휴학·복학·자퇴, 미등록, 학사경고, 수강포기, 학년·학과별 이탈 추이',
 q:'어느 학과·학년·시점에서 학업 이탈 위험이 커지고 있는가?',
 src:['학적 변동 자료','등록·미등록 현황','성적·학사경고 현황','수강신청·수강포기 현황'],
 cols:['연도','학기','학과','학년','재학생수','휴학자수','복학자수','자퇴자수','미등록자수','학사경고자수','수강포기 건수'],
 per:'최근 3~5개년',perNote:'학기 단위 권장',rg:[3,5],viz:VIZ_STD,act:['학생지도·학사안내 강화','위험군 집중관리']},
{id:2,dept:'교무처',team:'교무팀',title:'교과목·강의 운영 분석 대시보드',
 key:'강좌 수, 수강인원, 저수강·폐강, 담당교원 유형, 강의평가, 개설 추이',
 q:'어떤 강좌가 반복적으로 저수강 또는 운영 효율 저하를 보이는가?',
 src:['교과목 개설 자료','수강신청 결과','폐강·분반 자료','교원 배정 자료','강의평가 결과'],
 cols:['연도','학기','학과','교과목명(또는 교과목코드)','분반','학점','정원','수강인원','담당교원 구분','폐강 여부','강의평가 점수'],
 per:'최근 3~5개년',perNote:'학기 단위 권장',rg:[3,5],viz:VIZ_STD,act:['강좌 개설 조정','교원 배정','교육과정 개선']},
{id:3,dept:'기획처',team:'기획예산팀',title:'대학 경영지표·예산 운영 대시보드',
 key:'학생 규모, 등록금 수입, 예산 편성·집행, 인건비·주요 운영비를 연결한 대학 경영지표',
 q:'학생 수와 등록금 수입은 어떻게 변하고 있으며, 대학은 그 변화에 맞게 예산을 편성·집행하고 있는가?',
 src:['연도·학기별 학생 현황','등록금 수입 자료','본예산·추경 편성 자료','월별 예산 집행 자료','인건비·주요 운영비 집계 자료'],
 cols:['연도','학기','월','조직/학과','재학생수','신입생수','등록인원','등록금수입','사업명','예산과목','예산액','집행액','잔액','인건비','주요 운영비'],
 per:'최근 5~7개년',perNote:'학생·수입은 학기 단위, 예산 집행은 월 단위 권장',rg:[5,7],
 viz:['학생 수·등록금 수입 추이','예산 편성·집행률','인건비·운영비 구성','부서/사업별 집행 비교','이상·불용 위험 순위'],
 act:['예산 조정','집행 독려','재정위험 조기파악','차년도 예산편성 및 경영 의사결정 개선']},
{id:4,dept:'기획처',team:'혁신사업팀',title:'대학 혁신사업 성과관리 대시보드',
 key:'혁신사업별 추진일정, 예산·집행률, KPI 목표·실적, 참여실적, 만족도 및 산출물',
 q:'어떤 혁신사업이 일정 지연, 예산 집행 부진 또는 KPI 목표 미달 위험을 보이며 우선 관리가 필요한가?',
 src:['혁신사업 시행계획서','세부과제 관리대장','예산 집행 자료','KPI 실적 자료','프로그램 참여자 집계','만족도 조사 결과','성과·산출물 목록'],
 cols:['연도','사업명','세부과제명','담당부서','시작일','종료일','진척률','예산액','집행액','KPI명','목표값','실적값','달성률','참여인원','만족도','산출물 수/상태'],
 per:'최근 2~3개년 + 당해연도',perNote:'당해연도는 월/분기별 진행자료',rg:[2,3],
 viz:['사업별 KPI 달성률 비교','예산 집행률','일정 진척도','목표 대비 실적 추이','위험등급 또는 우선관리 목록'],
 act:['지연 사업 집중관리','일정 조정','예산 재배분','담당부서 협의','성과개선 과제 지정']},
{id:5,dept:'사무처',team:'인사총무팀',title:'인력구조 및 인사운영 대시보드',
 key:'직군·직급·부서별 인력구조, 근속, 입·퇴사, 휴가·초과근무 및 퇴직예정 현황',
 q:'특정 부서의 인력부담 또는 향후 인력공백 위험은 어디에 있는가?',
 src:['인사기본 현황(집계)','임용·퇴직 현황','근태·휴가 집계','초과근무 집계','정년·퇴직예정 현황'],
 cols:['기준일/연도','부서','직군','직급','고용형태','인원수','평균근속연수','연령대','입사자수','퇴사자수','퇴직예정자수','초과근무시간','휴가일수'],
 per:'최근 3~5개년',perNote:'월 또는 분기 단위 권장',rg:[3,5],viz:VIZ_STD,act:['인력 재배치','충원 계획','업무부담 조정']},
{id:6,dept:'사무처',team:'관재시설팀',title:'자산 노후도·교체 우선순위 대시보드',
 key:'비품관리대장에 축적된 자산의 품목·품명·구입일·구입금액·위치 정보를 기반으로 한 자산 현황 및 노후도 분석',
 q:'어떤 자산이 노후화되었고, 고가·노후 자산과 향후 교체 수요가 어느 품목·부서·공간에 집중되어 있는가?',
 src:['비품관리대장(자산대장): 기본 원자료'],
 srcNote:'가능하면 자산번호, 수량, 사용부서, 상태, 폐기 여부, 내용연수 정보를 추가합니다.',
 cols:['자산번호','품목','품명/모델명','구입일','구입금액','수량','위치','사용부서','상태','폐기 여부/폐기일','내용연수'],
 per:'현재 보유 전체 + 최근 5~10개년 취득자료',perNote:'가능하면 전체 이력',rg:[5,10],ext:true,
 viz:['취득연도별 자산 수·취득가액 추이','품목별 자산 수·금액','위치/부서별 자산 분포','사용연수 구간별 노후도','고가·노후 자산 및 교체우선순위 TOP 목록'],
 act:['차년도 자산구매계획 및 예산편성','교체 우선순위 결정','자산 재배치','장기보유·폐기 대상 검토']},
{id:7,dept:'사무처',team:'재무팀',title:'수입·지출·등록금 현황 대시보드',
 key:'등록금 수납, 미수납, 실제 수입·지출, 자금 흐름 및 예산 대비 실적',
 q:'수입 감소 또는 지출 증가의 주요 원인은 무엇이며 어디서 편차가 발생하는가?',
 src:['등록금 고지·수납 자료','미수납 현황','월별 수입·지출 집계','지급·지출 결의 자료','자금 잔액·운용 현황'],
 cols:['연도','학기','월','수입/지출 구분','회계·항목','고지액','수납액','미수납액','지출액','지급일','예산액','실적액','월말 자금잔액'],
 per:'최근 3~5개년',perNote:'월 단위 권장',rg:[3,5],viz:VIZ_STD,act:['재정위험 조기파악','자금운용 및 지출관리']},
{id:8,dept:'미디어개발처',team:'시스템운영개발팀',title:'정보시스템 운영·장애 분석 대시보드',
 key:'시스템별 장애, 복구시간, 접속량, 자원사용률, 문의·요청 유형 및 처리현황',
 q:'반복 장애 또는 장애 영향도가 높은 시스템은 무엇인가?',
 src:['시스템 모니터링 자료','장애·작업 이력','서버 자원 사용 로그','접속 통계','헬프데스크/문의 처리 자료'],
 cols:['일시','시스템명','서비스명','장애유형','장애시작/종료','복구시간','영향범위','접속자수','CPU','메모리','저장공간','문의유형','처리시간'],
 per:'최근 12~24개월',perNote:'일/주/월 단위 집계 병행 권장',rg:[1,2],viz:VIZ_STD,act:['장애 예방','자원 증설','운영 우선순위 조정']},
{id:9,dept:'미디어개발처',team:'보안 담당',title:'정보보호 위험관리 대시보드',
 key:'보안탐지, 취약점, 패치·보안프로그램 적용률, 개인정보·계정 관련 위험 이벤트',
 q:'가장 우선적으로 조치해야 할 보안 취약영역과 반복 위험은 무엇인가?',
 src:['EPP/EDR·보안관제 집계','취약점 점검 결과','패치 관리 현황','보안프로그램 설치 현황','계정·접근권한 점검 결과','개인정보 관련 사고·이벤트 집계'],
 cols:['일자/월','부서/시스템','이벤트유형','위험등급','탐지건수','취약점수','조치건수','미조치건수','패치율','보안프로그램 설치율','반복발생 여부','조치상태'],
 per:'최근 12~24개월',perNote:'월 단위 권장',rg:[1,2],viz:VIZ_STD,act:['취약점 조치','패치 독려','보안대책 우선순위 설정']}
];
const DEPTS=['교무처','기획처','사무처','미디어개발처'];
const TESTS=[
 '“직원이 3급에서 2급으로 승진하려면 어떤 조건이 필요한가?”를 입력했을 때 관련 인사규정·인사평정 조항과 표를 찾는가',
 '사업·구매·인사·학사 업무를 설명한 기안문 예시를 입력했을 때 근거 규정 후보를 3~5개 제시하는가',
 '규정에 없는 질문에 추정해서 답하지 않고 “근거를 확인하지 못했다”고 안내하는가',
 '모든 답변의 규정명·조항·페이지·개정일·원문이 실제 PDF와 일치하는가',
 '동일 규정의 구버전과 신버전이 함께 있을 때 최신 개정본을 우선 적용하는가'];

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let store={};
try{store=JSON.parse(localStorage.getItem('rd-check-v1')||'{}')}catch(e){store={}}
function save(){try{localStorage.setItem('rd-check-v1',JSON.stringify(store))}catch(e){}}
const isOn=(k)=>!!store[k];
function progress(t){const n=t.src.length;let d=0;for(let i=0;i<n;i++)if(isOn('t'+t.id+'-'+i))d++;return[d,n]}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),1800)}
function copy(text,msg){
  const ok=()=>toast(msg||'복사했습니다');
  const fb=()=>{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();let r=false;try{r=document.execCommand('copy')}catch(e){}ta.remove();r?ok():toast('복사하지 못했습니다. 직접 선택해 복사하세요')};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok,fb)}else fb();
}
const ICON={
 line:'<svg viewBox="0 0 34 26"><path d="M2 20 9 12l7 5 8-11 8 6"/></svg>',
 bar:'<svg viewBox="0 0 34 26"><path d="M5 23V13M13 23V5M21 23v-8M29 23V9"/></svg>',
 pie:'<svg viewBox="0 0 34 26"><circle cx="17" cy="13" r="9"/><path d="M17 13V4M17 13l8 4"/></svg>',
 heat:'<svg viewBox="0 0 34 26"><rect x="4" y="3" width="8" height="8"/><rect x="14" y="3" width="8" height="8"/><rect x="24" y="3" width="6" height="8"/><rect x="4" y="14" width="8" height="8"/><rect x="14" y="14" width="8" height="8"/><rect x="24" y="14" width="6" height="8"/></svg>',
 list:'<svg viewBox="0 0 34 26"><path d="M4 5h26M4 13h26M4 21h18"/></svg>'};
function icon(s){return /추이|진척/.test(s)?ICON.line:/구성|비율|분포/.test(s)?ICON.pie:/히트맵|순위|TOP|우선관리/.test(s)?ICON.heat:/목록/.test(s)?ICON.list:ICON.bar}

/* ---------- team views ---------- */
let view='map',cur=1;
function rangeChart(){
  const rows=TEAMS.map(t=>{
    const [a,b]=t.rg,lo=a*10,w=(b-a)*10;
    const lbl=(t.rg[0]===1&&t.rg[1]===2)?'12~24개월':a+'~'+b+'년';
    return `<div class="row"><button class="lab" data-open="${t.id}" type="button">${esc(t.team)}<small>${esc(t.dept)}</small></button>
      <div class="track"><div class="bar${t.ext?' ext':''}" style="left:${lo}%;width:${w}%">${lbl}</div></div></div>`}).join('');
  return `<div class="rg">${rows}<div class="axis"><span>0</span><span>2년</span><span>4년</span><span>6년</span><span>8년</span><span>10년</span></div></div>`;
}
function mapView(){
  const flow=`<div class="flow"><div>팀 데이터 준비</div><div>현황 한눈에 파악</div><div>문제·위험요인 발견</div><div>상사의 판단과 후속 행동</div></div>`;
  const cols=DEPTS.map(d=>{
    const ts=TEAMS.filter(t=>t.dept===d);
    return `<div class="dept"><h3>${d}<small>${ts.length}개 팀</small></h3><div class="teams">${ts.map(t=>{const[p,n]=progress(t);return `<button class="tc" data-open="${t.id}" type="button"><span class="tn">${esc(t.team)}</span><span class="tt">${esc(t.title)}</span><span class="tq">${esc(t.q)}</span><span class="prog"><i style="width:${p/n*100}%"></i></span><span class="prog-l"><span>자료 준비</span><span>${p}/${n}</span></span></button>`}).join('')}</div></div>`}).join('');
  return `${flow}<div class="depts">${cols}</div>
  <div class="sec"><div class="sec-head"><span class="eyebrow">권장 데이터 기간</span><h3 class="h2" style="font-size:22px">팀마다 얼마나 거슬러 올라가 준비해야 하는가</h3><p>가로 막대는 권장 기간의 범위입니다. 사선 막대는 보유 중인 전체 자산 이력까지 포함한다는 뜻입니다. 팀 이름을 누르면 상세로 이동합니다.</p></div>
  <div class="chartbox">${rangeChart()}<p class="note">시스템운영·보안은 개월 단위(12~24개월)를 연 단위로 환산해 표시했습니다. 혁신사업팀은 이 범위에 더해 당해연도 월/분기별 진행자료가 필요합니다.</p></div></div>`;
}
function detailView(){
  const t=TEAMS.find(x=>x.id===cur),i=TEAMS.indexOf(t),prev=TEAMS[i-1],next=TEAMS[i+1];
  const side=DEPTS.map(d=>`<div><h4>${d}</h4>${TEAMS.filter(x=>x.dept===d).map(x=>`<button data-open="${x.id}" type="button" ${x.id===cur?'aria-current="true"':''}>${esc(x.team)}<small>${esc(x.title)}</small></button>`).join('')}</div>`).join('');
  const sel=`<select class="mobsel" id="mobsel" aria-label="팀 선택">${TEAMS.map(x=>`<option value="${x.id}" ${x.id===cur?'selected':''}>${esc(x.dept)} ${esc(x.team)}</option>`).join('')}</select>`;
  const [p,n]=progress(t),[a,b]=t.rg;
  const mini=`<div class="mini"><i style="left:${a*10}%;width:${(b-a)*10}%"></i></div><div class="mini-ax"><span>0</span><span>5년</span><span>10년</span></div>`;
  const sentence=`이 대시보드를 보고 <em>○○</em>를 판단하고, <em>${esc(t.act[0])}</em> 조치를 할 수 있다.<br><small style="color:var(--muted)">○○에는 발표자가 대시보드에서 발견한 위험·이상 신호를 넣습니다.</small>`;
  return `${sel}<div class="split"><nav class="side" aria-label="팀 목록">${side}</nav><div>
   <div class="dhead"><div class="path">${esc(t.dept)} / ${esc(t.team)}</div><h2>${esc(t.title)}</h2></div>
   <div class="keyq"><b>핵심 분석 질문</b><p>${esc(t.q)}</p></div>
   <div class="dgrid">
    <div class="blk"><h3>필요 데이터 (핵심)</h3><p style="font-size:15px">${esc(t.key)}</p>
      <h3 style="margin-top:20px">권장 데이터 기간</h3><div class="period">${esc(t.per)}</div>${mini}<p class="note">${esc(t.perNote)}</p></div>
    <div class="blk"><h3>준비할 원자료 체크리스트 <small>${p}/${n} 준비</small></h3>
      <ul class="checks">${t.src.map((s,k)=>`<li><label><input type="checkbox" data-ck="t${t.id}-${k}" ${isOn('t'+t.id+'-'+k)?'checked':''}><span>${esc(s)}</span></label></li>`).join('')}</ul>
      ${t.srcNote?`<p class="note">${esc(t.srcNote)}</p>`:''}
      <p class="note">개인정보·민감정보는 비식별 또는 집계 수준으로 준비합니다.</p></div>
    <div class="blk wide"><h3>엑셀 주요 컬럼 (예시) <small>${t.cols.length} COLUMNS</small><button class="btn" data-copycols="${t.id}" type="button">컬럼명 복사</button></h3>
      <div class="chips">${t.cols.map(c=>`<span class="chip c">${esc(c)}</span>`).join('')}</div></div>
    <div class="blk"><h3>권장 시각화 <small>3~5개</small></h3><ul class="viz">${t.viz.map(v=>`<li>${icon(v)}<span>${esc(v)}</span></li>`).join('')}</ul></div>
    <div class="blk"><h3>활용 행동 (의사결정)</h3><div class="actions">${t.act.map(v=>`<span class="act">${esc(v)}</span>`).join('')}</div>
      <div class="sentence">${sentence}</div></div>
   </div>
   <div class="pager"><button data-open="${prev?prev.id:''}" ${prev?'':'disabled'} type="button"><small>← 이전</small>${prev?esc(prev.team):''}</button><button data-open="${next?next.id:''}" ${next?'':'disabled'} type="button" style="text-align:right"><small>다음 →</small>${next?esc(next.team):''}</button></div>
  </div></div>`;
}
function tableView(){
  let body='';
  DEPTS.forEach(d=>{body+=`<tr class="dg"><td colspan="6">${d}</td></tr>`;
    TEAMS.filter(t=>t.dept===d).forEach(t=>{body+=`<tr><td><button class="lnk" data-open="${t.id}" type="button">${esc(t.team)}</button><br><small>${esc(t.title)}</small></td><td>${esc(t.q)}</td><td>${esc(t.key)}</td><td>${t.src.map(esc).join('<br>')}</td><td><b>${esc(t.per)}</b><br><small>${esc(t.perNote)}</small></td><td>${t.act.map(esc).join('<br>')}</td></tr>`})});
  return `<div class="chartbox" style="padding:0"><div class="scroll-x" style="max-height:72vh"><table class="tbl"><thead><tr><th>팀 / 과제</th><th>핵심 질문</th><th>필요 데이터</th><th>원자료</th><th>권장 기간</th><th>활용 행동</th></tr></thead><tbody>${body}</tbody></table></div></div>`;
}
function renderTeam(){
  $$('#tseg button').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===view));
  $('#tv').innerHTML=view==='map'?mapView():view==='detail'?detailView():tableView();
}

/* ---------- rulemate ---------- */
const MODE={q:{inp:'직원이 3급에서 2급으로 승진하려면 어떤 조건이 필요한가?',filled:true,ans:'질문의 의도를 파악해 관련 조항을 종합한 요약 답변이 먼저 표시됩니다.'},
            d:{inp:'작성 중인 기안문 또는 품의문 전체 내용을 붙여 넣으세요.',filled:false,ans:'문서의 목적·행위·대상을 분석해 근거 규정 후보 3~5개와 각각의 관련 이유가 표시됩니다.'}};
let mode='q';
function renderMock(){
  $$('#mtabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.m===mode));
  const m=MODE[mode];const i=$('#minput');i.textContent=m.inp;i.classList.toggle('filled',m.filled);$('#mans').textContent=m.ans;
}
function renderPrompt(){
  const parts=PROMPT.split(/\n(?=\[[^\]\n]+\]\n)/);
  $('#ptext').innerHTML=PROMPT.split('\n').map(l=>/^\[[^\]]+\]$/.test(l.trim())?`<span class="h" id="ph-${esc(l.trim())}">${esc(l)}</span>`:esc(l)).join('\n');
  const heads=PROMPT.split('\n').map(l=>l.trim()).filter(l=>/^\[[^\]]+\]$/.test(l));
  $('#pjump').innerHTML=heads.map(h=>`<button type="button" data-ph="${esc(h)}">${esc(h.slice(1,-1))}</button>`).join('');
}
function renderTests(){
  $('#rtests').innerHTML=TESTS.map((t,i)=>`<li><label><input type="checkbox" data-ck="r${i}" ${isOn('r'+i)?'checked':''}><span>${esc(t)}</span></label></li>`).join('');
}

/* ---------- nav ---------- */
const PANES=['home','team','rule','ops'];
function show(t,push){
  if(!PANES.includes(t))t='home';
  $$('.pane').forEach(p=>p.classList.toggle('on',p.id==='p-'+t));
  $$('.tab').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t));
  if(push!==false){try{history.replaceState(null,'','#'+t)}catch(e){}}
  window.scrollTo({top:0});
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){show(g.dataset.go);return}
  const tb=e.target.closest('.tab');if(tb){show(tb.dataset.t);return}
  const sv=e.target.closest('#tseg button');if(sv){view=sv.dataset.v;renderTeam();return}
  const o=e.target.closest('[data-open]');if(o&&o.dataset.open){cur=+o.dataset.open;view='detail';show('team');renderTeam();window.scrollTo({top:0});return}
  const cc=e.target.closest('[data-copycols]');if(cc){const t=TEAMS.find(x=>x.id==cc.dataset.copycols);copy(t.cols.join('\t'),'컬럼명을 복사했습니다. 엑셀 첫 행에 붙여넣으세요');return}
  const mt=e.target.closest('#mtabs button');if(mt){mode=mt.dataset.m;renderMock();return}
  const ph=e.target.closest('[data-ph]');if(ph){const el=document.getElementById('ph-'+ph.dataset.ph);const pre=$('#ptext');if(el)pre.scrollTo({top:el.offsetTop-pre.offsetTop-12,behavior:'smooth'});return}
  if(e.target.closest('#pcopy')){copy(PROMPT,'프롬프트 전체를 복사했습니다');return}
  if(e.target.closest('#theme')){const r=document.documentElement;const dark=(r.dataset.theme==='dark')||(!r.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches);r.dataset.theme=dark?'light':'dark';return}
});
document.addEventListener('change',e=>{
  const c=e.target.closest('[data-ck]');if(c){store[c.dataset.ck]=c.checked;save();
    if(c.dataset.ck[0]==='t')renderTeam();return}
  if(e.target.id==='mobsel'){cur=+e.target.value;renderTeam()}
});
document.addEventListener('keydown',e=>{
  if(!$('#p-team').classList.contains('on')||view!=='detail')return;
  if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;
  const i=TEAMS.findIndex(t=>t.id===cur);
  if(e.key==='ArrowRight'&&TEAMS[i+1]){cur=TEAMS[i+1].id;renderTeam();window.scrollTo({top:0})}
  if(e.key==='ArrowLeft'&&TEAMS[i-1]){cur=TEAMS[i-1].id;renderTeam();window.scrollTo({top:0})}
});
window.addEventListener('hashchange',()=>show(location.hash.slice(1),false));

renderTeam();renderMock();renderPrompt();renderTests();
show(location.hash.slice(1)||'home',false);
