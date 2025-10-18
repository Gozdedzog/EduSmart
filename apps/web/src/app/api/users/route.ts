import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Try multiple possible paths for the users file
const POSSIBLE_PATHS = [
  path.join('/app', 'data', 'kullanici-verileri.json'),
  path.join(process.cwd(), 'data', 'kullanici-verileri.json'),
  path.join(process.cwd(), '..', '..', 'data', 'kullanici-verileri.json'),
  '/app/data/kullanici-verileri.json',
  './data/kullanici-verileri.json'
];

function findUsersFile(): string | null {
  for (const filePath of POSSIBLE_PATHS) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

// GET - Tüm kullanıcıları getir
export async function GET() {
  try {
    const usersFile = findUsersFile();
    if (!usersFile) {
      console.error('Users file not found in any of the expected locations');
      return NextResponse.json({ error: 'Users file not found' }, { status: 404 });
    }
    
    console.log('Reading users file from:', usersFile);
    const data = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(data);
    console.log('Successfully loaded users:', users.kullanicilar?.length || 0);
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
    
    const usersFile = findUsersFile();
    if (!usersFile) {
      console.error('Users file not found for saving');
      return NextResponse.json({ error: 'Users file not found' }, { status: 404 });
    }
    
    fs.writeFileSync(usersFile, JSON.stringify({ kullanicilar }, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving users:', error);
    return NextResponse.json({ error: 'Failed to save users' }, { status: 500 });
  }
}
