import { api } from './api';
import { getToken } from './authService';

/**
 * 유저의 플레이리스트 목록 조회
 */
export const getUserPlaylists = async (userNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get(`/playlist/user/${userNo}`, token);
};

/**
 * 플레이리스트 생성
 */
export const createPlaylist = async (title: string, content: string) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.post('/playlist', { title, content }, token);
};

/**
 * 플레이리스트 수정
 */
export const updatePlaylist = async (playlistNo: number, title: string, content: string) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.put(`/playlist/${playlistNo}`, { title, content }, token);
};

/**
 * 플레이리스트 삭제
 */
export const deletePlaylist = async (playlistNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.delete(`/playlist/${playlistNo}`, token);
};

/**
 * 플레이리스트 상세 조회
 */
export const getPlaylistDetail = async (playlistNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get(`/playlist/${playlistNo}`, token);
};

/**
 * 전체 플레이리스트 목록 조회
 */
export const getAllPlaylists = async () => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get('/playlist', token);
};

/**
 * 플레이리스트에 음악 추가
 */
export const addMusicToPlaylist = async (playlistNo: number, musicNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.post(`/playlist/${playlistNo}/music`, { music_no: musicNo }, token);
};

/**
 * 플레이리스트에서 음악 삭제
 */
export const removeMusicFromPlaylist = async (playlistNo: number, musicNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.delete(`/playlist/${playlistNo}/music/${musicNo}`, token);
};

/**
 * 플레이리스트의 음악 목록 조회
 */
export const getPlaylistMusic = async (playlistNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get(`/playlist/${playlistNo}/music`, token);
};

/**
 * 플레이리스트의 모든 음악 삭제
 */
export const clearPlaylist = async (playlistNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.delete(`/playlist/${playlistNo}/music`, token);
};

/**
 * 특정 음악이 포함된 플레이리스트 목록 조회
 */
export const getPlaylistsByMusic = async (musicNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get(`/playlist/by-music/${musicNo}`, token);
};
