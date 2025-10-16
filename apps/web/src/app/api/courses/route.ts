import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const COURSES_FILE = path.join(process.cwd(), '..', '..', 'data', 'egitim-verileri.json');

// GET - Tüm eğitimleri getir
export async function GET() {
  try {
    const data = fs.readFileSync(COURSES_FILE, 'utf8');
    const courses = JSON.parse(data);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error reading courses file:', error);
    return NextResponse.json({ error: 'Failed to read courses' }, { status: 500 });
  }
}

// POST - Eğitimleri kaydet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { egitimler } = body;
    
    if (!egitimler) {
      return NextResponse.json({ error: 'egitimler is required' }, { status: 400 });
    }
    
    fs.writeFileSync(COURSES_FILE, JSON.stringify({ egitimler }, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving courses:', error);
    return NextResponse.json({ error: 'Failed to save courses' }, { status: 500 });
  }
}
