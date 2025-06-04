import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { image: imageBase64 } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json({ error: 'Image data is required.' }, { status: 400 });
    }

    try {
      const fetchResponseForBlob = await fetch(imageBase64);
      const imageBlob = await fetchResponseForBlob.blob();

      const gradioClient = await Client.connect("eccv2022/dis-background-removal");
      const result = await gradioClient.predict("/predict", { image: imageBlob });

      // Check if the structure is what we now expect
      if (
        result &&
        result.data &&
        Array.isArray(result.data) &&
        result.data.length > 0 &&
        typeof result.data[0] === 'object' && // It's an object now
        result.data[0] !== null &&             // Not null
        'url' in result.data[0] &&             // Has a 'url' property
        typeof result.data[0].url === 'string' // The 'url' is a string
      ) {
        const fileUrl = result.data[0].url;

        // Fetch the image from the URL provided by Gradio
        const imageResponse = await fetch(fileUrl);
        if (!imageResponse.ok) {
          console.error(`Failed to fetch processed image from Gradio URL: ${fileUrl}, status: ${imageResponse.status}`);
          return NextResponse.json({ error: 'Failed to retrieve processed image from service.' }, { status: 502 });
        }

        // Get the image data as an ArrayBuffer, then convert to Buffer, then to base64
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);
        const cleanedImageBase64 = `data:${imageResponse.headers.get('content-type') || 'image/png'};base64,${imageBuffer.toString('base64')}`;

        return NextResponse.json({ cleanedImageBase64 });

      } else {
        console.error("Unexpected response structure from Gradio service (after expecting file object):", JSON.stringify(result, null, 2));
        return NextResponse.json({ error: 'Image processing service returned an unexpected response format.' }, { status: 500 });
      }
    } catch (gradioError: any) {
      console.error("Error during Gradio client operation or fetching processed image:", JSON.stringify(gradioError, null, 2));
      let userErrorMessage = 'Failed to process image via the external service.';
      if (gradioError.message) {
        userErrorMessage += ` Details: ${gradioError.message.substring(0, 150)}${gradioError.message.length > 150 ? '...' : ''}`;
      }
      return NextResponse.json({ error: userErrorMessage }, { status: 502 });
    }
  } catch (serverError: any) {
    console.error("Internal server error in API route:", serverError);
    return NextResponse.json({ error: 'An internal server error occurred on our end.' }, { status: 500 });
  }
}
