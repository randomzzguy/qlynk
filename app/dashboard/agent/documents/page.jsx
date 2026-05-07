'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getCurrentUser } from '@/lib/supabase';
import { 
  Upload, 
  FileText, 
  Trash2, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  File,
  FileType,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const loadDocuments = useCallback(async (uid) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agent_documents')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUserId(user.id);
      await loadDocuments(user.id);
      setLoading(false);
    };

    init();
  }, [router, loadDocuments]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    if (!userId) return;
    
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
        console.warn(`Skipping unsupported file: ${file.name}`);
        continue;
      }

      try {
        setUploadProgress({ current: i + 1, total: files.length, filename: file.name });
        
        // For text files, read the content directly
        let extractedText = '';
        if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          extractedText = await file.text();
        }

        // Upload to Supabase storage
        const supabase = createClient();
        const filename = `${userId}/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('agent-documents')
          .upload(filename, file);

        if (uploadError) {
          // If bucket doesn't exist, just store metadata
          console.warn('Storage upload failed, storing metadata only:', uploadError);
        }

        // Store document metadata
        const { error: dbError } = await supabase
          .from('agent_documents')
          .insert({
            user_id: userId,
            filename: file.name,
            file_type: file.type || 'text/plain',
            file_size: file.size,
            storage_path: filename,
            extracted_text: extractedText || null,
            is_processed: !!extractedText,
          });

        if (dbError) {
          console.error('Error saving document:', dbError);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setUploading(false);
    setUploadProgress(null);
    await loadDocuments(userId);
  };

  const handleDelete = async (docId, storagePath) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    const supabase = createClient();

    // Delete from storage
    try {
      await supabase.storage.from('agent-documents').remove([storagePath]);
    } catch (e) {
      console.warn('Could not delete from storage:', e);
    }

    // Delete from database
    const { error } = await supabase
      .from('agent_documents')
      .delete()
      .eq('id', docId);

    if (!error) {
      setDocuments(docs => docs.filter(d => d.id !== docId));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return <FileType className="text-red-400" size={24} />;
    if (fileType?.includes('word')) return <FileText className="text-blue-400" size={24} />;
    return <File className="text-gray-400" size={24} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-semibold">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <Link 
              href="/dashboard/agent"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Agent Config
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-bright-orange/10 rounded-xl flex items-center justify-center">
                <FileText className="text-bright-orange" size={24} />
              </div>
              <h1 className="text-4xl font-black text-white">Documents</h1>
            </div>
            <p className="text-xl text-gray-400">
              Upload documents to expand your agent&apos;s knowledge base
            </p>
          </div>

          {/* Upload Area */}
          <div 
            className={`bg-card/80 rounded-2xl border-2 border-dashed p-12 mb-8 text-center transition-colors ${
              dragActive 
                ? 'border-bright-orange bg-bright-orange/5' 
                : 'border-border hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-bright-orange animate-spin mx-auto" />
                <p className="text-white font-medium">
                  Uploading {uploadProgress?.filename}...
                </p>
                <p className="text-gray-400 text-sm">
                  File {uploadProgress?.current} of {uploadProgress?.total}
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-gray-400 mb-6">
                  Supported: PDF, TXT, Markdown, Word documents
                </p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-bright-orange text-white rounded-lg font-semibold cursor-pointer hover:bg-bright-orange/90 transition-colors">
                  <Upload size={18} />
                  Choose Files
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.txt,.md,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          {/* Documents List */}
          <div className="bg-card/80 rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Uploaded Documents ({documents.length})
            </h2>
            
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No documents uploaded yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Upload documents to give your agent more knowledge
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.file_type)}
                      <div>
                        <h4 className="font-medium text-white">{doc.filename}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          {doc.is_processed ? (
                            <span className="flex items-center gap-1 text-green">
                              <CheckCircle size={14} />
                              Processed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber">
                              <AlertCircle size={14} />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id, doc.storage_path)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-cyan-blue/10 rounded-lg border border-cyan-blue/20">
            <h4 className="font-medium text-cyan-blue mb-2">How documents work</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Text files (.txt, .md) are processed immediately</li>
              <li>• PDF and Word documents will have their text extracted</li>
              <li>• Your agent will use document content to answer questions</li>
              <li>• Large documents may be truncated to fit context limits</li>
            </ul>
          </div>
        </div>
      </div>
  );
}
