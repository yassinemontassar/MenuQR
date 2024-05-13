import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { createApi } from "unsplash-js";

export async function GET(req: Request, res: NextApiResponse) {
    
  const {searchParams} = new URL(req.url);
  const name= searchParams.get("query") || "random";

    // Create an instance of the Unsplash API using the provided access key.
    const api = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
    });
   
    try {
      const result = await api.search.getPhotos({
        query: name,
        page: 1,
        perPage: 30,
        orientation: "squarish",
        orderBy: "relevant",
        

      });
  
      if (result.type === 'success') {
        return NextResponse.json(result.response);
      } else {
        // Handle the case where the Unsplash API does not return a success type.
        return new Response(JSON.stringify({ message: 'Failed to fetch images from Unsplash' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      // Handle any errors that occur during the API call.
      return new Response(JSON.stringify({ message: 'Error fetching images from Unsplash', error }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
 