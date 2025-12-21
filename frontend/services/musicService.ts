import { api } from './api';
import { getToken } from './authService';

/**
 * 음악 검색 (Spotify API → DB 저장 → 반환)
 */
export const searchMusic = async (query: string, category?: string) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  const params = new URLSearchParams({ q: query });
  if (category) params.append('category', category);

  return await api.get(`/music/search?${params.toString()}`, token);
};

/**
 * 전체 음악 목록 조회
 */
export const getAllMusic = async () => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get('/music', token);
};

/**
 * 음악 리스트 조회 (카테고리 필터링)
 * @param category - 'artist', 'genre', 'year' 중 하나
 * @param value - 카테고리 값
 */
export const getMusicList = async (category?: string, value?: string) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (value) params.append('value', value);

  const queryString = params.toString();
  const endpoint = queryString ? `/music?${queryString}` : '/music';

  return await api.get(endpoint, token);
};

/**
 * 아티스트별 음악 조회
 */
export const getMusicByArtist = async (artistName: string) => {
  return await getMusicList('artist', artistName);
};

/**
 * 장르별 음악 조회
 */
export const getMusicByGenre = async (genreNo: string) => {
  return await getMusicList('genre', genreNo);
};

/**
 * 연도별 음악 조회
 */
export const getMusicByYear = async (year: string) => {
  return await getMusicList('year', year);
};

/**
 * 음악 상세 조회
 */
export const getMusicDetail = async (musicNo: number) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get(`/music/${musicNo}`, token);
};

/**
 * 대량 음악 데이터 가져오기 (100~200개)
 */
export const bulkImportMusic = async (query: string, count: number = 100) => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.post('/music/bulk-import', { query, count }, token);
};

/**
 * Spotify Top 50 가져오기
 */
export const getTop50Music = async () => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  return await api.get('/music/top50', token);
};
