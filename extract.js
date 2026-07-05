const fs = require('fs');
const content = fs.readFileSync('C:/Users/Home/.gemini/antigravity-ide/brain/21842f01-dc2e-4313-b728-497d6fa3953b/.system_generated/steps/557/content.md', 'utf8');

// Find the article entry content
const articleStart = content.indexOf('fusion-post-content');
const articleEnd = content.indexOf('fusion-author-widget', articleStart);
const articleSection = content.substring(articleStart, articleEnd > -1 ? articleEnd : content.length);

// Strip HTML tags
const stripped = articleSection
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ')
  .replace(/&#8217;/g, "'")
  .replace(/&#8220;/g, '"')
  .replace(/&#8221;/g, '"')
  .replace(/&#8211;/g, '-')
  .replace(/&#8230;/g, '...')
  .replace(/\s{3,}/g, '\n\n')
  .trim();

console.log(stripped.substring(0, 8000));
