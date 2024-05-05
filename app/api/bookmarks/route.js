import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// @desc    Get bookmarked properties
// route    GET /api/bookmarks
export const GET = async () => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    // check if the session user exists
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { userId } = sessionUser;
    // Find user in database
    const user = await User.findOne({ _id: userId });

    // Get users bookmarks
    const bookmarks = await Property.find({ _id: {$in: user.bookmarks}});

    return new Response(JSON.stringify( bookmarks ), { status: 200 });

  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// @desc    Bookmark property
// route    POST /api/bookmarks
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

    let message;

    if (isBookmarked) {
      // If already bookmarked, remove it
      user.bookmarks.pull(propertyId);
      message = "Bookmark removed successfully";
      isBookmarked = false;
    } else {
      // If not bookmarked, add it
      user.bookmarks.push(propertyId);
      message = "Bookmark added successfully";
      isBookmarked = true;
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

/**
 *NOTE: 
  The line export const dynamic = 'force-dynamic'; is used in Next.js to force dynamic server-side rendering (SSR) for the specific route file.
By default, Next.js tries to statically pre-render pages whenever possible for better performance. However, there are cases where you might need to dynamically render a page on the server for every request, for example, when you need to fetch data that can change for each request [bookmark or unbookmark] or when you need to access session data or cookies.
Setting dynamic = 'force-dynamic' tells Next.js to skip static pre-rendering and always server-render the page dynamically. This means that for every incoming request, Next.js will execute the server-side code in the route file (in this case, the API route handler) to generate the response.
This is often used for API routes or pages that require access to session data or cookies, as you cannot access these during the static pre-rendering phase. By forcing dynamic rendering, you ensure that the server-side code runs on every request, allowing you to access and manipulate session data, cookies, or perform other server-side operations as needed.
Note that dynamic rendering can have a performance impact, as the page needs to be rendered on the server for every request. Therefore, it's generally recommended to use dynamic = 'force-dynamic' judiciously and only for routes that truly require dynamic server-side rendering.
 This works locally without this line, when you host it to vercel it will show an error. 
In the next js documentation, it says the dynamic option is auto by default, but if you do not explicitly set dynamic to force-dynamic, it will show an error while hosting to vercel.
 */
