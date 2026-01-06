import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  FileText,
  Image,
  Edit,
  Plus,
  Trash2,
  Eye,
  Save,
  Calendar,
  User,
  Shield,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function EditorDashboard() {
  const [user, setUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        window.location.href = '/';
      }
    };
    checkAuth();
  }, []);

  const { data: posts = [] } = useQuery({
    queryKey: ['editorPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date')
  });

  const { data: services = [] } = useQuery({
    queryKey: ['editorServices'],
    queryFn: () => base44.entities.Service.list()
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['editorPosts']);
      setIsDialogOpen(false);
      setEditingPost(null);
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BlogPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['editorPosts']);
      setIsDialogOpen(false);
      setEditingPost(null);
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['editorPosts'])
  });

  const handleSavePost = (postData) => {
    if (editingPost?.id) {
      updatePostMutation.mutate({ id: editingPost.id, data: postData });
    } else {
      createPostMutation.mutate({
        ...postData,
        author: user?.full_name || user?.email,
        published_date: new Date().toISOString().split('T')[0]
      });
    }
  };

  if (!user) return null;

  // Check editor role
  if (!['super_admin', 'admin', 'editor'].includes(user.admin_role) && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">Access Denied</h2>
            <p className="text-stone-500 mb-6">You don't have permission to access this area.</p>
            <Link to={createPageUrl('Home')}>
              <Button className="rounded-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-stone-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')} className="text-xl font-medium">Hairy</Link>
            <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-semibold">Editor</span>
          </div>
          <div className="flex items-center gap-4">
            {['super_admin', 'admin'].includes(user.admin_role) && (
              <Link to={createPageUrl('AdminDashboard')}>
                <Button variant="ghost" size="sm" className="text-stone-300 hover:text-white">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <span className="text-stone-400 text-sm">{user.email}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="blog">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm mb-6">
            <TabsTrigger value="blog" className="rounded-lg">Blog Posts</TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-lg">Gallery</TabsTrigger>
            <TabsTrigger value="content" className="rounded-lg">Service Descriptions</TabsTrigger>
          </TabsList>

          {/* Blog Posts */}
          <TabsContent value="blog">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Blog Posts</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg"
                      onClick={() => setEditingPost(null)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                    </DialogHeader>
                    <PostForm
                      post={editingPost}
                      onSave={handleSavePost}
                      isLoading={createPostMutation.isPending || updatePostMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden">
                          {post.cover_image ? (
                            <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-stone-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.published_date && format(new Date(post.published_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.is_published 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>

                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingPost(post);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500"
                            onClick={() => deletePostMutation.mutate(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {posts.length === 0 && (
                    <div className="text-center py-12 text-stone-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No blog posts yet. Create your first one!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery */}
          <TabsContent value="gallery">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Gallery Management</CardTitle>
                <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-stone-500">
                  <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">Gallery management coming soon</p>
                  <p className="text-sm">Upload and organize images for the website gallery</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Descriptions */}
          <TabsContent value="content">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Service Descriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map(service => (
                    <div key={service.id} className="p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            service.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                            service.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {service.gender}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm text-stone-600">{service.description || 'No description yet'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PostForm({ post, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image: post?.cover_image || '',
    category: post?.category || 'hair-care',
    is_published: post?.is_published || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Post title"
          className="mt-1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Slug</Label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            placeholder="post-url-slug"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(v) => setFormData({...formData, category: v})}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hair-care">Hair Care</SelectItem>
              <SelectItem value="styling-tips">Styling Tips</SelectItem>
              <SelectItem value="trends">Trends</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
              <SelectItem value="news">News</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Cover Image URL</Label>
        <Input
          value={formData.cover_image}
          onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
          placeholder="https://..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Excerpt</Label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          placeholder="Brief description..."
          className="mt-1"
          rows={2}
        />
      </div>

      <div>
        <Label>Content</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Write your post content..."
          className="mt-1"
          rows={8}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_published}
          onCheckedChange={(v) => setFormData({...formData, is_published: v})}
        />
        <Label>Publish immediately</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="bg-stone-900 hover:bg-stone-800">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Post
            </>
          )}
        </Button>
      </div>
    </form>
  );
}