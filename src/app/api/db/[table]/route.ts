import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = params;
        const { searchParams } = new URL(req.url);

        // Basic protection: Only allow specific tables
        const allowedTables = [
            'tenders', 'news', 'contractors', 'profiles', 'tender_categories',
            'authorities', 'states', 'portals', 'saved_tenders',
            'testimonials', 'homepage_metrics', 'seo_metadata',
            'contractor_profiles', 'contractor_projects', 'contractor_documents',
            'whatsapp_alerts', 'whatsapp_logs', 'email_logs', 'tender_drafts'
        ];

        if (!allowedTables.includes(table)) {
            return NextResponse.json({ error: 'Illegal table access' }, { status: 403 });
        }

        let query = `SELECT * FROM ${table}`;
        const values: any[] = [];
        const conditions: string[] = [];

        // Simple filtering (e.g. ?status=Active)
        searchParams.forEach((val, key) => {
            if (key !== 'order' && key !== 'limit' && key !== 'offset') {
                values.push(val);
                conditions.push(`${key} = $${values.length}`);
            }
        });

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        const order = searchParams.get('order'); // e.g. created_at.desc
        if (order) {
            const [col, dir] = order.split('.');
            query += ` ORDER BY ${col} ${dir === 'desc' ? 'DESC' : 'ASC'}`;
        }

        const limit = searchParams.get('limit');
        if (limit) {
            values.push(parseInt(limit));
            query += ` LIMIT $${values.length}`;
        }

        const result = await db.query(query, values);
        return NextResponse.json(result.rows);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = params;
        const body = await req.json();

        const keys = Object.keys(body);
        const values = Object.values(body);
        const cols = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING *`;
        const result = await db.query(query, values);

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = params;
        const body = await req.json();
        const { id, ...data } = body;

        const keys = Object.keys(data);
        const values = Object.values(data);
        values.push(id);

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`;

        const result = await db.query(query, values);
        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { table: string } }) {
    try {
        const { table } = params;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('ID required');

        await db.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
