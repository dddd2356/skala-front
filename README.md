# skala-front

SKALA 프론트엔드 과정 실습으로 제작한 개인 포트폴리오 웹사이트입니다. HTML, CSS, JavaScript로 프로필, 수업 시간표, 휴일 계획, 여행 앨범, 회원가입 폼과 함께 다양한 인터랙티브 기능(게임, 실시간 날씨 등)을 구성했습니다.

## 폴더 구조

```
skala-front/
├── html/
│   ├── index.html          # 허브 페이지 (바로가기 메뉴, 최근 소식, 실시간 정보, 미니 게임)
│   ├── myProfile.html       # 소개·자격증·기술 스택·프로젝트 (목차 사이드바)
│   ├── myClass.html         # 수업 시간표
│   ├── myHoliday.html       # 휴일 일과
│   ├── myTrip.html          # 여행 앨범 (삿포로)
│   ├── signUp.html          # 회원가입 폼
│   └── signUpResult.html    # 회원가입 완료 안내
├── css/
│   ├── style.css            # 공통 스타일 (변수, 리셋, 버튼·다이얼로그·폼·테이블 등 공용 컴포넌트)
│   ├── index.css            # 홈 레이아웃/날씨 위젯/가방 위젯 전용 스타일
│   ├── game2048.css         # 2048 게임판 전용 스타일
│   ├── myClass.css          # 시간표 편집 UI 전용 스타일
│   ├── myProfile.css        # 프로필 페이지 레이아웃/사이드바/프로젝트 카드 전용 스타일
│   ├── myTrip.css           # 여행 앨범 카드 전용 스타일
│   └── signUp.css           # 회원가입 폼 전용 스타일
├── script/                  # 페이지별 JavaScript 모듈
│   ├── theme.js               # 다크모드 수동 토글 (localStorage 저장)
│   ├── upDown.js              # 업다운 게임
│   ├── grade.js               # 성적 계산기
│   ├── game2048.js            # 2048 게임
│   ├── bag.js                 # 내 가방 (아이템 추가/삭제)
│   ├── weatherAPI.js          # 실시간 날씨 조회 (Open-Meteo)
│   ├── geocodingAPI.js        # 도시 검색/역지오코딩 (Open-Meteo, BigDataCloud)
│   ├── realtimeInfo.js        # 날씨 위젯 UI 제어
│   ├── currentLocation.js     # 브라우저 위치 기반 현재 위치 표시
│   ├── timetable.js           # 시간표 데이터 모델링·렌더링·편집(추가/수정/삭제/병합)
│   ├── profileToc.js          # 프로필 페이지 목차 스크롤스파이
│   └── signUpValidation.js    # 회원가입 비밀번호 확인 검증
└── media/                    # 이미지·영상·오디오 리소스
```

## 페이지 구성

| 페이지 | 설명 |
|---|---|
| `index.html` | 전체 페이지로 이동하는 허브. 최근 소식, 실시간 정보(위치·날씨), 자바스크립트 미니 게임, 내 가방 포함 |
| `myProfile.html` | 소개, 자격증, 기술 스택, 주요 프로젝트, 좋아하는 것, 올해 계획, 연락처 — 목차 사이드바로 탐색 |
| `myClass.html` | 시간표 (요일/시간대별 과목을 추가·수정·삭제·병합할 수 있는 편집 기능, `localStorage` 저장) |
| `myHoliday.html` | 휴일 일과 타임라인 |
| `myTrip.html` | 삿포로 여행 사진/영상 앨범 (3열 그리드) |
| `signUp.html` / `signUpResult.html` | 회원가입 폼(비밀번호 확인 실시간 검증)과 완료 페이지 |

## 주요 구현 기능

### CSS
- **시멘틱 마크업**: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` 태그로 구조화
- **파일 분리**: `style.css`(공통 변수·리셋·버튼/다이얼로그/폼/테이블 등 공용 컴포넌트) + 페이지·기능별 CSS(`index.css`, `game2048.css`, `myClass.css`, `myProfile.css`, `myTrip.css`, `signUp.css`)로 분리해 각 페이지가 필요한 스타일만 로드
- **레이아웃**: Flexbox(네비게이션, 홈 화면 본문/사이드바, 프로필 목차 사이드바) + CSS Grid(여행 앨범 3열 배치)
- **반응형**: 786px 이하에서 네비게이션·레이아웃·그리드가 1열로 전환, 표는 가로 스크롤 컨테이너 처리, 프로필 목차는 720px 이하에서 본문 아래로 이동
- **CSS 변수(`:root`)**: 색상 팔레트를 변수로 관리해 전체 톤을 한 곳에서 제어
- **다크모드**: `prefers-color-scheme` 자동 전환 + 버튼으로 수동 전환(선택값 `localStorage` 저장)
- **트랜지션/애니메이션**: 버튼·카드 hover 전환, 헤더 타이틀 fade-in, 폴라로이드 사진 틸트, 2048 타일 슬라이드 애니메이션
- **접근성**: `:focus-visible` 포커스 스타일, `prefers-reduced-motion` 대응

### JavaScript
- **업다운 게임 / 성적 계산기 / 2048**: `<dialog>` 기반 UI, 폼 제출·키보드 입력 처리, 연타 시 상태가 꼬이지 않도록 이동 중 잠금 처리
- **시간표 편집**: 요일×시간대를 데이터 모델로 관리해 과목 추가·수정·삭제·시간 병합/분할을 지원, 변경 내용은 `localStorage`에 저장되어 새로고침 후에도 유지
- **프로필 목차 스크롤스파이**: 스크롤 위치를 기준으로 현재 보고 있는 섹션을 사이드바 목차에서 자동으로 강조, 목차 클릭 시 즉시 반영
- **내 가방**: 아이템 추가/삭제, 같은 이름 항목 수량 합산
- **실시간 날씨**: Open-Meteo API 연동, 도시 검색(지오코딩) 후 목록에 추가/삭제, `localStorage`로 커스텀 도시 저장
- **현재 위치**: `navigator.geolocation` + 역지오코딩으로 실제 위치(시/도 + 구·군)를 표시, 권한 거부/실패 시 원인별 안내 메시지
- **회원가입 검증**: 비밀번호/비밀번호 확인 실시간 일치 여부 표시, 불일치 시 제출 차단

## 실행 방법

별도 빌드 과정이 없는 정적 사이트입니다. 아래 중 편한 방법으로 열면 됩니다.

**방법 1 — VS Code Live Server 확장 사용**
1. VS Code에서 프로젝트 폴더를 엽니다.
2. `html/index.html`을 우클릭 → `Open with Live Server`

**방법 2 — 파일 직접 열기**
`html/index.html`을 브라우저로 바로 드래그하거나 더블클릭해서 열어도 됩니다. (단, 날씨/위치 기능은 `file://`보다 `http://localhost` 환경에서 더 안정적으로 동작합니다.)

## 사용 기술 / 외부 API

- HTML5 (시멘틱 태그)
- CSS3 (Flexbox, Grid, CSS 변수, 미디어 쿼리, 애니메이션)
- JavaScript (ES6 모듈, Fetch API, LocalStorage, Geolocation API)
- [Open-Meteo](https://open-meteo.com/) — 실시간 날씨, 도시 검색 (API 키 불필요)
- [BigDataCloud](https://www.bigdatacloud.com/) — 역지오코딩 (API 키 불필요)
