# TeamDiff - 롤 5vs5 팀 자동 구성 앱

**TeamDiff**는 10명의 소환사 정보를 바탕으로, 실력과 포지션을 고려하여 자동으로 팀을 나누는 웹 애플리케이션입니다.

![스크린샷](./screenshot.png) <!-- 배포 후 이미지 주소로 대체 가능 -->

## 🛠 주요 기능

- 소환사 이름 및 태그 입력 (예: `Hide on bush#KR1`)
- Riot API를 활용한 티어, 승률, 포지션 분석
- 자동 팀 분배 (실력 균형 및 포지션 우선 고려)
- 포지션 수동 설정 및 백업 포지션 선택 가능
- 다양한 시나리오 테스트용 더미 데이터 제공
- 반응형 UI + 로딩 애니메이션

## 🚀 기술 스택

- **Frontend**: React (with Hooks)
- **Backend**: Node.js (Express)
- **API**: Riot Games Open API

## 사이트 주소

https://team-diff.vercel.app/