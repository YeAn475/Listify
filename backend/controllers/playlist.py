from flask import request, jsonify
from services import playlist as playlist_service

def create_playlist():
    data = request.get_json()
    user_no = data.get('user_no')
    title = data.get('title')
    content = data.get('content')

    if not user_no or not title:
        return jsonify({"success": False, "message": "user_no, title 필요"}), 400

    playlist_no = playlist_service.create_playlist(user_no, title, content)
    return jsonify({"success": True, "playlist_no": playlist_no}), 201


def add_music_to_playlist(playlist_no):
    data = request.get_json()
    music_no = data.get('music_no')

    if not music_no:
        return jsonify({"success": False, "message": "music_no 필요"}), 400

    playlist_service.add_music(playlist_no, music_no)
    return jsonify({"success": True}), 200


def get_playlist_detail(playlist_no):
    playlist = playlist_service.get_playlist_detail(playlist_no)
    return jsonify({"success": True, "data": playlist}), 200
