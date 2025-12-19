from flask import Blueprint
from controllers import playlist as playlist_controller

playlist_bp = Blueprint('playlist', __name__, url_prefix='/playlists')

@playlist_bp.route('', methods=['POST'])
def create_playlist():
    return playlist_controller.create_playlist()

@playlist_bp.route('/<int:playlist_no>/music', methods=['POST'])
def add_music(playlist_no):
    return playlist_controller.add_music_to_playlist(playlist_no)

@playlist_bp.route('/<int:playlist_no>', methods=['GET'])
def get_playlist(playlist_no):
    return playlist_controller.get_playlist_detail(playlist_no)
