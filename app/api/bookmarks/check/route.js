import connectDB from "@/config/database";
import User from "@/models/User";

import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';



// @desc    Checks the bookmarked status
// route    POST /api/bookmarks/check
export const POST = async (request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    const { propertyId } = await request.json();

    // check if the session user exists
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { userId } = sessionUser;

    // Find user in database
    const user = await User.findOne({ _id: userId });

    // Check if property is already bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId);

    
    return new Response(JSON.stringify({ isBookmarked}), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};


/*
NOTE:- The bookmark button should toggle based on whether it is bookmarked or not in the database.
But if we reload the page, there will be add to bookmark option. Why because the isBookmarked is getting updated only when we 
click the bookmark button. So it should check the status when loading the page. So the aim of ths route is to check that.
*/ 
