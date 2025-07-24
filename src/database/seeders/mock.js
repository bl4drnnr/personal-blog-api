/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      // Create test user
      await queryInterface.bulkInsert('users', [
        {
          id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          email: 'admin@example.com',
          password: '$2a$10$1HvnaYFhmlKAT/kmpA2rDOu3jSXqzRoBsbeFUrHLQoqKQgl8lsUba',
          first_name: 'Admin',
          last_name: 'User',
          is_mfa_set: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create user settings for MFA
      await queryInterface.bulkInsert('users_settings', [
        {
          id: 'da334f15-2ce1-4a00-b8cc-6ed9204860d2',
          two_fa_token: 'MNKFQUP6S77VONDE47A3B6VMFEPKVD5X',
          password_changed: null,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create site configuration
      await queryInterface.bulkInsert('site_config', [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          site_name: 'Personal Security Blog',
          site_description:
            'A blog about cybersecurity, technology, and development',
          site_author: 'Blog Author',
          site_url: 'https://example.com',
          default_image: 'https://example.com/og-default.jpg',
          keywords: 'cybersecurity, technology, web development, security',
          social_media: JSON.stringify({
            linkedin: 'https://linkedin.com/in/blogauthor',
            github: 'https://github.com/blogauthor'
          }),
          organization: JSON.stringify({
            name: 'Personal Security Blog',
            url: 'https://example.com',
            logo: 'https://example.com/logo.jpg'
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create sample articles
      await queryInterface.bulkInsert('articles', [
        {
          id: '11111111-1111-1111-1111-111111111111',
          title: 'Introduction to Cybersecurity',
          slug: 'introduction-to-cybersecurity',
          description:
            'A comprehensive guide to understanding cybersecurity fundamentals and best practices.',
          content: `<h1>Introduction to Cybersecurity</h1>\n<img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop" alt="Cybersecurity concept with digital locks" />\n<p>Cybersecurity is more important than ever in today's digital world. This article covers the fundamental concepts every professional should know.</p>`,
          excerpt:
            'Learn the fundamentals of cybersecurity including the CIA triad, risk assessment, and common attack vectors.',
          featured_image:
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
          tags: ['cybersecurity', 'security', 'fundamentals', 'risk-assessment'],
          published: true,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-15')
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          title: 'Modern Web Development Security',
          slug: 'modern-web-development-security',
          description:
            'Security considerations for modern web applications and development practices.',
          content: `<h1>Modern Web Development Security</h1>
<img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop" alt="Web development security code" />
<p>As web applications become more complex, security considerations must be built in from the ground up. This article explores essential security practices for modern development.</p>

<h2>Input Validation & Sanitization</h2>
<p>Never trust user input. Here's an example of proper input validation in Node.js:</p>
<pre><code class="language-javascript">
const validator = require('validator');
const DOMPurify = require('dompurify');

function validateUserInput(input) {
  // Check for XSS
  if (!validator.isLength(input, { min: 1, max: 1000 })) {
    throw new Error('Invalid input length');
  }
  
  // Sanitize HTML
  const cleanInput = DOMPurify.sanitize(input);
  
  // Additional validation
  if (validator.contains(cleanInput, '<script>')) {
    throw new Error('Potentially malicious input detected');
  }
  
  return cleanInput;
}
</code></pre>

<h2>SQL Injection Prevention</h2>
<img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop" alt="Database security concept" />
<p>Always use parameterized queries:</p>
<pre><code class="language-sql">
-- BAD: Vulnerable to SQL injection
SELECT * FROM users WHERE username = '" + userInput + "';

-- GOOD: Parameterized query
SELECT * FROM users WHERE username = $1;
</code></pre>

<h2>Authentication Security</h2>
<p>Implement robust authentication with proper hashing:</p>
<pre><code class="language-python">
import bcrypt
import secrets

def hash_password(password: str) -> str:
    # Generate a salt
    salt = bcrypt.gensalt(rounds=12)
    # Hash the password
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Generate secure session tokens
def generate_session_token() -> str:
    return secrets.token_urlsafe(32)
</code></pre>

<h2>HTTPS and TLS Configuration</h2>
<p>Proper TLS configuration is crucial. The probability of a successful man-in-the-middle attack decreases exponentially with proper implementation:</p>
<p>$$P_{attack} = e^{-\\alpha \\cdot TLS_{strength}}$$</p>
<p>Where α is the security coefficient and TLS strength includes cipher suite quality, certificate validation, and HSTS implementation.</p>

<h2>Content Security Policy (CSP)</h2>
<pre><code class="language-html">
&lt;meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' https://fonts.gstatic.com;"&gt;
</code></pre>

<h2>Security Headers Checklist</h2>
<ul>
<li>✅ Content-Security-Policy</li>
<li>✅ X-Frame-Options: DENY</li>
<li>✅ X-Content-Type-Options: nosniff</li>
<li>✅ Referrer-Policy: strict-origin-when-cross-origin</li>
<li>✅ Strict-Transport-Security</li>
</ul>`,
          excerpt:
            'Essential security practices for modern web development including input validation, SQL injection prevention, and proper authentication.',
          featured_image:
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop',
          tags: [
            'web development',
            'security',
            'best practices',
            'authentication',
            'xss'
          ],
          published: true,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-20'),
          updated_at: new Date('2024-01-20')
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          title: 'Understanding Cryptographic Hash Functions',
          slug: 'understanding-cryptographic-hash-functions',
          description:
            'Deep dive into cryptographic hash functions, their properties, and practical applications.',
          content: `<h1>Understanding Cryptographic Hash Functions</h1>
<img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop" alt="Cryptographic algorithms visualization" />
<p>Cryptographic hash functions are fundamental building blocks of modern cryptography. They transform input data of any size into a fixed-size string of bytes.</p>

<h2>Properties of Cryptographic Hash Functions</h2>
<p>A good cryptographic hash function must satisfy several properties:</p>

<h3>1. Deterministic</h3>
<p>The same input always produces the same output:</p>
<p>$$H(m) = h \\text{ where } m \\text{ is the message and } h \\text{ is the hash}$$</p>

<h3>2. Collision Resistance</h3>
<p>It should be computationally infeasible to find two different inputs that produce the same hash:</p>
<p>$$\\text{Find } m_1, m_2 \\text{ such that } H(m_1) = H(m_2) \\text{ and } m_1 \\neq m_2$$</p>

<h2>Popular Hash Functions</h2>
<img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=300&fit=crop" alt="Hash function comparison chart" />

<h3>SHA-256 Implementation Example</h3>
<pre><code class="language-python">
import hashlib
import hmac
import secrets

def sha256_hash(data: str) -> str:
    """Generate SHA-256 hash of input data"""
    return hashlib.sha256(data.encode()).hexdigest()

def verify_integrity(data: str, expected_hash: str) -> bool:
    """Verify data integrity using hash comparison"""
    actual_hash = sha256_hash(data)
    return hmac.compare_digest(actual_hash, expected_hash)

# Example usage
message = "Hello, World!"
hash_value = sha256_hash(message)
print(f"SHA-256 of '{message}': {hash_value}")

# Integrity verification
is_valid = verify_integrity(message, hash_value)
print(f"Data integrity check: {is_valid}")
</code></pre>

<h2>Birthday Paradox in Hash Functions</h2>
<p>The birthday attack exploits the birthday paradox. For a hash function with n-bit output, the probability of finding a collision after trying k different inputs is approximately:</p>
<p>$$P(collision) \\approx 1 - e^{-\\frac{k^2}{2 \\cdot 2^n}}$$</p>
<p>This means we only need to try about $\\sqrt{2^n}$ inputs to have a 50% chance of finding a collision.</p>

<h2>Merkle Trees</h2>
<img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=300&fit=crop" alt="Tree structure visualization" />
<p>Hash functions are used to build Merkle trees, essential in blockchain technology:</p>
<pre><code class="language-javascript">
class MerkleTree {
  constructor(data) {
    this.leaves = data.map(item => this.hash(item));
    this.tree = this.buildTree(this.leaves);
  }
  
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  buildTree(nodes) {
    if (nodes.length === 1) return nodes[0];
    
    const nextLevel = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1] || left; // Handle odd number of nodes
      nextLevel.push(this.hash(left + right));
    }
    
    return this.buildTree(nextLevel);
  }
  
  getRoot() {
    return this.tree;
  }
}

// Usage example
const data = ['transaction1', 'transaction2', 'transaction3', 'transaction4'];
const merkleTree = new MerkleTree(data);
console.log('Merkle Root:', merkleTree.getRoot());
</code></pre>

<h2>Hash Function Security Analysis</h2>
<table>
<thead>
<tr><th>Algorithm</th><th>Output Size</th><th>Security Level</th><th>Status</th></tr>
</thead>
<tbody>
<tr><td>MD5</td><td>128 bits</td><td>Broken</td><td>❌ Deprecated</td></tr>
<tr><td>SHA-1</td><td>160 bits</td><td>Weak</td><td>⚠️ Phasing out</td></tr>
<tr><td>SHA-256</td><td>256 bits</td><td>Strong</td><td>✅ Recommended</td></tr>
<tr><td>SHA-3</td><td>Variable</td><td>Strong</td><td>✅ Alternative</td></tr>
</tbody>
</table>

<blockquote>
<p>"In cryptography, we trust mathematics, not institutions." - Anonymous</p>
</blockquote>`,
          excerpt:
            'A comprehensive exploration of cryptographic hash functions, their mathematical properties, and real-world applications in security.',
          featured_image:
            'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=630&fit=crop',
          tags: [
            'cryptography',
            'hash functions',
            'security',
            'mathematics',
            'blockchain'
          ],
          published: true,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-25'),
          updated_at: new Date('2024-01-25')
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          title: 'Draft: Machine Learning in Cybersecurity',
          slug: 'draft-ml-cybersecurity',
          description:
            'Exploring the intersection of machine learning and cybersecurity for threat detection.',
          content: `<h1>Machine Learning in Cybersecurity</h1>
<p>This article is currently being written. It will cover how machine learning algorithms can be applied to enhance cybersecurity measures.</p>
<h2>Planned Topics</h2>
<ul>
<li>Anomaly detection algorithms</li>
<li>Behavioral analysis</li>
<li>Threat classification models</li>
<li>Neural networks for malware detection</li>
</ul>
<p><em>Coming soon...</em></p>`,
          excerpt:
            'A work-in-progress article exploring how machine learning enhances cybersecurity threat detection.',
          featured_image:
            'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=630&fit=crop',
          tags: [
            'machine learning',
            'AI',
            'cybersecurity',
            'draft',
            'threat-detection'
          ],
          published: false,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-28'),
          updated_at: new Date('2024-01-28')
        }
      ]);

      // Create sample projects
      await queryInterface.bulkInsert('projects', [
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          title: 'Security Monitoring Dashboard',
          slug: 'security-monitoring-dashboard',
          description:
            'A real-time security monitoring dashboard built with React and Node.js for comprehensive threat detection.',
          content: `<h1>Security Monitoring Dashboard</h1>\n<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop" alt="Security monitoring dashboard interface" />\n<p>This project provides real-time monitoring of security events and threats across enterprise infrastructure. Built with modern web technologies for scalability and performance.</p>`,
          featured_image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
          tags: [
            'security',
            'monitoring',
            'dashboard',
            'real-time',
            'threat-detection'
          ],
          technologies: [
            'React',
            'Node.js',
            'WebSocket',
            'PostgreSQL',
            'Redis',
            'Kafka'
          ],
          github_url: 'https://github.com/example/security-monitoring-dashboard',
          demo_url: 'https://security-dashboard-demo.example.com',
          featured: true,
          published: true,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-10'),
          updated_at: new Date('2024-01-10')
        },
        {
          id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          title: 'Personal Blog Platform',
          slug: 'personal-blog-platform',
          description:
            'A full-stack blog platform with Angular SSR and NestJS API, featuring SEO optimization and content management.',
          content: `<h1>Personal Blog Platform</h1>
<img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop" alt="Modern blog platform interface" />
<p>A modern, SEO-optimized blog platform featuring server-side rendering, content management, and comprehensive analytics. Built with Angular Universal and NestJS for optimal performance.</p>

<h2>System Architecture</h2>
<img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=300&fit=crop" alt="System architecture visualization" />
<p>The platform follows a clean architecture pattern with clear separation of concerns:</p>

<pre><code class="language-typescript">
// Domain Layer - Article Entity
export class Article {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly content: string,
    public readonly published: boolean,
    public readonly created_at: Date
  ) {}

  static create(data: CreateArticleData): Article {
    return new Article(
      generateId(),
      data.title,
      slugify(data.title),
      data.content,
      data.published || false,
      new Date()
    );
  }

  publish(): Article {
    return new Article(
      this.id,
      this.title,
      this.slug,
      this.content,
      true,
      this.created_at
    );
  }
}
</code></pre>

<h2>SEO Optimization Engine</h2>
<p>Dynamic SEO metadata generation with structured data:</p>
<pre><code class="language-typescript">
@Injectable()
export class SEOService {
  generateMetaTags(article: Article): MetaTags {
    const baseUrl = this.configService.get('SITE_URL');
    const canonicalUrl = \`\${baseUrl}/blog/\${article.slug}\`;
    
    return {
      title: \`\${article.title} | Personal Blog\`,
      description: article.excerpt || this.truncate(article.content, 160),
      keywords: article.tags.join(', '),
      canonical: canonicalUrl,
      openGraph: {
        type: 'article',
        title: article.title,
        description: article.excerpt,
        url: canonicalUrl,
        image: article.featured_image,
        site_name: 'Personal Blog',
        published_time: article.created_at.toISOString(),
        author: article.author.name
      },
      structured_data: this.generateArticleStructuredData(article)
    };
  }

  private generateArticleStructuredData(article: Article): any {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "image": article.featured_image,
      "author": {
        "@type": "Person",
        "name": article.author.name
      },
      "date_published": article.created_at.toISOString(),
      "date_modified": article.updated_at.toISOString()
    };
  }
}
</code></pre>

<h2>Content Management Interface</h2>
<img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=300&fit=crop" alt="Content management system interface" />
<pre><code class="language-typescript">
@Component({
  selector: 'app-article-editor',
  template: \`
    <div class="editor-container">
      <form [formGroup]="articleForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" 
                 (input)="generateSlug()" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Slug</mat-label>
          <input matInput formControlName="slug" readonly>
        </mat-form-field>

        <div class="content-editor">
          <quill-editor 
            formControlName="content"
            [modules]="editorModules"
            (onContentChanged)="onContentChange($event)">
          </quill-editor>
        </div>

        <div class="actions">
          <button mat-button type="button" 
                  (click)="saveDraft()">Save Draft</button>
          <button mat-raised-button color="primary" 
                  type="submit">Publish</button>
        </div>
      </form>
    </div>
  \`
})
export class ArticleEditorComponent {
  articleForm: FormGroup;
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['code-block', 'image', 'link'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
    ],
    syntax: true
  };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      content: ['', Validators.required],
      excerpt: [''],
      tags: [[]],
      published: [false]
    });
  }

  generateSlug(): void {
    const title = this.articleForm.get('title')?.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    this.articleForm.patchValue({ slug });
  }

  async onSubmit(): Promise<void> {
    if (this.articleForm.valid) {
      const article = await this.articleService.create(
        this.articleForm.value
      );
      this.router.navigate(['/admin/articles', article.id]);
    }
  }
}
</code></pre>

<h2>Performance Optimization</h2>
<p>The platform implements several performance optimization techniques:</p>

<h3>Build-time Route Generation</h3>
<pre><code class="language-javascript">
// scripts/generate-routes.js
const fetch = require('node-fetch');
const fs = require('fs');

async function generateRoutes() {
  const articlesResponse = await fetch(\`\${process.env.API_URL}/posts/slugs\`);
  const articles = await articlesResponse.json();
  
  const routes = [
    '/',
    '/blog',
    '/projects',
    '/contact',
    ...articles.map(article => \`/blog/\${article.slug}\`)
  ];

  const routesFile = \`
export const PRERENDER_ROUTES = \${JSON.stringify(routes, null, 2)};
  \`;

  fs.writeFileSync('src/prerender-routes.ts', routesFile);
  console.log(\`Generated \${routes.length} routes for prerendering\`);
}

generateRoutes().catch(console.error);
</code></pre>

<h3>Caching Strategy</h3>
<p>Multi-layer caching for optimal performance:</p>
<p>$$Cache\\_Hit\\_Ratio = \\frac{L1 + L2 \\cdot (1-L1) + L3 \\cdot (1-L1) \\cdot (1-L2)}{1}$$</p>
<p>Where L1 = Browser Cache, L2 = CDN Cache, L3 = Application Cache</p>

<h2>Key Features</h2>
<ul>
<li><strong>Server-side Rendering</strong> - Angular Universal for SEO and performance</li>
<li><strong>Static Pre-rendering</strong> - Build-time generation of static pages</li>
<li><strong>Content Management</strong> - Rich text editor with image upload</li>
<li><strong>SEO Optimization</strong> - Automatic meta tags and structured data</li>
<li><strong>Newsletter Integration</strong> - Subscriber management and email campaigns</li>
<li><strong>Analytics Dashboard</strong> - Visitor tracking and content performance</li>
<li><strong>Mobile Responsive</strong> - Optimized for all device sizes</li>
</ul>

<h2>Technology Stack</h2>
<ul>
<li><strong>Frontend:</strong> Angular 17, Angular Universal, Angular Material</li>
<li><strong>Backend:</strong> NestJS, TypeScript, JWT Authentication</li>
<li><strong>Database:</strong> PostgreSQL, Sequelize ORM</li>
<li><strong>Deployment:</strong> Docker, PM2, NGINX</li>
<li><strong>Testing:</strong> Jest, Karma, Cypress</li>
<li><strong>Build Tools:</strong> Angular CLI, Webpack</li>
</ul>`,
          featured_image:
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=630&fit=crop',
          tags: [
            'web development',
            'blog',
            'full-stack',
            'Angular',
            'NestJS',
            'SEO'
          ],
          technologies: [
            'Angular',
            'NestJS',
            'PostgreSQL',
            'Docker',
            'TypeScript',
            'Angular Universal'
          ],
          github_url: 'https://github.com/example/personal-blog-platform',
          published: false,
          demo_url: null,
          featured: true,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-05'),
          updated_at: new Date('2024-01-05')
        },
        {
          id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
          title: 'Automated Vulnerability Scanner',
          slug: 'automated-vulnerability-scanner',
          description:
            'An automated vulnerability scanning tool for web applications with ML-powered threat detection.',
          content: `<h1>Automated Vulnerability Scanner</h1>
<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" alt="Vulnerability scanning process visualization" />
<p>A comprehensive security scanning tool that combines traditional vulnerability detection techniques with machine learning algorithms for advanced threat identification.</p>

<h2>Core Scanning Engine</h2>
<p>The scanner implements multiple detection algorithms:</p>
<pre><code class="language-python">
import asyncio
import aiohttp
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class Vulnerability:
    type: str
    severity: str
    description: str
    location: str
    confidence: float
    payload: Optional[str] = None

class VulnerabilityScanner:
    def __init__(self):
        self.payloads = self.load_payloads()
        self.ml_model = self.load_ml_model()
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.session.close()

    async def scan_target(self, target_url: str) -> List[Vulnerability]:
        vulnerabilities = []
        
        # Traditional signature-based scanning
        vulnerabilities.extend(await self.sql_injection_scan(target_url))
        vulnerabilities.extend(await self.xss_scan(target_url))
        vulnerabilities.extend(await self.directory_traversal_scan(target_url))
        
        # ML-powered behavioral analysis
        ml_vulnerabilities = await self.ml_anomaly_detection(target_url)
        vulnerabilities.extend(ml_vulnerabilities)
        
        return self.deduplicate_findings(vulnerabilities)

    async def sql_injection_scan(self, url: str) -> List[Vulnerability]:
        vulnerabilities = []
        sql_payloads = [
            "' OR '1'='1",
            "' UNION SELECT NULL--",
            "'; DROP TABLE users--",
            "' AND (SELECT SUBSTRING(@@version,1,1))='5'--"
        ]
        
        for payload in sql_payloads:
            try:
                response = await self.session.get(
                    url, 
                    params={'id': payload},
                    timeout=10
                )
                
                if self.detect_sql_error(response.text):
                    confidence = self.calculate_confidence(response, payload)
                    
                    vulnerabilities.append(Vulnerability(
                        type='SQL_INJECTION',
                        severity=self.get_severity(confidence),
                        description=f'Potential SQL injection vulnerability detected',
                        location=url,
                        confidence=confidence,
                        payload=payload
                    ))
                    
            except asyncio.TimeoutError:
                continue
                
        return vulnerabilities
</code></pre>

<h2>Machine Learning Threat Detection</h2>
<img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop" alt="Machine learning algorithms visualization" />
<p>Advanced threat detection using ensemble learning:</p>
<pre><code class="language-python">
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

class MLThreatDetector:
    def __init__(self):
        self.anomaly_detector = IsolationForest(contamination=0.1)
        self.classifier = RandomForestClassifier(n_estimators=100)
        self.scaler = StandardScaler()
        self.feature_extractors = [
            self.extract_response_features,
            self.extract_timing_features,
            self.extract_header_features
        ]
    
    def extract_features(self, response_data: Dict) -> np.ndarray:
        """Extract numerical features from HTTP response data"""
        features = []
        
        for extractor in self.feature_extractors:
            features.extend(extractor(response_data))
            
        return np.array(features).reshape(1, -1)
    
    def extract_response_features(self, data: Dict) -> List[float]:
        """Extract features from HTTP response"""
        return [
            len(data.get('content', '')),
            data.get('status_code', 200),
            len(data.get('headers', {})),
            data.get('response_time', 0),
            self.calculate_entropy(data.get('content', ''))
        ]
    
    def calculate_entropy(self, text: str) -> float:
        """Calculate Shannon entropy of response content"""
        if not text:
            return 0
            
        probabilities = [text.count(c) / len(text) for c in set(text)]
        entropy = -sum(p * np.log2(p) for p in probabilities if p > 0)
        return entropy
    
    def predict_vulnerability(self, response_data: Dict) -> float:
        """Predict vulnerability probability using ML model"""
        features = self.extract_features(response_data)
        scaled_features = self.scaler.transform(features)
        
        # Anomaly detection score
        anomaly_score = self.anomaly_detector.decision_function(scaled_features)[0]
        
        # Classification probability
        class_probability = self.classifier.predict_proba(scaled_features)[0][1]
        
        # Ensemble score
        ensemble_score = (abs(anomaly_score) + class_probability) / 2
        
        return min(ensemble_score, 1.0)
</code></pre>

<h2>Vulnerability Scoring Algorithm</h2>
<p>CVSS-based scoring with custom weighting:</p>
<p>$$CVSS_{custom} = \\frac{AV \\times AC \\times Au}{3} \\times \\frac{C \\times I \\times A}{3} \\times ML_{confidence}$$</p>
<p>Where ML confidence adjusts the traditional CVSS score based on machine learning prediction accuracy.</p>

<h2>Reporting Dashboard</h2>
<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop" alt="Security reporting dashboard" />
<pre><code class="language-javascript">
// React component for vulnerability reporting
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';

const VulnerabilityReport = ({ scanResults }) => {
  const [severityData, setSeverityData] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);

  useEffect(() => {
    processScanResults(scanResults);
  }, [scanResults]);

  const processScanResults = (results) => {
    const severityCount = results.reduce((acc, vuln) => {
      acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
      return acc;
    }, {});

    const typeCount = results.reduce((acc, vuln) => {
      acc[vuln.type] = (acc[vuln.type] || 0) + 1;
      return acc;
    }, {});

    setSeverityData(Object.entries(severityCount).map(([key, value]) => ({
      severity: key,
      count: value
    })));

    setTypeDistribution(Object.entries(typeCount).map(([key, value]) => ({
      type: key,
      count: value
    })));
  };

  const SEVERITY_COLORS = {
    CRITICAL: '#d32f2f',
    HIGH: '#f57c00',
    MEDIUM: '#fbc02d',
    LOW: '#388e3c'
  };

  return (
    <div className="vulnerability-report">
      <div className="report-header">
        <h2>Security Scan Report</h2>
        <div className="scan-summary">
          <div className="metric">
            <span className="value">{scanResults.length}</span>
            <span className="label">Total Vulnerabilities</span>
          </div>
          <div className="metric">
            <span className="value">
              {scanResults.filter(v => v.severity === 'CRITICAL').length}
            </span>
            <span className="label">Critical Issues</span>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Severity Distribution</h3>
          <BarChart width={400} height={300} data={severityData}>
            <XAxis dataKey="severity" />
            <YAxis />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart">
          <h3>Vulnerability Types</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={typeDistribution}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {typeDistribution.map((entry, index) => (
                <Cell key={index} fill={SEVERITY_COLORS[entry.type] || '#8884d8'} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default VulnerabilityReport;
</code></pre>

<h2>Scan Types & Coverage</h2>
<table>
<thead>
<tr><th>Vulnerability Type</th><th>Detection Method</th><th>Accuracy</th><th>False Positive Rate</th></tr>
</thead>
<tbody>
<tr><td>SQL Injection</td><td>Signature + ML</td><td>94.2%</td><td>3.1%</td></tr>
<tr><td>XSS</td><td>Payload Testing</td><td>91.8%</td><td>4.7%</td></tr>
<tr><td>CSRF</td><td>Token Analysis</td><td>88.5%</td><td>2.3%</td></tr>
<tr><td>Directory Traversal</td><td>Path Manipulation</td><td>92.1%</td><td>1.8%</td></tr>
<tr><td>SSL/TLS Issues</td><td>Certificate Analysis</td><td>98.7%</td><td>0.5%</td></tr>
</tbody>
</table>

<h2>Key Features</h2>
<ul>
<li><strong>Automated Scanning</strong> - Scheduled and on-demand vulnerability scans</li>
<li><strong>ML-Enhanced Detection</strong> - Machine learning for improved accuracy</li>
<li><strong>Comprehensive Coverage</strong> - OWASP Top 10 and custom vulnerability checks</li>
<li><strong>API Integration</strong> - RESTful API for CI/CD pipeline integration</li>
<li><strong>Detailed Reporting</strong> - Executive and technical reports with remediation guidance</li>
<li><strong>False Positive Reduction</strong> - AI-powered filtering to reduce noise</li>
</ul>

<h2>Technology Stack</h2>
<ul>
<li><strong>Core Engine:</strong> Python 3.9, asyncio, aiohttp</li>
<li><strong>Machine Learning:</strong> scikit-learn, TensorFlow, pandas</li>
<li><strong>Web Interface:</strong> React, D3.js for visualizations</li>
<li><strong>Database:</strong> PostgreSQL, Redis for caching</li>
<li><strong>Deployment:</strong> Docker, Kubernetes</li>
<li><strong>API:</strong> FastAPI, OpenAPI documentation</li>
</ul>`,
          featured_image:
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
          tags: [
            'security',
            'automation',
            'vulnerability',
            'machine learning',
            'python'
          ],
          technologies: [
            'Python',
            'scikit-learn',
            'React',
            'PostgreSQL',
            'Docker',
            'FastAPI'
          ],
          github_url: 'https://github.com/example/vulnerability-scanner',
          published: true,
          demo_url: null,
          featured: false,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        }
      ]);
    } catch (e) {
      console.log('Error while creating seeders: ', e);
    }
  },

  async down(queryInterface, sequelize) {
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('articles', null, {});
    await queryInterface.bulkDelete('site_config', null, {});
    await queryInterface.bulkDelete('sessions', null, {});
    await queryInterface.bulkDelete('users_settings', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
