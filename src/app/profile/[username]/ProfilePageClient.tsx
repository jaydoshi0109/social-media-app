"use client";

import { getProfileByUsername, getUserPosts, updateProfile } from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
}

function ProfilePageClient({
  isFollowing: initialIsFollowing,
  likedPosts,
  posts,
  user,
}: ProfilePageClientProps) {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Banner Section */}
      <div className="relative mb-8">
        <div className="h-48 w-full bg-gradient-to-r from-primary/30 to-primary/10 rounded-lg shadow-md"></div>
        
        <div className="absolute -bottom-16 left-8 flex items-end">
          <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
            <AvatarImage src={user.image ?? "/avatar.png"} />
          </Avatar>
        </div>
        
        {/* Follow/Edit Button - Positioned on the right */}
        <div className="absolute bottom-4 right-6">
          {!currentUser ? (
            <SignInButton mode="modal">
              <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">Follow</Button>
            </SignInButton>
          ) : isOwnProfile ? (
            <Button 
              className="rounded-full px-6 shadow-md hover:shadow-lg transition-all bg-white text-black hover:bg-gray-100"
              onClick={() => setShowEditDialog(true)}
            >
              <EditIcon className="size-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button
              className={`rounded-full px-8 shadow-md hover:shadow-lg transition-all ${
                isFollowing ? "bg-white text-primary hover:bg-gray-100" : ""
              }`}
              onClick={handleFollow}
              disabled={isUpdatingFollow}
              variant={isFollowing ? "outline" : "default"}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="pt-16 px-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{user.name ?? user.username}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          
          {user.bio && (
            <p className="mt-4 text-sm leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          )}
          
          {/* User Info Cards */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1 bg-muted/30 px-3 py-1 rounded-full">
                <MapPinIcon className="size-3" />
                <span>{user.location}</span>
              </div>
            )}
            
            {user.website && (
              <div className="flex items-center gap-1 bg-muted/30 px-3 py-1 rounded-full">
                <LinkIcon className="size-3" />
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  className="hover:underline text-primary/80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-1 bg-muted/30 px-3 py-1 rounded-full">
              <CalendarIcon className="size-3" />
              <span>Joined {formattedDate}</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-4 mt-6 mb-8">
            <Card className="flex-1 bg-white/50 hover:bg-white/80 transition-colors border shadow-sm">
              <CardContent className="flex items-center p-4">
                <UserIcon className="size-5 mr-3 text-primary/70" />
                <div>
                  <p className="font-semibold text-lg">{user._count.posts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1 bg-white/50 hover:bg-white/80 transition-colors border shadow-sm">
              <CardContent className="flex items-center p-4">
                <UsersIcon className="size-5 mr-3 text-primary/70" />
                <div>
                  <p className="font-semibold text-lg">{user._count.followers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1 bg-white/50 hover:bg-white/80 transition-colors border shadow-sm">
              <CardContent className="flex items-center p-4">
                <UsersIcon className="size-5 mr-3 text-primary/70" />
                <div>
                  <p className="font-semibold text-lg">{user._count.following.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-8 py-4 font-semibold transition-all"
            >
              <FileTextIcon className="size-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-8 py-4 font-semibold transition-all"
            >
              <HeartIcon className="size-4" />
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 px-0">
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                  <FileTextIcon className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No posts yet</p>
                  <p className="text-sm mt-1">When {isOwnProfile ? "you post" : `${user.name || user.username} posts`}, they'll appear here.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6 px-0">
            <div className="space-y-6">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                  <HeartIcon className="size-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No liked posts</p>
                  <p className="text-sm mt-1">Posts {isOwnProfile ? "you've" : `${user.name || user.username} has`} liked will appear here.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <Input
                name="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Your name"
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bio</Label>
              <Textarea
                name="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="min-h-[120px] focus-visible:ring-primary"
                placeholder="Tell us about yourself"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Location</Label>
              <Input
                name="location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="Where are you based?"
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Website</Label>
              <Input
                name="website"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                placeholder="Your personal website"
                className="focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-full px-5">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit} className="rounded-full px-5">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default ProfilePageClient;