// frontend/services/musicService.ts
import api from './api';
import { Music } from '../types';

type ArtistSearchApiResponse = {
  success: boolean;
  message?: string;
  data: Music[];
  page: number;
  size: number;
  total: number;
};

type ListApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

// ✅ 아티스트 검색 (페이징)
export async function searchByArtist(
  q: string,
  page = 1,
  size = 12
): Promise<{ data: Music[]; page: number; size: number; total: number }> {
  const res = await api.get<ArtistSearchApiResponse>('/music/search', {
    params: { q, page, size },
  });

  // success false면 에러로 처리
  if (res.data?.success === false) {
    throw new Error(res.data?.message || '검색 실패');
  }

  return {
    data: res.data?.data ?? [],
    page: res.data?.page ?? page,
    size: res.data?.size ?? size,
    total: res.data?.total ?? 0,
  };
}

// ✅ 장르 검색 (리스트)
export async function searchByGenre(genre: string): Promise<Music[]> {
  const res = await api.get<ListApiResponse<Music[]>>('/music', {
    params: { category: 'genre', value: genre },
  });

  if (res.data?.success === false) {
    throw new Error(res.data?.message || '장르 검색 실패');
  }

  // 여기 중요: 반드시 배열만 반환
  return res.data?.data ?? [];
}
