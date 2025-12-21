import React, { useState, useEffect } from 'react';
import { X, Copy, Music as MusicIcon } from 'lucide-react';
import { Playlist } from '../types';

interface CopyPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCopy: (title: string, content: string) => void;
    sourcePlaylist: Playlist | null;
}

const CopyPlaylistModal: React.FC<CopyPlaylistModalProps> = ({
    isOpen,
    onClose,
    onCopy,
    sourcePlaylist
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (isOpen && sourcePlaylist) {
            setTitle(`${sourcePlaylist.title} (복사본)`);
            setContent(sourcePlaylist.content || '');
        }
    }, [isOpen, sourcePlaylist]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onCopy(title.trim(), content.trim());
        setTitle('');
        setContent('');
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !sourcePlaylist) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Copy className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">플레이리스트 복사</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Source Info */}
                <div className="p-5 border-b border-zinc-800 bg-zinc-900/50">
                    <p className="text-xs text-zinc-500 mb-1">원본 플레이리스트</p>
                    <p className="font-semibold text-white">{sourcePlaylist.title}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                        {sourcePlaylist.music_items?.length || 0}곡 · {sourcePlaylist.nickname || '알 수 없음'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            플레이리스트 이름 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 운동할 때 듣는 노래"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            설명 <span className="text-zinc-600">(선택)</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="플레이리스트에 대한 설명을 입력하세요"
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="flex-1 py-3 text-sm font-bold bg-primary text-black rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            복사하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CopyPlaylistModal;
