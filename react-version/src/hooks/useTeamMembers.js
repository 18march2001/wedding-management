import { useState, useEffect } from 'react';
import { fetchTeamMembers } from '../services/api';

const FALLBACK_MEMBERS = [
  { id: 1, name: 'Anil Chauhan - Founder', designation: 'Founder', profile_description: "With over 6 years of experience in wedding and commercial photography, Anil Chauhan has an eye for detail and a passion for capturing the essence of every moment. His work is a blend of traditional techniques and modern innovation, creating images that are both timeless and unique.", image: '/images/ACP LATEST.jpg' },
  { id: 2, name: 'Preet Patel - Lead Photographer', designation: 'Lead Photographer', profile_description: "Specializing in wedding photography for the past 4 years, Preet Patel has a natural talent for capturing the beauty and emotion of your special day. His approach is unobtrusive, allowing him to capture candid moments that truly reflect the joy and love of the occasion.", image: '/images/ACP LATEST.jpg' },
  { id: 3, name: 'Chikki - Product Photographer', designation: 'Product Photographer', profile_description: "With over 5 years of experience in product photography, Chikki is the creative force behind our commercial product shoots. His expertise lies in highlighting the unique features of each product, creating images that stand out in a competitive market.", image: '/images/ACP LATEST.jpg' },
];

export function useTeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers()
      .then((data) => {
        if (!data?.length) { setMembers(FALLBACK_MEMBERS); return; }
        setMembers(data.map((m) => ({ ...m, image: '/images/ACP LATEST.jpg' })));
      })
      .catch(() => setMembers(FALLBACK_MEMBERS))
      .finally(() => setLoading(false));
  }, []);

  return { members, loading };
}
