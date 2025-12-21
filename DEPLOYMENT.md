# 🚀 Listify 배포 가이드

Listify 애플리케이션을 클라우드에 배포하는 상세 가이드입니다.

---

## 📋 목차

1. [배포 아키텍처](#배포-아키텍처)
2. [사전 준비](#사전-준비)
3. [Database 배포 (PlanetScale)](#1-database-배포-planetscale)
4. [Backend 배포 (Render)](#2-backend-배포-render)
5. [Frontend 배포 (Vercel)](#3-frontend-배포-vercel)
6. [환경 변수 설정](#환경-변수-설정)
7. [배포 후 확인](#배포-후-확인)
8. [트러블슈팅](#트러블슈팅)

---

## 배포 아키텍처

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │   Render        │     │  PlanetScale    │
│   (Frontend)    │────▶│   (Backend)     │────▶│  (MySQL DB)     │
│   React + Vite  │     │   Flask API     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     3000                    5001                     3306
```

| 서비스 | 플랫폼 | 무료 제공 |
|--------|--------|-----------|
| Frontend | Vercel | ✅ 무제한 |
| Backend | Render | ✅ 월 750시간 |
| Database | PlanetScale | ✅ 1 DB, 1B 읽기/월 |

---

## 사전 준비

### 필수 계정 생성
1. [Vercel](https://vercel.com) - GitHub 연동
2. [Render](https://render.com) - GitHub 연동
3. [PlanetScale](https://planetscale.com) - 계정 생성

### 로컬 환경 확인
```bash
# Frontend 빌드 테스트
cd frontend
npm run build

# Backend 의존성 확인
cd backend
pip freeze > requirements.txt
```

---

## 1. Database 배포 (PlanetScale)

### Step 1: 데이터베이스 생성

1. [PlanetScale 대시보드](https://app.planetscale.com) 접속
2. **Create database** 클릭
3. 설정:
   - Name: `listify`
   - Region: `ap-northeast-1` (Tokyo, 가장 가까움)
4. **Create database** 클릭

### Step 2: 연결 정보 가져오기

1. 생성된 DB 클릭
2. **Connect** 버튼 클릭
3. **Connect with**: `Python` 선택
4. 연결 정보 복사:

```
Host: aws.connect.psdb.cloud
Username: xxxxxxxxxx
Password: pscale_pw_xxxxxxxxxx
Database: listify
SSL: Required
```

### Step 3: 스키마 마이그레이션

1. **Branches** 탭 → **main** 선택
2. **Console** 탭에서 SQL 실행:

```sql
-- 테이블 생성 (로컬 DB에서 export한 스키마)
CREATE TABLE role (
  role_no INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE user (
  user_no INT PRIMARY KEY AUTO_INCREMENT,
  role_no INT,
  email VARCHAR(50),
  password VARCHAR(255),
  nickname VARCHAR(30),
  created_at DATETIME,
  updated_at DATETIME,
  is_deleted TINYINT(1) DEFAULT 0,
  profile_url VARCHAR(255),
  FOREIGN KEY (role_no) REFERENCES role(role_no)
);

CREATE TABLE genre (
  genre_no INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE
);

CREATE TABLE music (
  music_no INT PRIMARY KEY AUTO_INCREMENT,
  spotify_track_id VARCHAR(50) UNIQUE,
  album_image_url VARCHAR(1000),
  album_name VARCHAR(500),
  artist_name VARCHAR(500),
  duration_ms INT,
  popularity INT,
  spotify_url VARCHAR(255),
  track_name VARCHAR(500),
  release_date DATE,
  release_year INT,
  genre_no INT,
  preview_url VARCHAR(500),
  FOREIGN KEY (genre_no) REFERENCES genre(genre_no)
);

CREATE TABLE playlist (
  playlist_no INT PRIMARY KEY AUTO_INCREMENT,
  user_no INT,
  title VARCHAR(40),
  content TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_no) REFERENCES user(user_no)
);

CREATE TABLE music_list (
  playlist_no INT,
  music_no INT,
  PRIMARY KEY (playlist_no, music_no),
  FOREIGN KEY (playlist_no) REFERENCES playlist(playlist_no),
  FOREIGN KEY (music_no) REFERENCES music(music_no)
);

CREATE TABLE notice (
  notice_no INT PRIMARY KEY AUTO_INCREMENT,
  user_no INT,
  title VARCHAR(50),
  content TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_no) REFERENCES user(user_no)
);

-- 기본 데이터 삽입
INSERT INTO role (name) VALUES ('USER'), ('ADMIN');

INSERT INTO genre (name) VALUES 
('K-Pop'), ('Pop'), ('Hip-Hop'), ('R&B'), ('Jazz'), 
('Electronic'), ('Rock'), ('Metal'), ('Indie'), ('Classical');
```

---

## 2. Backend 배포 (Render)

### Step 1: 프로젝트 준비

#### `requirements.txt` 확인
```
Flask==3.0.0
Flask-Cors==4.0.0
PyMySQL==1.1.0
python-dotenv==1.0.0
bcrypt==4.1.2
PyJWT==2.8.0
spotipy==2.23.0
requests==2.31.0
```

#### `render.yaml` 생성 (프로젝트 루트)
```yaml
services:
  - type: web
    name: listify-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && gunicorn app:app --bind 0.0.0.0:$PORT
    envVars:
      - key: PYTHON_VERSION
        value: "3.10.0"
```

#### 백엔드 코드 수정

**`backend/db.py`** - PlanetScale 연결:
```python
import os
import pymysql
from dbutils.pooled_db import PooledDB

def get_pool():
    return PooledDB(
        creator=pymysql,
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME'),
        port=3306,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        ssl={'ssl': {'rejectUnauthorized': True}},  # PlanetScale SSL 필수
        maxconnections=5,
        mincached=1
    )
```

**`backend/app.py`** - 포트 수정:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
```

### Step 2: Render 배포

1. [Render Dashboard](https://dashboard.render.com) 접속
2. **New** → **Web Service**
3. GitHub 레포지토리 연결: `listify`
4. 설정:
   - Name: `listify-backend`
   - Region: `Singapore` (가장 가까움)
   - Branch: `main` 또는 `feature/mergyerrorversion`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`

### Step 3: 환경 변수 설정

Render 대시보드 → Environment:

| Key | Value |
|-----|-------|
| `DB_HOST` | `aws.connect.psdb.cloud` |
| `DB_USER` | PlanetScale 유저명 |
| `DB_PASSWORD` | PlanetScale 비밀번호 |
| `DB_NAME` | `listify` |
| `SPOTIFY_CLIENT_ID` | Spotify 클라이언트 ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify 시크릿 |
| `JWT_SECRET` | 랜덤 문자열 (예: `your-super-secret-jwt-key-123`) |

### Step 4: 배포 확인

배포 완료 후 URL 확인:
```
https://listify-backend.onrender.com/health
```

---

## 3. Frontend 배포 (Vercel)

### Step 1: 환경 변수 파일 수정

**`frontend/.env.production`** 생성:
```
VITE_API_URL=https://listify-backend.onrender.com
```

### Step 2: Vercel 배포

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **Add New** → **Project**
3. GitHub 레포지토리 import: `listify`
4. 설정:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 3: 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://listify-backend.onrender.com` |

### Step 4: 배포

**Deploy** 클릭 → 배포 완료!

배포 URL:
```
https://listify-xxxxx.vercel.app
```

---

## 환경 변수 설정

### Backend (Render)

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DB_HOST` | PlanetScale 호스트 | `aws.connect.psdb.cloud` |
| `DB_USER` | DB 유저명 | `xxxxxxxxxx` |
| `DB_PASSWORD` | DB 비밀번호 | `pscale_pw_xxxxx` |
| `DB_NAME` | DB 이름 | `listify` |
| `SPOTIFY_CLIENT_ID` | Spotify API ID | `3e66a42...` |
| `SPOTIFY_CLIENT_SECRET` | Spotify API Secret | `9989901...` |
| `JWT_SECRET` | JWT 서명 키 | `random-string` |

### Frontend (Vercel)

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_API_URL` | 백엔드 API URL | `https://xxx.onrender.com` |

---

## 배포 후 확인

### 1. Backend 헬스체크
```bash
curl https://listify-backend.onrender.com/health
```

응답:
```json
{"status": "healthy", "database": "connected"}
```

### 2. Frontend 접속
브라우저에서 Vercel URL 접속

### 3. 기능 테스트
1. 회원가입/로그인
2. 음악 검색
3. 플레이리스트 생성
4. 미리듣기 재생

---

## 트러블슈팅

### 문제: Backend가 시작되지 않음
```
Error: gunicorn not found
```
**해결**: `requirements.txt`에 `gunicorn` 추가
```
gunicorn==21.2.0
```

### 문제: CORS 에러
```
Access-Control-Allow-Origin error
```
**해결**: `backend/app.py`에서 CORS 설정 확인
```python
CORS(app, origins=["https://listify-xxxxx.vercel.app"])
```

### 문제: DB 연결 실패
```
SSL connection required
```
**해결**: `db.py`에서 SSL 설정 확인
```python
ssl={'ssl': {'rejectUnauthorized': True}}
```

### 문제: Render 무료 티어 슬립
Render 무료 티어는 15분 비활성 시 슬립됩니다.
**해결**: UptimeRobot 등으로 5분마다 ping

---

## 배포 체크리스트

- [ ] PlanetScale DB 생성 및 스키마 마이그레이션
- [ ] Render 백엔드 배포
- [ ] Render 환경 변수 설정
- [ ] Vercel 프론트엔드 배포
- [ ] Vercel 환경 변수 설정
- [ ] CORS 설정 업데이트
- [ ] 헬스체크 확인
- [ ] 기능 테스트

---

## 예상 비용

| 서비스 | 무료 티어 | 초과 시 |
|--------|-----------|---------|
| PlanetScale | 1 DB, 1B 읽기/월 | $29/월 |
| Render | 750시간/월 | $7/월 |
| Vercel | 무제한 | - |

**총 비용: $0/월** (무료 티어 내)

---

> 📌 **주의사항**
> - Spotify API 키는 절대 GitHub에 푸시하지 마세요!
> - `.env` 파일은 `.gitignore`에 추가되어 있는지 확인하세요.
> - 프로덕션에서는 `debug=False` 필수!
