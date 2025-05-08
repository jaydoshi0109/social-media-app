import { getRandomUsers } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";

async function WhoToFollow() {
  const users = await getRandomUsers();

  if (users.length === 0) return null;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 mt-6">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg font-semibold text-primary/90">Who to Follow</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-5">
          {users.map((user) => (
            <div key={user.id} className="flex gap-3 items-center justify-between hover:bg-muted/20 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${user.username}`} className="hover:opacity-90 transition-opacity">
                  <Avatar className="border-2 border-background">
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-sm">
                  <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer hover:text-primary transition-colors">
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground text-xs">@{user.username}</p>
                  <p className="text-muted-foreground text-xs">{user._count.followers} followers</p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default WhoToFollow;