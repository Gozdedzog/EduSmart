// API'den eğitimleri getir
export async function getAllCourses() {
  try {
    const response = await fetch('/api/courses');
    const data = await response.json();
    return data.egitimler || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

// API'ye eğitimleri kaydet
export async function saveCoursesToFile(courses: any[]) {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ egitimler: courses }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving courses:', error);
    return false;
  }
}
