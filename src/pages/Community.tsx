import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, doc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useAuthStore } from '../stores/authStore';
import { Heart, MessageCircle, Share2, Flag, X, Users, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  isLiked: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  images: File[];
}

const COMMUNITY_RULES = [
  'Respeito acima de tudo - sem discurso de ódio',
  'Conteúdo construtivo e voltado para evolução',
  'Sem misoginia, machismo tóxico ou discurso de ódio',
  'Conteúdo sexual apenas em áreas apropriadas',
  'Mantenha o foco em crescimento pessoal'
];

const COMMUNITY_TAGS = [
  'Introdução', 'Progresso', 'Dúvida', 'Motivação', 'Relacionamentos',
  'Treino', 'Alimentação', 'Sono', 'Leitura', 'Desafio', 'Vitória',
  'Frustração', 'Reflexão', 'Agradecimento', 'Pedido de Ajuda'
];

export default function Community() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    loadPosts();
  }, [selectedTag]);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const postsRef = collection(db, 'posts');
      let q = query(
        postsRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      if (selectedTag) {
        q = query(q, where('tags', 'array-contains', selectedTag));
      }

      const querySnapshot = await getDocs(q);
      const postsData: Post[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          userId: data.userId,
          userName: data.userName || 'Usuário Anônimo',
          userAvatar: data.userAvatar,
          title: data.title,
          content: data.content,
          images: data.images || [],
          tags: data.tags || [],
          likes: data.likes || 0,
          comments: data.comments || 0,
          isLiked: false,
          isActive: data.isActive,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });

      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        where('isActive', '==', true),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const commentsData: Comment[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        commentsData.push({
          id: doc.id,
          postId: data.postId,
          userId: data.userId,
          userName: data.userName || 'Usuário Anônimo',
          userAvatar: data.userAvatar,
          content: data.content,
          likes: data.likes || 0,
          isLiked: false,
          isActive: data.isActive,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });

      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleCreatePost = async (data: CreatePostData) => {
    try {
      const now = new Date().toISOString();
      const newPostData = {
        userId: user?.id || 'guest',
        userName: user?.name || 'Usuário Anônimo',
        title: data.title,
        content: data.content,
        images: [],
        tags: data.tags,
        likes: 0,
        comments: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'posts'), newPostData);

      const newPost: Post = {
        id: docRef.id,
        ...newPostData,
        isLiked: false
      } as Post;

      setPosts([newPost, ...posts]);
      setShowCreatePost(false);
      toast.success('Post criado com sucesso!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erro ao criar post. Tente novamente.');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newLikeCount = post.isLiked ? post.likes - 1 : post.likes + 1;
      const newIsLiked = !post.isLiked;

      const docRef = doc(db, 'posts', postId);
      await updateDoc(docRef, { likes: newLikeCount });

      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, likes: newLikeCount, isLiked: newIsLiked }
          : p
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCreateComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;

    try {
      const now = new Date().toISOString();
      const commentData = {
        postId: selectedPost.id,
        userId: user.id,
        userName: user.name,
        content: newComment.trim(),
        likes: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);

      const newCommentData: Comment = {
        id: docRef.id,
        ...commentData
      } as Comment;

      setComments([...comments, newCommentData]);
      setNewComment('');

      // Update post comment count
      const postRef = doc(db, 'posts', selectedPost.id);
      await updateDoc(postRef, {
        comments: selectedPost.comments + 1
      });

      setPosts(posts.map(p =>
        p.id === selectedPost.id
          ? { ...p, comments: p.comments + 1 }
          : p
      ));

      setSelectedPost({ ...selectedPost, comments: selectedPost.comments + 1 });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleReportContent = async (type: 'post' | 'comment', id: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'reports'), {
        reporterId: user.id,
        targetId: id,
        targetType: type,
        reason: 'inappropriate',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      alert('Conteúdo reportado. Obrigado por ajudar a manter a comunidade segura.');
    } catch (error) {
      console.error('Error reporting content:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando comunidade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Comunidade e Identidade Masculina</h1>
              <p className="text-sm sm:text-base text-gray-600">Conecte-se com outros homens na jornada de evolução</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Criar post</span>
          </button>
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag('')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${selectedTag === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Todos
          </button>
          {COMMUNITY_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4 sm:space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {post.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{post.userName}</div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReportContent('post', post.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    loadComments(post.id);
                  }}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum post ainda
            </h3>
            <p className="text-gray-600 mb-4">
              Seja o primeiro a compartilhar sua jornada!
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar primeiro post
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          comments={comments}
          newComment={newComment}
          onClose={() => setSelectedPost(null)}
          onLikePost={handleLikePost}
          onCreateComment={handleCreateComment}
          onSetNewComment={setNewComment}
          onReportContent={handleReportContent}
        />
      )}

      {/* Community Rules - Disclaimer */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Regras da Comunidade</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {COMMUNITY_RULES.map((rule, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CreatePostModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Por favor, preencha título e conteúdo');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags,
        images: []
      });
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Erro ao criar post. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Criar novo post</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dê um título para seu post..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Compartilhe sua experiência, dúvida ou reflexão..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMUNITY_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PostDetailModal({
  post,
  comments,
  newComment,
  onClose,
  onLikePost,
  onCreateComment,
  onSetNewComment,
  onReportContent
}: {
  post: Post;
  comments: Comment[];
  newComment: string;
  onClose: () => void;
  onLikePost: (postId: string) => void;
  onCreateComment: () => void;
  onSetNewComment: (value: string) => void;
  onReportContent: (type: 'post' | 'comment', id: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Discussão</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Post Content */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {post.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{post.userName}</div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex items-center space-x-2 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button
                onClick={() => onReportContent('post', post.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Flag className="h-4 w-4" />
                <span className="text-sm">Reportar</span>
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-900">
              Comentários ({comments.length})
            </h4>

            {comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{comment.userName}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                <div className="flex items-center space-x-2">
                  <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                    Curtir
                  </button>
                  <button
                    onClick={() => onReportContent('comment', comment.id)}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Reportar
                  </button>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Seja o primeiro a comentar!</p>
              </div>
            )}
          </div>

          {/* New Comment Input */}
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => onSetNewComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escreva um comentário..."
              />
            </div>
            <button
              onClick={onCreateComment}
              disabled={!newComment.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}