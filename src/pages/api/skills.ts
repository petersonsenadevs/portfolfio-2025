import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import type { Skill, SkillFromDB } from '../../lib/types';

function transformSkill(skill: SkillFromDB): Skill {
  return {
    id: skill.id,
    name: skill.name,
    icon: skill.icon_url,
    category: skill.category,
    description: {
      en: skill.description_en,
      es: skill.description_es
    }
  };
}

export const GET: APIRoute = async () => {
  try {
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const transformedSkills = skills.map(transformSkill);

    return new Response(JSON.stringify(transformedSkills), {
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