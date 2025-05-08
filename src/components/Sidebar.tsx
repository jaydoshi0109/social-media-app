import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { getUserByClerkId } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  LinkIcon, 
  MapPinIcon, 
  UserIcon, 
  UsersIcon, 
  BriefcaseIcon,
  ExternalLinkIcon
} from "lucide-react";
import { Badge } from "./ui/badge";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  // Extract first initials for avatar fallback
  const initials = user.name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="sticky top-20">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg rounded-2xl">
        {/* Header background with color gradient */}
        <div className="h-24 bg-gradient-to-r from-primary/40 to-primary/20 relative">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <Link
              href={`/profile/${user.username}`}
              className="group"
            >
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-900 shadow-xl group-hover:ring-4 ring-primary/20 transition-all">
                <AvatarImage src={user.image || "/avatar.png"} alt={user.name ?? ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>

        <CardContent className="pt-16 pb-6 px-6">
          {/* User info section */}
          <div className="flex flex-col items-center text-center mb-4">
            <Link
              href={`/profile/${user.username}`}
              className="group"
            >
              <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                {user.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                @{user.username}
              </p>
            </Link>

            {user.bio && (
              <div className="mt-3 text-sm text-muted-foreground rounded-lg">
                <p className="italic leading-relaxed">"{user.bio}"</p>
              </div>
            )}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 my-5">
            <Link
              href={`/profile/${user.username}/following`}
              className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-center gap-2">
                <UsersIcon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="font-bold text-lg group-hover:text-primary transition-colors">
                  {user._count.following}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1 group-hover:text-primary/70 transition-colors">
                Following
              </p>
            </Link>
            
            <Link
              href={`/profile/${user.username}/followers`}
              className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-center gap-2">
                <UserIcon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="font-bold text-lg group-hover:text-primary transition-colors">
                  {user._count.followers}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1 group-hover:text-primary/70 transition-colors">
                Followers
              </p>
            </Link>
          </div>

          {/* User details section */}
          <div className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <MapPinIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                <p className="font-medium truncate">
                  {user.location || "No location set"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <LinkIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Website</p>
                {user.website ? (
                  <a 
                    href={user.website} 
                    className="font-medium text-primary hover:underline flex items-center gap-1 truncate" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website.replace(/^https?:\/\//, '')}
                    <ExternalLinkIcon className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : (
                  <p className="font-medium truncate">No website</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <BriefcaseIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="text-xs text-muted-foreground mb-0.5">Member Since</p>
                <p className="font-medium">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          {/* Edit profile button */}
          <Link href={`/profile/${user.username}`} className="mt-4 block">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-primary/20 hover:border-primary/60 hover:bg-primary/5 mt-4"
            >
              Edit Profile
            </Button>
          </Link>
          
          {/* Tags section */}
          <div className="mt-4 pt-4 border-t border-dashed">
            <p className="text-xs text-muted-foreground mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-none">
                Photography
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-none">
                Travel
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-none">
                Tech
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card className="overflow-hidden border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg rounded-2xl">
      {/* Header background with color gradient */}
      <div className="h-16 bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
        <h2 className="text-white font-bold text-lg">Chatgram</h2>
      </div>
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl mb-2">Join Our Community</h3>
          <p className="text-sm text-muted-foreground">
            Connect with friends, share moments, and discover new content
          </p>
        </div>
        
        {/* Feature highlights */}
        <div className="space-y-3 mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <UsersIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Connect with others</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <LinkIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Share your experiences</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <MapPinIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Discover new content</p>
            </div>
          </div>
        </div>
        
        {/* Auth buttons */}
        <div className="space-y-3">
          <SignInButton mode="modal">
            <Button className="w-full rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-primary border border-primary/20" variant="outline">
              Log In
            </Button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-sm">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </CardContent>
    </Card>
  </div>
);