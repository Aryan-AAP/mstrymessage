import dbConnect from "@/lib/dbConnect";
// import UserModel, { User } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/User";
import { User } from "lucide-react";


export async function DELETE(
    request: Request,
    { params }: { params: { messageid: string } }
  ) {
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      const updateResult=  await UserModel.updateOne({
            _id:user._id

        },{$pull:{messages:{_id:messageId}}}
    )
    if(updateResult.matchedCount==0){
        return Response.json(
            { success: false, message: 'Message not found or alreadydeleted' },
            { status: 404 }
          );
    }
    return Response.json(
        { success: true, message: 'Message Deleted' },
        { status: 200 }
      );
    } catch (error) {
        return Response.json(
            { success: false, message: 'Error deleting message' },
            { status: 500 }
          );
    }

}