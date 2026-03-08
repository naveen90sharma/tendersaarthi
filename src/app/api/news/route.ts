import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        const result = await db.query(
            'SELECT * FROM news ORDER BY published_at DESC LIMIT $1',
            [limit]
        );

        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('API News Fetch Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
