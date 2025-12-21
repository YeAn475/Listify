from flask import Blueprint
from controllers import playlist as playlist_controller

playlist_bp = Blueprint('playlist', __name__, url_prefix='/playlist')


@playlist_bp.route('', methods=['POST'])
def create_playlist():
    """플레이리스트 생성"""
    return playlist_controller.create_playlist()


@playlist_bp.route('', methods=['GET'])
def get_playlist_list():
    """전체 플레이리스트 목록 조회"""
    return playlist_controller.get_playlist_list()


@playlist_bp.route('/<int:playlist_no>', methods=['GET'])
def get_playlist_detail(playlist_no):
    """플레이리스트 상세 조회"""
    return playlist_controller.get_playlist_detail(playlist_no)


@playlist_bp.route('/<int:playlist_no>', methods=['PUT'])
def update_playlist(playlist_no):
    """플레이리스트 수정"""
    return playlist_controller.update_playlist(playlist_no)


@playlist_bp.route('/<int:playlist_no>', methods=['DELETE'])
def delete_playlist(playlist_no):
    """플레이리스트 삭제"""
    return playlist_controller.delete_playlist(playlist_no)


@playlist_bp.route('/user/<int:user_no>', methods=['GET'])
def get_user_playlist_list(user_no):
    """특정 유저의 플레이리스트 목록 조회"""
    return playlist_controller.get_user_playlist_list(user_no)


@playlist_bp.route('/public', methods=['GET'])
def get_public_playlists():
    """공개 플레이리스트 목록 조회 (자신의 플레이리스트 제외)"""
    return playlist_controller.get_public_playlists()


@playlist_bp.route('/<int:playlist_no>/copy', methods=['POST'])
def copy_playlist(playlist_no):
    """플레이리스트 복사"""
    return playlist_controller.copy_playlist(playlist_no)
