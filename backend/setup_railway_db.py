# backend/setup_railway_db.py
"""Railway MySQL에 테이블 생성 스크립트"""

import pymysql

# Railway MySQL 연결 정보
config = {
    'host': 'switchyard.proxy.rlwy.net',
    'port': 59261,
    'user': 'root',
    'password': 'JjvVJMJhsflyOoJqsMdOecRoBvxtlXsG',
    'database': 'railway',
    'charset': 'utf8mb4'
}

# 테이블 생성 SQL
TABLES = """
-- role 테이블
CREATE TABLE IF NOT EXISTS role (
  role_no INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL
);

-- user 테이블
CREATE TABLE IF NOT EXISTS user (
  user_no INT PRIMARY KEY AUTO_INCREMENT,
  role_no INT,
  email VARCHAR(50),
  password VARCHAR(255),
  nickname VARCHAR(30),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT(1) DEFAULT 0,
  profile_url VARCHAR(255)
);

-- genre 테이블
CREATE TABLE IF NOT EXISTS genre (
  genre_no INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE
);

-- music 테이블
CREATE TABLE IF NOT EXISTS music (
  music_no INT PRIMARY KEY AUTO_INCREMENT,
  spotify_track_id VARCHAR(50),
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
  preview_url VARCHAR(500)
);

-- playlist 테이블
CREATE TABLE IF NOT EXISTS playlist (
  playlist_no INT PRIMARY KEY AUTO_INCREMENT,
  user_no INT,
  title VARCHAR(40),
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- music_list 테이블
CREATE TABLE IF NOT EXISTS music_list (
  playlist_no INT,
  music_no INT,
  PRIMARY KEY (playlist_no, music_no)
);

-- notice 테이블
CREATE TABLE IF NOT EXISTS notice (
  notice_no INT PRIMARY KEY AUTO_INCREMENT,
  user_no INT,
  title VARCHAR(50),
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
"""

# 기본 데이터
SEED = """
-- role 기본 데이터
INSERT IGNORE INTO role (role_no, name) VALUES (1, 'USER'), (2, 'ADMIN');

-- genre 기본 데이터
INSERT IGNORE INTO genre (name) VALUES 
('K-Pop'), ('Pop'), ('Hip-Hop'), ('R&B'), ('Jazz'), 
('Electronic'), ('Rock'), ('Metal'), ('Indie'), ('Classical');
"""

def main():
    print("🔌 Railway MySQL 연결 중...")
    conn = pymysql.connect(**config)
    
    try:
        with conn.cursor() as cursor:
            # 테이블 생성
            print("📦 테이블 생성 중...")
            for statement in TABLES.split(';'):
                statement = statement.strip()
                if statement and not statement.startswith('--'):
                    cursor.execute(statement)
            
            # 기본 데이터 삽입
            print("🌱 기본 데이터 삽입 중...")
            for statement in SEED.split(';'):
                statement = statement.strip()
                if statement and not statement.startswith('--'):
                    try:
                        cursor.execute(statement)
                    except pymysql.err.IntegrityError:
                        pass  # 이미 존재하는 데이터 무시
            
            conn.commit()
            print("✅ 완료!")
            
            # 테이블 목록 확인
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print("\n📋 생성된 테이블:")
            for table in tables:
                print(f"  - {table[0]}")
                
    finally:
        conn.close()

if __name__ == '__main__':
    main()
