# Cloudtype 배포 가이드

이 가이드는 Listify 프로젝트를 Cloudtype에 배포하는 방법을 설명합니다.

## 📋 목차
1. [사전 준비](#사전-준비)
2. [데이터베이스 설정](#데이터베이스-설정)
3. [백엔드 배포](#백엔드-배포)
4. [프론트엔드 배포](#프론트엔드-배포)
5. [환경 변수 설정](#환경-변수-설정)

## 🔧 사전 준비

### 필요한 것들
- [Cloudtype](https://cloudtype.io/) 계정
- GitHub 저장소 연결
- Spotify API 인증 정보 (Client ID, Client Secret)
- MySQL 데이터베이스 (Cloudtype에서 생성 가능)

## 🗄️ 데이터베이스 설정

### 1. Cloudtype에서 MySQL 생성

1. Cloudtype 대시보드에서 **"새 프로젝트"** 클릭
2. **"데이터베이스"** 선택
3. **"MySQL"** 선택
4. 데이터베이스 정보 입력:
   - **이름**: listify-db (원하는 이름)
   - **버전**: MySQL 8.0 권장
   - **플랜**: 무료 또는 원하는 플랜 선택

5. 생성 후 연결 정보 확인:
   - 호스트(Host)
   - 포트(Port)
   - 사용자명(Username)
   - 비밀번호(Password)
   - 데이터베이스명(Database)

### 2. 데이터베이스 초기화

배포 후 `/health` 엔드포인트로 데이터베이스 연결을 확인할 수 있습니다.

## 🔙 백엔드 배포

### 1. 새 프로젝트 생성

1. Cloudtype 대시보드에서 **"새 프로젝트"** 클릭
2. **"웹서비스"** 선택
3. GitHub 저장소 연결 및 선택
4. **브랜치**: `main` 또는 배포할 브랜치 선택
5. **빌드 경로**: `backend` 입력

### 2. 빌드 설정

- **빌드 방식**: Dockerfile
- **Dockerfile 경로**: `backend/Dockerfile`
- **포트**: `5001`

### 3. 환경 변수 설정

다음 환경 변수를 설정하세요:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DB_HOST` | 데이터베이스 호스트 | `xxx.cloudtype.app` |
| `DB_PORT` | 데이터베이스 포트 | `3306` |
| `DB_USER` | 데이터베이스 사용자명 | `root` |
| `DB_PASSWORD` | 데이터베이스 비밀번호 | `your-password` |
| `DB_DATABASE` | 데이터베이스명 | `listify` |
| `SPOTIFY_CLIENT_ID` | Spotify Client ID | `your-spotify-client-id` |
| `SPOTIFY_CLIENT_SECRET` | Spotify Client Secret | `your-spotify-client-secret` |
| `FLASK_ENV` | Flask 환경 | `production` |

### 4. 배포 시작

- **"배포하기"** 버튼 클릭
- 빌드 로그 확인
- 배포 완료 후 URL 확인 (예: `https://your-backend.cloudtype.app`)

### 5. 배포 확인

배포된 백엔드 URL에 다음 엔드포인트로 접속해서 확인:

```bash
# 기본 엔드포인트
https://your-backend.cloudtype.app/

# 헬스 체크
https://your-backend.cloudtype.app/health

# 테스트
https://your-backend.cloudtype.app/test
```

## 🎨 프론트엔드 배포

### 1. 새 프로젝트 생성

1. Cloudtype 대시보드에서 **"새 프로젝트"** 클릭
2. **"웹서비스"** 선택
3. 동일한 GitHub 저장소 선택
4. **브랜치**: `main` 또는 배포할 브랜치 선택
5. **빌드 경로**: `frontend` 입력

### 2. 빌드 설정

- **빌드 방식**: Dockerfile
- **Dockerfile 경로**: `frontend/Dockerfile`
- **포트**: `80`

### 3. 환경 변수 설정

프론트엔드에서 백엔드 API URL을 사용하는 경우 환경 변수 설정:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_API_URL` | 백엔드 API URL | `https://your-backend.cloudtype.app` |

> **참고**: `constants.ts` 파일에서 API URL을 확인하고 필요에 따라 수정하세요.

### 4. constants.ts 수정 (선택사항)

배포 전에 `frontend/constants.ts` 파일에서 API URL을 환경 변수로 변경하는 것을 권장합니다:

```typescript
// 기존
export const API_BASE_URL = 'http://localhost:5001';

// 수정
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
```

### 5. 배포 시작

- **"배포하기"** 버튼 클릭
- 빌드 로그 확인
- 배포 완료 후 URL 확인 (예: `https://your-frontend.cloudtype.app`)

## 🔐 환경 변수 설정

### Spotify API 인증 정보 얻기

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) 접속
2. 로그인 후 **"Create App"** 클릭
3. 앱 정보 입력 후 생성
4. **"Settings"** 클릭
5. **Client ID**와 **Client Secret** 복사
6. **Redirect URIs** 설정 (필요한 경우)

## 🚀 배포 순서

올바른 배포 순서:

1. ✅ **데이터베이스 생성** (MySQL on Cloudtype)
2. ✅ **백엔드 배포** (Flask API)
3. ✅ **프론트엔드 배포** (React App)

## 📝 주의사항

### CORS 설정
- 백엔드의 CORS 설정이 프론트엔드 도메인을 허용하는지 확인
- 필요한 경우 `backend/app.py`의 CORS 설정 수정

### 데이터베이스 연결
- 데이터베이스가 외부 접속을 허용하는지 확인
- 방화벽 설정 확인

### 환경 변수
- 모든 환경 변수가 올바르게 설정되었는지 확인
- 특히 데이터베이스 연결 정보와 Spotify API 인증 정보 확인

## 🔍 트러블슈팅

### 백엔드가 시작되지 않는 경우
1. Cloudtype 빌드 로그 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. 데이터베이스 연결 정보 확인

### 프론트엔드에서 API 호출 실패
1. 백엔드 URL이 올바른지 확인
2. CORS 설정 확인
3. 네트워크 탭에서 요청 확인

### 데이터베이스 연결 실패
1. 데이터베이스가 실행 중인지 확인
2. 호스트, 포트, 사용자명, 비밀번호 확인
3. 방화벽 설정 확인

## 📚 추가 리소스

- [Cloudtype 공식 문서](https://docs.cloudtype.io/)
- [Flask 배포 가이드](https://flask.palletsprojects.com/en/latest/deploying/)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

## 💡 팁

1. **무료 플랜 사용 시**: 슬립 모드가 활성화될 수 있으므로 첫 요청 시 응답이 느릴 수 있습니다.
2. **로그 모니터링**: Cloudtype 대시보드에서 실시간 로그를 확인할 수 있습니다.
3. **자동 배포**: GitHub 브랜치에 푸시하면 자동으로 재배포됩니다.
4. **도메인 연결**: Cloudtype에서 커스텀 도메인을 연결할 수 있습니다.

---

배포 중 문제가 발생하면 Cloudtype 지원팀에 문의하거나 프로젝트 이슈를 생성해주세요.
