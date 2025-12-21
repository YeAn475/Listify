import React from 'react';
import { Playlist } from '../types';
import { Music as MusicIcon, Copy, User } from 'lucide-react';

interface PlaylistRecommendationPageProps {
  playlists: Playlist[];
  onPlaylistClick: (playlist: Playlist) => void;
  onCopyPlaylist: (playlist: Playlist) => void;
}

export const PlaylistRecommendationPage: React.FC<PlaylistRecommendationPageProps> = ({
  playlists,
  onPlaylistClick,
  onCopyPlaylist
}) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">플레이리스트 추천</h2>
          <p className="text-zinc-400 mt-2">다른 사용자가 만든 플레이리스트를 둘러보세요</p>
        </div>
      </div>

      {playlists.length === 0 ? (
        <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-800 rounded-3xl group hover:border-zinc-700 transition-colors">
          <MusicIcon className="w-16 h-16 mx-auto mb-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
          <p className="text-zinc-500 text-lg">추천할 플레이리스트가 없습니다.</p>
          <p className="text-zinc-600 text-sm mt-2">다른 사용자가 플레이리스트를 만들면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.playlist_no}
              className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all group cursor-pointer"
            >
              {/* Playlist Cover */}
              <div
                onClick={() => onPlaylistClick(playlist)}
                className="relative mb-4 aspect-square rounded-lg overflow-hidden bg-zinc-800"
              >
                {playlist.music_items && playlist.music_items.length > 0 ? (
                  <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                    {playlist.music_items.slice(0, 4).map((music, idx) => (
                      <img
                        key={idx}
                        src={music.album_image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MusicIcon className="w-16 h-16 text-zinc-700" />
                  </div>
                )}

                {/* Copy Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyPlaylist(playlist);
                  }}
                  className="absolute bottom-2 right-2 p-2.5 rounded-full shadow-xl transition-all bg-primary text-black opacity-0 group-hover:opacity-100 hover:scale-110"
                  title="내 플레이리스트로 복사"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Playlist Info */}
              <div onClick={() => onPlaylistClick(playlist)}>
                <p className="font-bold text-sm truncate mb-1">{playlist.title}</p>
                <p className="text-xs text-zinc-500 truncate mb-2">
                  {playlist.music_items?.length || 0}곡
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <User className="w-3 h-3" />
                  <span className="truncate">{playlist.nickname || '알 수 없음'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
