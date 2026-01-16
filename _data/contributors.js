import { execSync } from 'child_process';

export default function() {
  try {
    // Get commit authors
    const authors = execSync('git log --format="%aN" | sort -u', { encoding: 'utf-8' });
    
    // Get co-authors from commit messages
    let coAuthors = '';
    try {
      coAuthors = execSync('git log --format="%b" | grep -i "Co-authored-by:" | sed "s/Co-authored-by://gi" | sed "s/<.*>//g" | sort -u', { encoding: 'utf-8' });
    } catch (e) {
      coAuthors = '';
    }
    
    const authorList = authors
      .trim()
      .split('\n')
      .filter(name => name.length > 0)
      .map(name => `@${name.replace(/\s+/g, '')}`);
    
    const coAuthorList = coAuthors
      .trim()
      .split('\n')
      .filter(name => name.length > 0)
      .map(name => `@${name.trim().replace(/\s+/g, '')}`);
    
    const allContributors = [...new Set([...authorList, ...coAuthorList])];
    return allContributors.filter(c => c !== '@');
  } catch (error) {
    return ['@adamdjbrett'];
  }
}

