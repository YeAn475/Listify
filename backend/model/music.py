from db import connect_to_mysql
import os
import pymysql

def get_conn():
    conn = connect_to_mysql(
        os.getenv("DB_HOST"),
        int(os.getenv("DB_PORT")),
        os.getenv("DB_USER"),
        os.getenv("DB_PASSWORD"),
        os.getenv("DB_DATABASE")
    )

    if conn is None:
        raise RuntimeError(
            f"DB 연결 실패 - "
            f"HOST={os.getenv('DB_HOST')}, "
            f"PORT={os.getenv('DB_PORT')}, "
            f"USER={os.getenv('DB_USER')}, "
            f"DB={os.getenv('DB_DATABASE')}"
        )

    return conn

def insert_music(m):
    conn = get_conn()
    with conn.cursor() as c:
        sql = """
        INSERT INTO music
        (track_name, artist_name, album_name, album_image_url,
         duration_ms, popularity, spotify_url, genre_no)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """
        c.execute(sql, (
            m['track_name'],
            m['artist_name'],
            m['album_name'],
            m['album_image_url'],
            m['duration_ms'],
            m['popularity'],
            m['spotify_url'],
            m['genre_no']
        ))
        conn.commit()
        return c.lastrowid




def find_all(category=None, value=None):
    conn = get_conn()
    with conn.cursor() as c:
        if category == "genre":
            sql = """
            SELECT m.*
            FROM music m
            JOIN genre g ON m.genre_no = g.genre_no
            WHERE g.name = %s
            ORDER BY m.popularity DESC
            """
            c.execute(sql, (value,))
        else:
            c.execute("SELECT * FROM music ORDER BY popularity DESC")
        return c.fetchall()


    
def find_by_genre(genre_name):
    conn = get_conn()
    try:
        with conn.cursor() as c:
            sql = """
            SELECT m.*
            FROM music m
            JOIN genre g ON m.genre_no = g.genre_no
            WHERE g.name = %s
            ORDER BY m.popularity DESC
            """
            c.execute(sql, (genre_name,))
            return c.fetchall()
    finally:
        conn.close()
        

def find_genre_no_by_name(name):
    conn = get_conn()
    with conn.cursor() as c:
        c.execute(
            "SELECT genre_no FROM genre WHERE name = %s",
            (name,)
        )
        row = c.fetchone()
        return row['genre_no'] if row else None

