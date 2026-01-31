'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi, photoApi } from '@/lib/api-services';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GalleryDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { data: gallery, isLoading, error } = useQuery({
        queryKey: ['gallery', id],
        queryFn: async () => {
            const res = await galleryApi.getById(id as string);
            return res.data.data;
        },
    });

    const uploadMutation = useMutation({
        mutationFn: (files: FileList) => photoApi.upload(id as string, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery', id] });
            setIsUploading(false);
            setUploadProgress(0);
        },
        onError: (err) => {
            console.error('Upload failed:', err);
            setIsUploading(false);
            alert('Upload failed. Please try again.');
        }
    });

    const deletePhotoMutation = useMutation({
        mutationFn: (photoId: string) => photoApi.delete(photoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery', id] });
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (e.target.files.length > 50) {
                alert('You can only upload up to 50 photos at a time.');
                return;
            }
            setIsUploading(true);
            uploadMutation.mutate(e.target.files);
        }
    };

    if (isLoading) return <div className="text-center py-12">Loading gallery...</div>;
    if (error) return <div className="text-center py-12 text-red-600">Error loading gallery</div>;

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/galleries" className="text-blue-600 hover:text-blue-700">
                    ← Back to Galleries
                </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{gallery.name}</h1>
                    <p className="text-gray-600 mt-2">{gallery.description || 'No description provided'}</p>
                    <div className="flex items-center gap-3 mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${gallery.privacy === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {gallery.privacy.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{gallery.photos?.length || 0} Photos</span>
                        <span className="text-sm text-gray-500">{gallery.viewCount} Views</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <span>📤</span> Upload Photos
                            </>
                        )}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                    />
                    <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-gray-300 transition">
                        Settings
                    </button>
                </div>
            </div>

            {isUploading && (
                <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex justify-between mb-2 text-sm font-medium text-blue-700">
                        <span>Uploading photos...</span>
                        <span>Processing on server</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-600 h-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}

            {!gallery.photos || gallery.photos.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="text-5xl mb-4">📸</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">This gallery is empty</h3>
                    <p className="text-gray-600 mb-6">Upload some photos to share with your clients</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Upload Photos
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {gallery.photos.map((photo: any) => (
                        <div key={photo.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={photo.thumbnailUrl}
                                alt={photo.originalName}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition duration-300 flex gap-2">
                                    <a
                                        href={photo.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition"
                                        title="View Original"
                                    >
                                        🔍
                                    </a>
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this photo?')) {
                                                deletePhotoMutation.mutate(photo.id);
                                            }
                                        }}
                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                        title="Delete Photo"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            {photo.isProcessing && (
                                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                                    <div className="text-xs font-semibold text-blue-600 animate-pulse">PROCESSING...</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
