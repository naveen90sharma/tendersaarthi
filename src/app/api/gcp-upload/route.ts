import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
    try {
        const { filename, contentType } = await request.json();

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: 'Filename and content type are required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const bucketName = process.env.GCP_BUCKET_NAME!;
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(filename);

        // Generate a v4 signed URL for uploading
        const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType: contentType,
        });

        // The public URL to access the file after upload
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

        return NextResponse.json({ url, publicUrl, key: filename }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Error generating GCS signed URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate GCS signed URL: ' + error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
