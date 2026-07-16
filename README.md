# skala-front

SKALA 프론트엔드 과정 실습으로 제작한 개인 포트폴리오 웹사이트입니다. HTML, CSS로 프로필, 수업 시간표, 휴일 계획, 여행 앨범, 회원가입 폼을 구성했습니다.

## 폴더 구조

```
skala-front/
├── html/
│   ├── index.html          # 허브 페이지 (바로가기 메뉴, 최근 소식)
│   ├── myProfile.html       # 자기소개
│   ├── myClass.html         # 수업 시간표
│   ├── myHoliday.html       # 휴일 일과
│   ├── myTrip.html          # 여행 앨범 (삿포로)
│   ├── signUp.html          # 회원가입 폼
│   └── signUpResult.html    # 회원가입 완료 안내
├── css/
│   └── style.css            # 전체 페이지 공통 스타일
└── media/                   # 이미지·영상·오디오 리소스
```

## 페이지 구성

| 페이지 | 설명 |
|---|---|
| `index.html` | 전체 페이지로 이동하는 허브. 최근 소식, 실시간 정보 패널 포함 |
| `myProfile.html` | 좋아하는 것, 올해 계획, 자기소개 |
| `myClass.html` | 시간표 (요일별 강의, `rowspan`/`colspan` 활용) |
| `myHoliday.html` | 휴일 일과 타임라인 |
| `myTrip.html` | 삿포로 여행 사진/영상 앨범 (3열 그리드) |
| `signUp.html` / `signUpResult.html` | 회원가입 폼과 완료 페이지 |

## 주요 구현 기능

- **시멘틱 마크업**: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` 태그로 구조화
- **레이아웃**: Flexbox(네비게이션, 홈 화면 본문/사이드바) + CSS Grid(여행 앨범 3열 배치)
- **반응형**: 786px 이하에서 네비게이션·레이아웃·그리드가 1열로 전환, 표는 가로 스크롤 컨테이너 처리
- **CSS 변수(`:root`)**: 색상 팔레트를 변수로 관리해 전체 톤을 한 곳에서 제어
- **다크모드**: `prefers-color-scheme`로 시스템 설정에 따라 자동 전환
- **트랜지션/애니메이션**: 버튼·카드 hover 전환, 헤더 타이틀 fade-in, `::before` 가상요소 액센트 바
- **접근성**: `:focus-visible` 포커스 스타일, `prefers-reduced-motion` 대응

## 실행 방법

별도 빌드 과정이 없는 정적 사이트입니다. 아래 중 편한 방법으로 열면 됩니다.

**방법 1 — VS Code Live Server 확장 사용**
1. VS Code에서 프로젝트 폴더를 엽니다.
2. `html/index.html`을 우클릭 → `Open with Live Server`

**방법 2 — 파일 직접 열기**
`html/index.html`을 브라우저로 바로 드래그하거나 더블클릭해서 열어도 됩니다.

## 사용 기술

- HTML5 (시멘틱 태그)
- CSS3 (Flexbox, Grid, CSS 변수, 미디어 쿼리, 애니메이션)
