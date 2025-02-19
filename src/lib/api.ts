import { supabase } from './supabase';
import type { Project, ProjectFromDB } from './types';

// Project transformations
function transformProject(project: ProjectFromDB): Project {
  return {
    id: project.id,
    title: {
      en: project.title_en,
      es: project.title_es
    },
    description: {
      en: project.description_en,
      es: project.description_es
    },
    fullDescription: {
      en: project.full_description_en,
      es: project.full_description_es
    },
    image: project.image_url,
    category: project.category,
    tags: project.tags,
    features: project.project_features.map(feature => ({
      en: feature.feature_en,
      es: feature.feature_es
    })),
    demoUrl: project.demo_url,
    githubUrl: project.github_url
  };
}

// Project API calls
export async function getProjects(): Promise<Project[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_features (
        feature_en,
        feature_es
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return projects.map(transformProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_features (
        feature_en,
        feature_es
      )
    `)
    .eq('id', id)
    .single();

  if (error || !project) {
    console.error('Error fetching project:', error);
    return null;
  }

  return transformProject(project);
}

// Skill transformations
