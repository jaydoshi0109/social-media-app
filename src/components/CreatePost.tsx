"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { 
  ImageIcon, 
  Loader2Icon, 
  SendIcon, 
  XIcon, 
  SmileIcon,
  SparklesIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        // reset the form
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        setIsFocused(false);

        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const expandTextarea = () => {
    setIsFocused(true);
    // Focus the textarea after a short delay to ensure the animation has started
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  return (
    <Card className="mb-6 border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900">
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          {/* Header with user info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-sm">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <div className="font-medium text-sm">
              {user?.fullName || "You"}
            </div>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <SparklesIcon className="h-4 w-4" />
                <span className="sr-only">Inspiration</span>
              </Button>
            </div>
          </div>

          {/* Expandable textarea area */}
          <div 
            className={`relative rounded-xl bg-muted/20 transition-all duration-300 ${isFocused ? 'p-4' : 'p-2'}`}
            onClick={!isFocused ? expandTextarea : undefined}
          >
            <Textarea
              ref={textareaRef}
              placeholder={isFocused ? "What's on your mind?" : "Click to start a new post..."}
              className={`min-h-[40px] resize-none border-none focus-visible:ring-0 p-0 text-base bg-transparent placeholder:text-muted-foreground/70 transition-all duration-300 ${
                isFocused ? 'min-h-[120px]' : ''
              }`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
              onFocus={() => setIsFocused(true)}
            />
            
            {isFocused && !content && !isPosting && (
              <div className="absolute bottom-4 right-4 text-sm text-muted-foreground/60 pointer-events-none">
                Share your thoughts...
              </div>
            )}
          </div>

          {/* Image upload area with animation */}
          <AnimatePresence>
            {(showImageUpload || imageUrl) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl overflow-hidden"
              >
                <div className="relative border rounded-xl p-4 bg-muted/10">
                  {!imageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => setShowImageUpload(false)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  )}
                  <ImageUpload
                    endpoint="postImage"
                    value={imageUrl}
                    onChange={(url) => {
                      setImageUrl(url);
                      if (!url) setShowImageUpload(false);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded action toolbar */}
          {isFocused && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between border-t pt-4"
            >
              <div className="flex space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  disabled={isPosting}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span className="text-xs font-medium">Add Photo</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9"
                  disabled={isPosting}
                >
                  <SmileIcon className="h-4 w-4 mr-2" />
                  <span className="text-xs font-medium">Feeling</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 h-9 border-muted-foreground/30 text-xs"
                  onClick={() => {
                    setContent("");
                    setImageUrl("");
                    setShowImageUpload(false);
                    setIsFocused(false);
                  }}
                  disabled={isPosting}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-full px-5 h-9 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-xs font-medium shadow-sm"
                  onClick={handleSubmit}
                  disabled={(!content.trim() && !imageUrl) || isPosting}
                >
                  {isPosting ? (
                    <div className="flex items-center">
                      <Loader2Icon className="h-3 w-3 mr-2 animate-spin" />
                      <span>Posting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <SendIcon className="h-3 w-3 mr-2" />
                      <span>Post</span>
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Simple state when not focused */}
        {!isFocused && (
          <div className="px-4 pb-4 flex justify-between items-center border-t pt-3 mt-2">
            <div className="text-xs text-muted-foreground">
              Share your updates with the community
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={expandTextarea}
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Create Post</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CreatePost;