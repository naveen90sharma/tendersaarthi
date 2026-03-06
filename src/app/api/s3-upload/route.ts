import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: filename,
            ContentType: contentType,
        });

        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return NextResponse.json({ url: presignedUrl, key: filename }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Error generating pre-signed URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate pre-signed URL' },
            { status: 500, headers: corsHeaders }
        );
    }
}
