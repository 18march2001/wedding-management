const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchWebsiteSettings() {
  const response = await fetch(`${API_BASE_URL}/settings/website`);
  if (!response.ok) throw new Error(`Failed to fetch website settings: ${response.status}`);
  const json = await response.json();
  return json.data;
}

export async function fetchGalleryCategories() {
  const response = await fetch(`${API_BASE_URL}/gallery-categories`);
  if (!response.ok) throw new Error(`Failed to fetch gallery categories: ${response.status}`);
  const json = await response.json();
  return json.data;
}

export async function fetchGalleries() {
  const response = await fetch(`${API_BASE_URL}/galleries?per_page=100`);
  if (!response.ok) throw new Error(`Failed to fetch galleries: ${response.status}`);
  const json = await response.json();
  return json.data;
}

export async function fetchTestimonials() {
  const response = await fetch(`${API_BASE_URL}/testimonials`);
  if (!response.ok) throw new Error(`Failed to fetch testimonials: ${response.status}`);
  const json = await response.json();
  return json.data;
}

export async function fetchTeamMembers() {
  const response = await fetch(`${API_BASE_URL}/team-members?per_page=100`);
  if (!response.ok) throw new Error(`Failed to fetch team members: ${response.status}`);
  const json = await response.json();
  return json.data;
}

export async function fetchContactSettings() {
  const response = await fetch(`${API_BASE_URL}/contact-settings`);
  if (!response.ok) throw new Error(`Failed to fetch contact settings: ${response.status}`);
  return response.json();
}
