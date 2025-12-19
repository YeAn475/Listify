from model import playlist as playlist_model

def create_playlist(user_no, title, content):
    return playlist_model.create(user_no, title, content)

def add_music(playlist_no, music_no):
    playlist_model.add_music(playlist_no, music_no)

def get_playlist_detail(playlist_no):
    return playlist_model.find_detail(playlist_no)
