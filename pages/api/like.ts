import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }
  try {
    // const { currentUser } = await serverAuth(req);
    const { currentId, postId } = req.body;

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new Error("Invalid ID");
    }
    let updatedLikedIds = [...(post.likedIds || [])];
    if (req.method === "POST") {
      updatedLikedIds.push(currentId);

      // NOTIFICATION PART START
      try {
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (post?.userId) {
          await prisma.notification.create({
            data: {
              body: "Someone liked your tweet!",
              userId: post.userId,
            },
          });

          await prisma.user.update({
            where: {
              id: post.userId,
            },
            data: {
              hasNotification: true,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END
    }
    if (req.method === "DELETE") {
      updatedLikedIds = updatedLikedIds.filter(
        (likedId) => likedId != currentId
      );
    }
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
