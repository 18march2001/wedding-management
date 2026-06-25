export interface DashboardStats {
  total_galleries: number;
  total_photos: number;
  total_videos: number;
  total_testimonials: number;
}

export interface DashboardMetrics {
  uploads_this_month: number;
  uploads_this_week: number;
  views_this_month: number;
  featured_items: number;
}

export interface RecentActivity {
  id: number;
  type: 'gallery' | 'photo' | 'video' | 'testimonial' | 'user';
  action: 'created' | 'updated' | 'deleted' | 'published';
  title: string;
  timestamp: string;
  user?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface DashboardData {
  stats: DashboardStats;
  metrics: DashboardMetrics;
  recent_activities: RecentActivity[];
  upload_trends: ChartData;
  gallery_breakdown: ChartData;
}
