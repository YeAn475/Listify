from flask import request, jsonify
from services import music as music_service

def search_music():
    keyword = request.args.get('q')
    category = request.args.get('category')  # artist | genre | year

    if not keyword:
        return jsonify({"success": False, "message": "검색어(q)가 필요합니다."}), 400

    musics, error = music_service.search_and_save_music(keyword, category)
    if error:
        return jsonify({"success": False, "message": error}), 500

    return jsonify({"success": True, "data": musics}), 200


def get_music_list():
    category = request.args.get('category')
    value = request.args.get('value')

    musics, error = music_service.get_music_list(category, value)
    if error:
        return jsonify({"success": False, "message": error}), 400

    return jsonify({"success": True, "data": musics}), 200

