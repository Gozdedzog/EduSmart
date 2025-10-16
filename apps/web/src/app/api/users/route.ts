import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), '..', '..', 'data', 'kullanici-verileri.json');

// GET - Tüm kullanıcıları getir
export async function GET() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error reading users file:', error);
    return NextResponse.json({ error: 'Failed to read users' }, { status: 500 });
  }
}

// POST - Kullanıcıları kaydet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kullanicilar } = body;
    
    if (!kullanicilar) {
      return NextResponse.json({ error: 'kullanicilar is required' }, { status: 400 });
    }
    
    fs.writeFileSync(USERS_FILE, JSON.stringify({ kullanicilar }, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving users:', error);
    return NextResponse.json({ error: 'Failed to save users' }, { status: 500 });
  }
}
