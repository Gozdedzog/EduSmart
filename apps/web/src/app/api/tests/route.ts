import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TESTS_FILE = path.join(process.cwd(), '..', '..', 'data', 'test-verileri.json');

// GET - Tüm testleri getir
export async function GET() {
  try {
    const data = fs.readFileSync(TESTS_FILE, 'utf8');
    const tests = JSON.parse(data);
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error reading tests file:', error);
    return NextResponse.json({ error: 'Failed to read tests' }, { status: 500 });
  }
}