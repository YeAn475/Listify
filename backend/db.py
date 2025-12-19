import pymysql
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))




def connect_to_mysql(host, port, user, password, database):
    try:
        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            cursorclass=pymysql.cursors.DictCursor
        )
        print(f"MySQL 데이터베이스 '{database}'에 성공적으로 연결되었습니다.")
        print("DB HOST:", host)
        print("DB PORT:", port)
        print("DB USER:", user)
        print("DB DATABASE:", database)
        return conn
    except pymysql.MySQLError as e:
        print(f"MySQL 연결 오류: {e}")
        return None


if __name__ == '__main__':
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = int(os.getenv('DB_PORT'))
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_DATABASE = os.getenv('DB_DATABASE')

    conn = connect_to_mysql(DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE)

    if conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            print(cursor.fetchone())
        conn.close()
