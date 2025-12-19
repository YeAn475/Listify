from model import music as music_model
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
import os
from model import genre as genre_model



def extract_genre_no(sp, artist_id):
    """
    Spotify artist → genres → 우리 DB genre_no
    """
    artist = sp.artist(artist_id)
    spotify_genres = artist.get("genres", [])

    for g in spotify_genres:
        key = g.lower()
        if key in GENRE_MAP:
            genre_name = GENRE_MAP[key]
            return music_model.find_genre_no_by_name(genre_name)

    return None


def get_spotify_client():
    """
    Spotify 클라이언트 생성 (lazy initialization)
    """
    client_id = os.getenv("SPOTIPY_CLIENT_ID")
    client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise RuntimeError("Spotify 환경변수가 설정되지 않았습니다.")

    return Spotify(
        auth_manager=SpotifyClientCredentials(
            client_id=client_id,
            client_secret=client_secret
        )
    )

def search_and_save_music(keyword, category):
    sp = get_spotify_client()

    query = keyword
    if category:
        query = f"{category}:{keyword}"

    results = sp.search(q=query, type='track', limit=10)
    tracks = results['tracks']['items']

    saved = []

    for t in tracks:
        artist_id = t['artists'][0]['id']
        genre_no = extract_genre_no(sp, artist_id)

        music = {
            "track_name": t['name'],
            "artist_name": t['artists'][0]['name'],
            "album_name": t['album']['name'],
            "album_image_url": t['album']['images'][0]['url'] if t['album']['images'] else None,
            "duration_ms": t['duration_ms'],
            "popularity": t['popularity'],
            "spotify_url": t['external_urls']['spotify'],
            "genre_no": genre_no
        }

        music_no = music_model.insert_music(music)

        if music_no:
            music['music_no'] = music_no
            saved.append(music)

    return saved, None



def get_music_list(category=None, value=None):
    return music_model.find_all(category, value), None

def map_spotify_genre(spotify_genres):
    for g in spotify_genres:
        for key in GENRE_MAP:
            if key in g.lower():
                return GENRE_MAP[key]
    return None



# services/music.py
GENRE_MAP = {
    "k-pop": "K-Pop",
    "korean pop": "K-Pop",
    "dance pop": "Pop",
    "pop": "Pop",
    "hip hop": "Hip-Hop",
    "r&b": "R&B",
    "jazz": "Jazz",
    "electronic": "Electronic",
    "rock": "Rock",
    "metal": "Metal",
    "indie": "Indie",
}

