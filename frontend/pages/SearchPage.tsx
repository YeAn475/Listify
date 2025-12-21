import { useState } from 'react';
import { Music } from '../types';
import { Search, Loader2, Plus, Check } from 'lucide-react';
import { searchByArtist, searchByGenre } from '../services/musicService';

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  searchResults: Music[];
  setSearchResults: (m: Music[]) => void;
  cart: Music[];
  onToggleCart: (song: Music) => void;
}

const PAGE_SIZE = 12;

export function SearchPage({
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsSearching,
  searchResults,
  setSearchResults,
  cart,
  onToggleCart
}: Props) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mode, setMode] = useState<'artist' | 'genre'>('artist');

  // 🔍 아티스트 검색 (페이징)
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setMode('artist');
    setIsSearching(true);
    setPage(1);

    try {
      const res = await searchByArtist(searchQuery, 1, PAGE_SIZE);
      setSearchResults(res.data);
      setHasMore(res.page * res.size < res.total);
    } catch {
      alert('검색 중 오류가 발생했습니다.');
      setSearchResults([]);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  };

  // 🎼 장르 검색 (기존 방식, 페이징 X)
  const handleGenreSearch = async (genre: string) => {
    setMode('genre');
    setIsSearching(true);
    setPage(1);

    try {
      const results = await searchByGenre(genre);
      setSearchResults(results);
      setHasMore(false); // 장르 검색은 더보기 없음
    }  catch (e) {
    alert('장르 검색 중 오류가 발생했습니다.');
    setSearchResults([]);
    setHasMore(false);
  } finally {
      setIsSearching(false);
    }
  };

  // ➕ 더보기 (아티스트 검색만)
  const loadMore = async () => {
    if (mode !== 'artist') return;

    const nextPage = page + 1;
    setIsSearching(true);

    try {
      const res = await searchByArtist(searchQuery, nextPage, PAGE_SIZE);
      setSearchResults(prev => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(nextPage * res.size < res.total);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 검색창 */}
      <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          className="w-full bg-zinc-900 rounded-full py-3 pl-12 pr-4"
          placeholder="아티스트 검색"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-zinc-400" />
        )}
      </form>

      {/* 🔥 장르 버튼 (하드코딩 유지) */}
      <div className="flex justify-center gap-2 flex-wrap">
        {['K-Pop', 'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic'].map(g => (
          <button
            key={g}
            onClick={() => handleGenreSearch(g)}
            className="px-4 py-1 rounded-full bg-zinc-800 hover:bg-primary hover:text-black text-sm"
          >
            #{g}
          </button>
        ))}
      </div>

      {/* 검색 결과 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map(song => (
          <div
            key={song.music_no ?? song.spotify_url}
            className="flex gap-4 bg-zinc-900 p-3 rounded"
          >
            <img
              src={song.album_image_url}
              className="w-14 h-14 rounded object-cover"
              alt={song.track_name}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{song.track_name}</p>
              <p className="text-xs text-zinc-400 truncate">
                {song.artist_name}
              </p>
            </div>
            <button onClick={() => onToggleCart(song)}>
              {cart.some(c => c.spotify_url === song.spotify_url)
                ? <Check />
                : <Plus />}
            </button>
          </div>
        ))}
      </div>

      {/* ➕ 더보기 버튼 (아티스트 검색만) */}
      {hasMore && mode === 'artist' && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={isSearching}
            className="px-6 py-2 rounded bg-zinc-800 hover:bg-primary hover:text-black disabled:opacity-50"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}
