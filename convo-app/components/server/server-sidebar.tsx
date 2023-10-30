import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { ChannelType, MemberRole } from "@prisma/client"
import { ServerHeader } from "./server-header"
import { ScrollArea } from "../ui/scroll-area"
import { ServerSearch } from "./server-search"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { channel } from "diagnostics_channel"
import { Separator } from "../ui/separator"
import { ServerSection } from "./server-section"
import { ServerChannel } from "./server-channel"
import { ServerMember } from "./server-member"

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
  [MemberRole.GUEST]: "",
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
}

export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {
  const profile = await currentProfile()
  if(!profile)
    return redirect("/")

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  })
  
  if(!server)
    return redirect("/")

  const textChannels = server?.channels.filter((channel: any) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel: any) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel: any) => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter((member: any) => member.profileId !== profile.id)

  const role = server.members.find((member: any) => member.profileId === profile.id)?.role 



  return (
    <div 
      className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]"
    >
      <ServerHeader 
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch 
            data={[
              {
                label: "Text Channel",
                type: "channel",
                data: textChannels?.map((channel: any) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Audio Channel",
                type: "channel",
                data: audioChannels?.map((channel: any) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Video Channel",
                type: "channel",
                data: videoChannels?.map((channel: any) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member: any) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection 
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel: any) => (
                <ServerChannel 
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection 
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Audio Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel: any) => (
                <ServerChannel 
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection 
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel: any) => (
                <ServerChannel 
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection 
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member: any) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
