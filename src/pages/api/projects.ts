import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import type { Project, ProjectFromDB } from '../../lib/types';

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

export const GET: APIRoute = async () => {
  try {
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
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const transformedProjects = projects.map(transformProject);

    return new Response(JSON.stringify(transformedProjects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}