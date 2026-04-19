import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const UserAvtar = () => {
    return <Avatar>
        <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="shadcn img"
            className="grayscale"
        />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
}