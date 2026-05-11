import { ExternalLink, GitFork, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { featuredProjects, type Project } from '../data/profile';

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  pushed_at: string;
};

const githubApi = 'https://api.github.com/users/bfaulk96/repos?sort=pushed&per_page=8';

function repoToProject(repo: GitHubRepo): Project & { stars: number; forks: number } {
  return {
    name: repo.name,
    description: repo.description ?? 'Public GitHub repository from Brandon Faulkner.',
    href: repo.html_url,
    stack: [repo.language ?? 'Code'],
    status: repo.archived ? 'Archived' : 'Recently updated',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
  };
}

export function ProjectGrid() {
  const [projects, setProjects] = useState<(Project & { stars?: number; forks?: number })[]>(featuredProjects);
  const [source, setSource] = useState('Curated');

  useEffect(() => {
    let cancelled = false;

    fetch(githubApi)
      .then((response) => {
        if (!response.ok) throw new Error('GitHub request failed');
        return response.json() as Promise<GitHubRepo[]>;
      })
      .then((repos) => {
        if (cancelled) return;
        const publicRepos = repos
          .filter((repo) => !repo.fork)
          .filter((repo) => repo.name !== 'brandon-web')
          .sort((a, b) => {
            if (a.stargazers_count === b.stargazers_count) {
              return Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
            }
            return b.stargazers_count - a.stargazers_count;
          })
          .slice(0, 6)
          .map(repoToProject);

        if (publicRepos.length > 0) {
          const [brandonWeb, allRepos] = featuredProjects;
          setProjects([brandonWeb, ...publicRepos, allRepos]);
          setSource('GitHub');
        }
      })
      .catch(() => {
        setSource('Fallback');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="project-panel" aria-labelledby="project-heading">
      <div className="section-kicker">projects · {source}</div>
      <h2 id="project-heading">Selected build surfaces</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.name}>
            <div>
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
                  <ExternalLink size={17} />
                </a>
              </div>
              <p>{project.description}</p>
            </div>
            <footer>
              <div className="tag-row">
                {project.stack.slice(0, 4).map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-meta">
                <span>{project.status}</span>
                {project.stars !== undefined ? (
                  <span className="repo-stat">
                    <Star size={14} /> {project.stars}
                  </span>
                ) : null}
                {project.forks !== undefined ? (
                  <span className="repo-stat">
                    <GitFork size={14} /> {project.forks}
                  </span>
                ) : null}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
