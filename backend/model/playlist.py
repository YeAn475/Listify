from db import connect_to_mysql
import os

def get_conn():
    return connect_to_mysql(
        os.getenv('DB_HOST'),
        int(os.getenv('DB_PORT')),
        os.getenv('DB_USER'),
        os.getenv('DB_PASSWORD'),
        os.getenv('DB_DATABASE')
    )

def create(user_no, title, content):
    conn = get_conn()
    with conn.cursor() as c:
        c.execute(
            "INSERT INTO playlist (user_no, title, content) VALUES (%s,%s,%s)",
            (user_no, title, content)
        )
        conn.commit()
        return c.lastrowid

def add_music(playlist_no, music_no):
    conn = get_conn()
    with conn.cursor() as c:
        c.execute(
            "INSERT INTO music_list (playlist_no, music_no) VALUES (%s,%s)",
            (playlist_no, music_no)
        )
        conn.commit()

def find_detail(playlist_no):
    conn = get_conn()
    with conn.cursor() as c:
        c.execute("""
        SELECT p.playlist_no, p.title, p.content, m.track_name, m.artist_name
        FROM playlist p
        JOIN music_list ml ON p.playlist_no = ml.playlist_no
        JOIN music m ON ml.music_no = m.music_no
        WHERE p.playlist_no = %s
        """, (playlist_no,))
        return c.fetchall()
