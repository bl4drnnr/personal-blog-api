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

      // Portal
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/f451ebc8f5c47e1daf282998f15bfd50.svg
      // Pose
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/ac810f7950e98ad1cf3a46e60fcd82c3.svg
      // S
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/965c3cb2aa9bf6f812ef721f73fbac10.svg
      // Shift
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/25cdd93bd820e36a5ef33820443eea52.svg
      // Split
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/d1abe10b197577bc3a15ee9efb6f9e21.svg
      // Sun
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/eb0327ca2154373f354ab43d5a1af9d3.svg
      // Zag
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/08a78fdd5c643a25c217ad89bbf6460c.svg
      // Wing
      // https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/5941d31eb262701a3f1360406032dc7b.svg
      // Create static assets
      await queryInterface.bulkInsert('static_assets', [
        {
          id: '90000000-0000-0000-0000-000000000001',
          name: 'jonas-degener-tZT7eyJqkRA-unsplash.jpg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/jonas-degener-tZT7eyJqkRA-unsplash.jpg',
          description:
            'Abstract gradient background image used for hero sections and main banners.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000002',
          name: 'michiel-annaert-I1cx5LwM5pA-unsplash.jpg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/michiel-annaert-I1cx5LwM5pA-unsplash.jpg',
          description:
            'Technology-themed featured image for blog posts about programming and development.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000003',
          name: 'mike-hindle-BXvcjmM6dH8-unsplash.jpg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/mike-hindle-BXvcjmM6dH8-unsplash.jpg',
          description:
            'Modern workspace mockup image for showcasing web development projects.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000004',
          name: 'mike-hindle-f75bkyxq7mk-unsplash.jpg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/mike-hindle-f75bkyxq7mk-unsplash.jpg',
          description:
            'Professional headshot placeholder for author bio sections and about pages.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000005',
          name: 'mike-yukhtenko-wfh8dDlNFOk-unsplash.jpg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/mike-yukhtenko-wfh8dDlNFOk-unsplash.jpg',
          description:
            'Cybersecurity-themed banner image with digital locks and security concepts.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000006',
          name: 'pawel-czerwinski-SOHqP5gmvFU-unsplash.jpg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/pawel-czerwinski-SOHqP5gmvFU-unsplash.jpg',
          description:
            'Clean developer workspace with multiple monitors and modern setup for project showcases.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000007',
          name: 'pawel-czerwinski-tRm520JvK8Q-unsplash.jpg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/pawel-czerwinski-tRm520JvK8Q-unsplash.jpg',
          description:
            'Data visualization and analytics dashboard screenshot for monitoring projects.',
          created_at: new Date(),
          updated_at: new Date()
        },
        // SVG Icons for certificates
        {
          id: '90000000-0000-0000-0000-000000000008',
          name: 'Portal.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/f451ebc8f5c47e1daf282998f15bfd50.svg',
          description: 'Portal icon for certificate logos',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000009',
          name: 'Pose.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/ac810f7950e98ad1cf3a46e60fcd82c3.svg',
          description: 'Pose icon for certificate logos',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000010',
          name: 'S.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/965c3cb2aa9bf6f812ef721f73fbac10.svg',
          description: 'S icon for certificate logos',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000011',
          name: 'Shift.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/25cdd93bd820e36a5ef33820443eea52.svg',
          description: 'Shift icon for certificate logos',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000012',
          name: 'Split.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/d1abe10b197577bc3a15ee9efb6f9e21.svg',
          description: 'Split icon for certificate logos',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000013',
          name: 'Sun.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/eb0327ca2154373f354ab43d5a1af9d3.svg',
          description: 'Sun icon for certificate logos',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000014',
          name: 'Zag.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/08a78fdd5c643a25c217ad89bbf6460c.svg',
          description: 'Zag icon for certificate logos',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '90000000-0000-0000-0000-000000000015',
          name: 'Wing.svg',
          s3_url:
            'https://mikhail-bahdashych-personal-blog.s3.eu-central-1.amazonaws.com/static-assets/5941d31eb262701a3f1360406032dc7b.svg',
          description: 'Wing icon for certificate logos',
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
          published: false,
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
          published: true,
          featured: false,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        }
      ]);

      // Create about page content
      await queryInterface.bulkInsert('about_page', [
        {
          id: '00000000-0000-0000-0000-000000000001',
          title: "Hello, I'm Mikhail!",
          content: `
            <p>Welcome to my personal blog. I'm passionate about <strong>web development</strong>, <em>design</em>, and sharing knowledge with the world. Here you'll find my thoughts, projects, and more about my journey in tech and creativity.</p>
            
            <h3>My Expertise</h3>
            <p>I specialize in <strong>full-stack development</strong> with a focus on modern technologies. My experience spans across:</p>
            
            <ul>
              <li><strong>Frontend:</strong> Angular, React, Vue.js, TypeScript</li>
              <li><strong>Backend:</strong> Node.js, NestJS, Express, Python</li>
              <li><strong>Databases:</strong> PostgreSQL, MongoDB, Redis</li>
              <li><strong>Cloud:</strong> AWS, Google Cloud, Docker, Kubernetes</li>
            </ul>
            
            <h4>Philosophy & Approach</h4>
            <blockquote>
              "Great software is not just about clean code—it's about solving real problems and creating meaningful experiences for users."
            </blockquote>
            
            <p>I believe in <em>continuous learning</em> and staying up-to-date with the latest industry trends. Whether it's exploring new frameworks, contributing to <a href="https://github.com" target="_blank">open source projects</a>, or mentoring fellow developers, I'm always looking for ways to grow and give back to the community.</p>
            
            <h4>Recent Achievements</h4>
            <ol>
              <li>Led a team of 5 developers in migrating a legacy system to modern architecture</li>
              <li>Reduced application load time by <strong>60%</strong> through performance optimization</li>
              <li>Implemented CI/CD pipeline reducing deployment time from hours to minutes</li>
              <li>Conducted workshops on <em>TypeScript best practices</em> for junior developers</li>
            </ol>
            
            <h4>Let's Connect!</h4>
            <p>I'm always excited to discuss new opportunities, share knowledge, or collaborate on interesting projects. Feel free to <a href="/contact">reach out</a> if you'd like to connect!</p>
            
            <p><small>Last updated: January 2024</small></p>
          `,
          footer_text:
            'LUCH is a fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          hero_image_main_id: '90000000-0000-0000-0000-000000000001',
          hero_image_secondary_id: '90000000-0000-0000-0000-000000000001',
          hero_image_main_alt: 'Abstract Gradient Art',
          hero_image_secondary_alt: 'Abstract Gradient Art',
          logo_text: 'Luch',
          breadcrumb_text: 'About Me',
          hero_title: 'About Me',
          contact_tiles: JSON.stringify([
            {
              link: 'mailto:hello@luchcreative.com',
              image: 'assets/images/mail-send-fill.svg',
              alt: 'Mail Send',
              label: 'Email Us',
              sublabel: 'hello@luchcreative.com',
              target: '_blank'
            },
            {
              link: 'tel:+15551234567',
              image: 'assets/images/phone-fill.svg',
              alt: 'Phone',
              label: 'Call us',
              sublabel: '+1 (555) 123-4567',
              target: '_blank'
            },
            {
              link: 'https://t.me/LuchSupport',
              image: 'assets/images/message-2-fill.svg',
              alt: 'Message',
              label: 'Lets chat',
              sublabel: '@LuchSupport',
              target: '_blank'
            },
            {
              link: 'https://goo.gl/maps/xyz',
              image: 'assets/images/map-2-fill.svg',
              alt: 'Map',
              label: 'Visit us',
              sublabel: 'Dreamcity, USA',
              target: '_blank'
            }
          ]),
          meta_title: 'About Me - Personal Blog',
          meta_description:
            'Learn more about me, my expertise in full-stack development, and my journey in technology and creative problem solving.',
          meta_keywords:
            'about, full-stack developer, web development, technology, experience',
          og_title: 'About Me',
          og_description:
            'Passionate about web development, design, and sharing knowledge. Specializing in full-stack development with modern technologies.',
          og_image_id: '90000000-0000-0000-0000-000000000001',
          structured_data: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Mikhail',
            jobTitle: 'Full Stack Developer',
            description:
              'Passionate about web development, design, and sharing knowledge with the world.',
            url: 'https://example.com/about',
            knowsAbout: [
              'Angular',
              'React',
              'Vue.js',
              'TypeScript',
              'Node.js',
              'NestJS',
              'PostgreSQL',
              'MongoDB',
              'AWS',
              'Docker'
            ]
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create experiences
      const experience1Id = '10000000-0000-0000-0000-000000000001';
      const experience2Id = '10000000-0000-0000-0000-000000000002';

      await queryInterface.bulkInsert('experiences', [
        {
          id: experience1Id,
          company_name: 'Tech Company Inc.',
          logo_id: '90000000-0000-0000-0000-000000000014', // References LUCH-Framework-Bigger.svg
          company_website: 'https://techcompany.com',
          order: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: experience2Id,
          company_name: 'StartUp Solutions',
          logo_id: '90000000-0000-0000-0000-000000000015', // References S.svg
          company_website: 'https://startupsolutions.com',
          order: 1,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create positions
      await queryInterface.bulkInsert('positions', [
        {
          id: '20000000-0000-0000-0000-000000000001',
          title: 'Senior Software Engineer',
          start_date: '2023-01-01',
          end_date: null,
          description: `Leading development of full-stack applications using Angular, Node.js, and cloud technologies. Mentoring junior developers and driving technical decisions.
            
            <strong>Most Impactful Achievements:</strong>
            <ul>
              <li>Architected and implemented microservices architecture that improved system scalability by 300%</li>
              <li>Led migration from legacy PHP system to modern Angular/NestJS stack, reducing load times by 60%</li>
              <li>Established automated testing practices that increased code coverage from 30% to 85%</li>
              <li>Mentored 3 junior developers who were promoted to mid-level within 12 months</li>
              <li>Implemented CI/CD pipeline that reduced deployment time from 2 hours to 15 minutes</li>
            </ul>`,
          skills: JSON.stringify([
            'Angular',
            'NestJS',
            'TypeScript',
            'PostgreSQL',
            'Docker',
            'AWS',
            'Team Leadership',
            'Code Review',
            'System Architecture',
            'Mentoring'
          ]),
          experience_id: experience1Id,
          order: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '20000000-0000-0000-0000-000000000002',
          title: 'Software Engineer',
          start_date: '2021-06-01',
          end_date: '2022-12-31',
          description: `Developed and maintained web applications using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.
            
            <strong>Most Impactful Achievements:</strong>
            <ul>
              <li>Built responsive e-commerce platform that increased mobile conversion rate by 45%</li>
              <li>Optimized database queries resulting in 40% faster page load times</li>
              <li>Developed reusable component library used across 5 different projects</li>
              <li>Introduced TypeScript to existing JavaScript codebase, reducing bugs by 30%</li>
            </ul>`,
          skills: JSON.stringify([
            'React',
            'Node.js',
            'Express.js',
            'MongoDB',
            'JavaScript',
            'TypeScript',
            'REST APIs',
            'Git',
            'Agile Development',
            'Responsive Design'
          ]),
          experience_id: experience1Id,
          order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '20000000-0000-0000-0000-000000000003',
          title: 'Full Stack Developer',
          start_date: '2020-01-01',
          end_date: '2021-05-31',
          description: `Built responsive web applications from scratch using React, Express.js, and PostgreSQL. Worked in an agile environment and contributed to all aspects of the development lifecycle.
            
            <strong>Most Impactful Achievements:</strong>
            <ul>
              <li>Developed MVP for startup that secured $500K in Series A funding</li>
              <li>Created automated reporting system that saved 20 hours of manual work per week</li>
              <li>Implemented real-time chat feature using WebSockets that increased user engagement by 25%</li>
              <li>Built authentication system with OAuth integration supporting Google and GitHub</li>
            </ul>`,
          skills: JSON.stringify([
            'React',
            'Express.js',
            'PostgreSQL',
            'JavaScript',
            'HTML5',
            'CSS3',
            'SASS',
            'WebSockets',
            'OAuth',
            'Jest',
            'Git',
            'Startup Environment'
          ]),
          experience_id: experience2Id,
          order: 0,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create certificates
      await queryInterface.bulkInsert('certificates', [
        {
          id: '30000000-0000-0000-0000-000000000001',
          name: 'AWS Certified Solutions Architect',
          issued_date: '2023-06-15',
          expiration_date: '2026-06-15',
          logo_id: '90000000-0000-0000-0000-000000000008',
          description:
            'Validates expertise in designing distributed systems and applications on the Amazon Web Services platform with a focus on best practices for security, reliability, and cost optimization.',
          order: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '30000000-0000-0000-0000-000000000002',
          name: 'Google Cloud Professional Developer',
          issued_date: '2023-03-20',
          expiration_date: '2025-03-20',
          logo_id: '90000000-0000-0000-0000-000000000009',
          description:
            'Demonstrates proficiency in developing scalable and highly available applications using Google Cloud Platform services and tools.',
          order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '30000000-0000-0000-0000-000000000003',
          name: 'Microsoft Azure Fundamentals',
          issued_date: '2022-11-10',
          expiration_date: null,
          logo_id: '90000000-0000-0000-0000-000000000010',
          description:
            'Foundational knowledge of cloud services and how those services are provided with Microsoft Azure, covering core Azure services, pricing, and support.',
          order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '30000000-0000-0000-0000-000000000004',
          name: 'Kubernetes Administrator (CKA)',
          issued_date: '2023-08-05',
          expiration_date: '2024-08-05',
          logo_id: '90000000-0000-0000-0000-000000000011',
          description:
            'Validates skills in deploying, managing, and troubleshooting Kubernetes clusters in production environments.',
          order: 3,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create changelog page content
      await queryInterface.bulkInsert('changelog_page', [
        {
          id: '00000000-0000-0000-0000-000000000002',
          footer_text:
            'LUCH is a fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          hero_image_main_id: '90000000-0000-0000-0000-000000000001',
          hero_image_secondary_id: '90000000-0000-0000-0000-000000000007',
          hero_image_main_alt: 'Abstract Gradient Art',
          hero_image_secondary_alt: 'Data Visualization Charts',
          logo_text: 'Luch',
          breadcrumb_text: 'Changelog',
          hero_title: 'Latest Features & Improvements',
          meta_title: 'Changelog - Personal Blog',
          meta_description:
            "Stay updated with the latest features, improvements, and bug fixes. See what's new in our platform.",
          meta_keywords: 'changelog, updates, features, improvements, release notes',
          og_title: 'Changelog - Latest Updates',
          og_description:
            "Discover the latest features and improvements to our platform. Track our progress and see what's new.",
          og_image_id: '90000000-0000-0000-0000-000000000005',
          structured_data: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Platform Changelog',
            description:
              'Latest updates, features, and improvements to our platform',
            author: {
              '@type': 'Organization',
              name: 'Development Team'
            },
            dateModified: new Date().toISOString(),
            mainEntityOfPage: 'https://example.com/changelog'
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create changelog entries
      await queryInterface.bulkInsert('changelog_entries', [
        {
          id: '40000000-0000-0000-0000-000000000001',
          changelog_page_id: '00000000-0000-0000-0000-000000000002',
          version: '1.1.0',
          date: 'February 2025',
          title: 'Enhanced User Experience',
          description:
            'Minor improvements to the overall appearance and performance of the template.',
          changes: JSON.stringify([
            'Added lightbox gallery and description block to blog and project collection pages',
            'Improved responsive design for mobile devices',
            'Enhanced navigation accessibility',
            'Optimized loading performance'
          ]),
          sort_order: 0,
          created_at: new Date('2025-02-01'),
          updated_at: new Date('2025-02-01')
        },
        {
          id: '40000000-0000-0000-0000-000000000002',
          changelog_page_id: '00000000-0000-0000-0000-000000000002',
          version: '1.0.0',
          date: 'January 2025',
          title: 'Initial Release',
          description: 'The template has been released!',
          changes: JSON.stringify([
            'Complete website launch',
            'Blog functionality with dynamic content',
            'Projects showcase with detailed pages',
            'Contact form implementation',
            'Responsive design for all devices',
            'Modern UI with smooth animations',
            'SEO optimization',
            'Analytics integration'
          ]),
          sort_order: 1,
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01')
        }
      ]);

      // Create license page content
      await queryInterface.bulkInsert('license_page', [
        {
          id: '00000000-0000-0000-0000-000000000003',
          title: 'MIT License',
          license_date: 'Copyright (c) 2025 LUCH Framework',
          paragraphs: JSON.stringify([
            'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
            'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.',
            'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.'
          ]),
          additional_info_title: 'Additional Information',
          additional_info_paragraphs: JSON.stringify([
            'This template is built using Angular and follows modern web development practices. The design and components are created with accessibility and performance in mind.'
          ]),
          footer_text:
            'LUCH is a fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          hero_image_main_id: '90000000-0000-0000-0000-000000000001',
          hero_image_secondary_id: '90000000-0000-0000-0000-000000000001',
          hero_image_main_alt: 'Abstract Gradient Art',
          hero_image_secondary_alt: 'Abstract Gradient Art',
          logo_text: 'Luch',
          breadcrumb_text: 'License',
          hero_title: 'License Information',
          meta_title: 'License - Personal Blog',
          meta_description:
            'MIT License information for the LUCH Framework. Learn about usage rights, permissions, and legal terms for this open-source template.',
          meta_keywords:
            'license, MIT license, open source, legal, permissions, usage rights',
          og_title: 'License Information - MIT License',
          og_description:
            'MIT License details for the LUCH Framework. Free to use, modify, and distribute under open source terms.',
          og_image_id: '90000000-0000-0000-0000-000000000001',
          structured_data: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: 'LUCH Framework',
            license: 'https://opensource.org/licenses/MIT',
            description: 'MIT License for LUCH Framework template',
            creator: {
              '@type': 'Organization',
              name: 'LUCH Framework'
            },
            dateCreated: '2025-01-01',
            copyrightHolder: {
              '@type': 'Organization',
              name: 'LUCH Framework'
            }
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create license tiles
      await queryInterface.bulkInsert('license_tiles', [
        {
          id: '50000000-0000-0000-0000-000000000001',
          title: 'Webflow: Template Licenses',
          description:
            'Not sure where and how often you can use your Webflow template? This licensing guide breaks down all the rules for you.',
          links: JSON.stringify([
            {
              label: 'Template Licenses',
              url: 'https://webflow.com/templates/template-licenses'
            }
          ]),
          sort_order: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '50000000-0000-0000-0000-000000000002',
          title: 'Fonts: Roboto Font Family',
          description:
            'These are free fonts from Google Fonts, ready to enhance your website. Discover more typography options on the Google Fonts website.',
          links: JSON.stringify([
            {
              label: 'Google Fonts Licensing',
              url: 'https://fonts.google.com/knowledge/glossary/licensing'
            }
          ]),
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '50000000-0000-0000-0000-000000000003',
          title: 'Images: Lummi Images',
          description:
            "Everything you need to know about using Lummi's images freely.",
          links: JSON.stringify([
            {
              label: 'Lummi License',
              url: 'https://www.lummi.ai/license'
            }
          ]),
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '50000000-0000-0000-0000-000000000004',
          title: 'Icons: Remix Icon',
          description:
            'RemixIcon is licensed based on the Apache License and all rights of products are reserved for RemixIcon.',
          links: JSON.stringify([
            {
              label: 'Apache License',
              url: 'https://github.com/Remix-Design/remixicon/blob/master/License'
            }
          ]),
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '50000000-0000-0000-0000-000000000005',
          title: 'Open Logo - Free Logo Library',
          description: 'Open Logo is an open-source library of logos.',
          links: JSON.stringify([
            {
              label: 'Licensed under CC BY 4.0',
              url: 'https://www.figma.com/community/file/978681400875967088/open-logo-free-logo-library'
            }
          ]),
          sort_order: 4,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '50000000-0000-0000-0000-000000000006',
          title: 'Country Flags Icons Set',
          description: 'Free, Circular Country Flags Icons Set.',
          links: JSON.stringify([
            {
              label: 'Licensed under CC BY 4.0',
              url: 'https://www.figma.com/community/file/1373119187969493166/country-flags-icons-set-component'
            }
          ]),
          sort_order: 5,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '50000000-0000-0000-0000-000000000007',
          title: 'Pexels Video & Images',
          description:
            'All photos and videos on Pexels can be downloaded and used for free.',
          links: JSON.stringify([
            {
              label: 'Video by Google DeepMind',
              url: 'https://www.pexels.com/video/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-explores-how-ai-can-be-used-to-progress-the-field-of-quantum-computing-it-was-created-by-bakken-and-baeck-as-part-of-t-25744127/'
            },
            {
              label: 'Photo by Google DeepMind',
              url: 'https://www.pexels.com/photo/diagram-on-white-background-25626435/'
            }
          ]),
          sort_order: 6,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create privacy page content
      await queryInterface.bulkInsert('privacy_page', [
        {
          id: '00000000-0000-0000-0000-000000000004',
          title: 'Privacy Policy',
          last_updated: 'Last updated: January 2025',
          cookie_policy_title: 'Cookie Policy',
          footer_text:
            'LUCH is a fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          hero_image_main_id: '90000000-0000-0000-0000-000000000001',
          hero_image_secondary_id: '90000000-0000-0000-0000-000000000001',
          hero_image_main_alt: 'Abstract Gradient Art',
          hero_image_secondary_alt: 'Abstract Gradient Art',
          logo_text: 'Luch',
          breadcrumb_text: 'Privacy',
          hero_title: 'Privacy Policy',
          meta_title: 'Privacy Policy - Personal Blog',
          meta_description:
            'Privacy Policy for our personal blog. Learn how we collect, use, and protect your personal information.',
          meta_keywords:
            'privacy policy, data protection, personal information, cookies, GDPR',
          og_title: 'Privacy Policy - Data Protection',
          og_description:
            'Our privacy policy explains how we handle your personal data and protect your privacy when using our blog.',
          og_image_id: '90000000-0000-0000-0000-000000000001',
          structured_data: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy',
            description: 'Privacy policy and data protection information',
            publisher: {
              '@type': 'Organization',
              name: 'Personal Blog'
            },
            dateModified: new Date().toISOString(),
            mainEntityOfPage: 'https://example.com/privacy'
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create privacy sections
      const privacySections = [
        {
          id: '60000000-0000-0000-0000-000000000001',
          title: '1. Information We Collect',
          sort_order: 0,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000002',
          title: '2. How We Use Your Information',
          sort_order: 1,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000003',
          title: '3. Information Sharing',
          sort_order: 2,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000004',
          title: '4. Cookies and Tracking Technologies',
          sort_order: 3,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000005',
          title: '5. Data Security',
          sort_order: 4,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000006',
          title: '6. Your Rights',
          sort_order: 5,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000007',
          title: "7. Children's Privacy",
          sort_order: 6,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000008',
          title: '8. Changes to This Policy',
          sort_order: 7,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000009',
          title: '9. Contact Us',
          sort_order: 8,
          section_type: 'main'
        },
        {
          id: '60000000-0000-0000-0000-000000000010',
          title: 'Cookie Policy Content',
          sort_order: 0,
          section_type: 'cookie_policy'
        }
      ];

      await queryInterface.bulkInsert(
        'privacy_sections',
        privacySections.map((section) => ({
          ...section,
          created_at: new Date(),
          updated_at: new Date()
        }))
      );

      // Create privacy content items
      const privacyContentItems = [
        // Section 1: Information We Collect
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000001',
          type: 'paragraph',
          text: 'We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.',
          sort_order: 0
        },
        // Section 2: How We Use Your Information
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000002',
          type: 'paragraph',
          text: 'We use the information we collect to:',
          sort_order: 0
        },
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000002',
          type: 'list',
          items: JSON.stringify([
            'Provide, maintain, and improve our services',
            'Send you technical notices, updates, and support messages',
            'Respond to your comments and questions',
            'Communicate with you about products, services, and events'
          ]),
          sort_order: 1
        },
        // Section 3: Information Sharing
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000003',
          type: 'paragraph',
          text: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.',
          sort_order: 0
        },
        // Section 4: Cookies and Tracking Technologies
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000004',
          type: 'paragraph',
          text: 'We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us understand how you use our site and improve our services.',
          sort_order: 0
        },
        // Section 5: Data Security
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000005',
          type: 'paragraph',
          text: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
          sort_order: 0
        },
        // Section 6: Your Rights
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000006',
          type: 'paragraph',
          text: 'You have the right to:',
          sort_order: 0
        },
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000006',
          type: 'list',
          items: JSON.stringify([
            'Access your personal information',
            'Correct inaccurate information',
            'Request deletion of your information',
            'Opt-out of marketing communications'
          ]),
          sort_order: 1
        },
        // Section 7: Children's Privacy
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000007',
          type: 'paragraph',
          text: 'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
          sort_order: 0
        },
        // Section 8: Changes to This Policy
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000008',
          type: 'paragraph',
          text: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.',
          sort_order: 0
        },
        // Section 9: Contact Us
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000009',
          type: 'paragraph_with_link',
          text: 'If you have any questions about this privacy policy, please contact us through our',
          link_text: 'contact page',
          link_url: '/contact',
          sort_order: 0
        },
        // Cookie Policy Section
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000010',
          type: 'paragraph',
          text: 'This website uses cookies to enhance your browsing experience. By continuing to use this site, you consent to our use of cookies in accordance with our privacy policy.',
          sort_order: 0
        },
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000010',
          type: 'subtitle',
          text: 'Types of Cookies We Use:',
          sort_order: 1
        },
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000010',
          type: 'list',
          items: JSON.stringify([
            '<strong>Essential Cookies:</strong> Required for the website to function properly',
            '<strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website',
            '<strong>Functional Cookies:</strong> Remember your preferences and settings'
          ]),
          sort_order: 2
        },
        {
          privacy_section_id: '60000000-0000-0000-0000-000000000010',
          type: 'paragraph',
          text: 'You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.',
          sort_order: 3
        }
      ];

      await queryInterface.bulkInsert(
        'privacy_content_items',
        privacyContentItems.map((item, index) => ({
          id: `70000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
          ...item,
          created_at: new Date(),
          updated_at: new Date()
        }))
      );

      // Create home page content
      await queryInterface.bulkInsert('home_page', [
        {
          id: '00000000-0000-0000-0000-000000000005',
          title: 'Welcome to LUCH',
          subtitle: 'Modern Creative Portfolio Template',
          description:
            'A fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          footer_text:
            'LUCH is a fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          hero_image_main_id: '90000000-0000-0000-0000-000000000004',
          hero_image_secondary_id: '90000000-0000-0000-0000-000000000006',
          hero_image_main_alt: 'Contemplative Astronaut Woman',
          hero_image_secondary_alt: 'Astronaut in Space',
          logo_text: 'LUCH',
          breadcrumb_text: 'Home',
          hero_title: 'Welcome to LUCH',
          marquee_left_text: 'LUCH Framework',
          marquee_right_text: 'Who LUCH is for',
          latest_projects_title: 'Latest Projects',
          latest_posts_title: 'Latest Posts',
          why_section_title: 'Why LUCH?',
          faq_section_title: 'FAQ',
          meta_title: 'Home - LUCH Creative Template',
          meta_description:
            'Welcome to LUCH - a modern creative portfolio template designed for artists, bloggers, and creatives.',
          meta_keywords:
            'creative template, portfolio, blog, webflow, design, modern',
          og_title: 'LUCH - Modern Creative Portfolio Template',
          og_description:
            'A fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          og_image_id: '90000000-0000-0000-0000-000000000004',
          structured_data: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'LUCH Creative Template',
            description:
              'A fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
            url: 'https://example.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://example.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create projects page content
      await queryInterface.bulkInsert('projects_page', [
        {
          id: '00000000-0000-0000-0000-000000000006',
          title: 'Projects',
          subtitle: 'Showcase of My Work',
          description:
            'Explore my portfolio of projects showcasing innovative solutions and creative implementations.',
          footer_text:
            'LUCH is a fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          hero_image_main_id: '90000000-0000-0000-0000-000000000001',
          hero_image_secondary_id: '90000000-0000-0000-0000-000000000006',
          hero_image_main_alt: 'Abstract Gradient Art',
          hero_image_secondary_alt: 'Astronaut Woman in Spacecraft',
          logo_text: 'LUCH',
          breadcrumb_text: 'Projects',
          hero_title: 'My Projects',
          meta_title: 'Projects - Portfolio Showcase',
          meta_description:
            'Explore my portfolio of innovative projects and creative implementations. Discover the latest technologies and methodologies I work with.',
          meta_keywords:
            'projects, portfolio, web development, software engineering, innovation',
          og_title: 'Projects Portfolio - Latest Work',
          og_description:
            'Browse through my latest projects showcasing cutting-edge technologies and creative solutions.',
          og_image_id: '90000000-0000-0000-0000-000000000001',
          structured_data: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Projects Portfolio',
            description:
              'Portfolio showcasing innovative projects and creative implementations',
            mainEntity: {
              '@type': 'ItemList',
              name: 'Projects Collection'
            }
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create blog page content
      await queryInterface.bulkInsert('blog_page', [
        {
          id: '00000000-0000-0000-0000-000000000007',
          title: 'Blog',
          subtitle: 'Thoughts & Insights',
          description:
            'Dive into articles about web development, technology trends, and creative problem-solving.',
          footer_text:
            'LUCH is a fresh and innovative CMS template ideal for creating a portfolio or personal blog.',
          hero_image_main_id: '90000000-0000-0000-0000-000000000001',
          hero_image_secondary_id: '90000000-0000-0000-0000-000000000006',
          hero_image_main_alt: 'Abstract Gradient Art',
          hero_image_secondary_alt: 'Astronaut Woman in Spacecraft',
          logo_text: 'LUCH',
          breadcrumb_text: 'Blog',
          hero_title: 'Latest Articles',
          meta_title: 'Blog - Web Development & Technology Articles',
          meta_description:
            'Read the latest articles about web development, technology trends, programming insights, and creative problem-solving techniques.',
          meta_keywords:
            'blog, web development, technology, programming, articles, insights',
          og_title: 'Blog - Latest Articles & Insights',
          og_description:
            'Discover articles about web development, technology trends, and programming insights from an experienced developer.',
          og_image_id: '90000000-0000-0000-0000-000000000001',
          structured_data: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Personal Development Blog',
            description:
              'Articles about web development, technology trends, and creative problem-solving',
            author: {
              '@type': 'Person',
              name: 'Blog Author'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Personal Blog'
            }
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create whys section
      await queryInterface.bulkInsert('whys_sections', [
        {
          id: '80000000-0000-0000-0000-000000000001',
          title: 'Why LUCH?',
          why_blocks: JSON.stringify([
            {
              text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam at, dolorem, dolorum error expedita facilis itaque iure nobis quas repellat, ullam unde velit! Autem dolorem fugiat quibusdam quidem temporibus! Beatae cumque est fugiat magnam modi pariatur praesentium reprehenderit sint? At cumque fugit molestiae nemo nesciunt, quae reiciendis unde? Iure.'
            },
            {
              text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam at, dolorem, dolorum error expedita facilis itaque iure nobis quas repellat, ullam unde velit! Autem dolorem fugiat quibusdam quidem temporibus! Beatae cumque est fugiat magnam modi pariatur praesentium reprehenderit sint? At cumque fugit molestiae nemo nesciunt, quae reiciendis unde? Iure.'
            }
          ]),
          features: JSON.stringify([
            { title: 'SEO Optimized' },
            { title: 'Customizable' },
            { title: 'Cross-browser Compatible' },
            { title: 'Professional Support' }
          ]),
          featured: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Create FAQ questions
      await queryInterface.bulkInsert('faqs', [
        {
          id: '83000000-0000-0000-0000-000000000001',
          question: 'What is LUCH Framework?',
          answer:
            'LUCH is a modern creative portfolio template designed for artists, bloggers, and creatives. It features a clean, responsive design with powerful customization options.',
          sort_order: 0,
          is_active: true,
          featured: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '83000000-0000-0000-0000-000000000002',
          question: 'Is LUCH mobile-friendly?',
          answer:
            'Yes, LUCH is fully responsive and optimized for all devices including smartphones, tablets, and desktops. The template automatically adapts to different screen sizes.',
          sort_order: 1,
          is_active: true,
          featured: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '83000000-0000-0000-0000-000000000003',
          question: 'Can I customize the design?',
          answer:
            'Absolutely! LUCH comes with extensive customization options. You can modify colors, fonts, layouts, and add your own content to match your brand and style.',
          sort_order: 2,
          is_active: true,
          featured: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '83000000-0000-0000-0000-000000000004',
          question: 'Do I get support after purchase?',
          answer:
            'Yes, we provide comprehensive support including documentation, video tutorials, and direct assistance to help you get the most out of your LUCH template.',
          sort_order: 3,
          is_active: true,
          featured: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '83000000-0000-0000-0000-000000000005',
          question: 'Is LUCH SEO optimized?',
          answer:
            'Yes, LUCH is built with SEO best practices in mind. It includes optimized markup, fast loading times, and clean code structure to help your site rank better in search engines.',
          sort_order: 4,
          is_active: true,
          featured: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    } catch (e) {
      console.log('Error while creating seeders: ', e);
    }
  },

  async down(queryInterface, sequelize) {
    await queryInterface.bulkDelete('static_assets', null, {});
    await queryInterface.bulkDelete('faqs', null, {});
    await queryInterface.bulkDelete('whys_sections', null, {});
    await queryInterface.bulkDelete('blog_page', null, {});
    await queryInterface.bulkDelete('projects_page', null, {});
    await queryInterface.bulkDelete('home_page', null, {});
    await queryInterface.bulkDelete('privacy_content_items', null, {});
    await queryInterface.bulkDelete('privacy_sections', null, {});
    await queryInterface.bulkDelete('privacy_page', null, {});
    await queryInterface.bulkDelete('license_tiles', null, {});
    await queryInterface.bulkDelete('license_page', null, {});
    await queryInterface.bulkDelete('changelog_entries', null, {});
    await queryInterface.bulkDelete('changelog_page', null, {});
    await queryInterface.bulkDelete('certificates', null, {});
    await queryInterface.bulkDelete('positions', null, {});
    await queryInterface.bulkDelete('experiences', null, {});
    await queryInterface.bulkDelete('about_page', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('articles', null, {});
    await queryInterface.bulkDelete('site_config', null, {});
    await queryInterface.bulkDelete('sessions', null, {});
    await queryInterface.bulkDelete('users_settings', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
