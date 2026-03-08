import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const now = new Date().toISOString();

        const result = await db.query(
            'SELECT * FROM tenders WHERE bid_end_ts > $1 ORDER BY created_at DESC LIMIT $2',
            [now, limit]
        );

        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('API Tender Fetch Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
