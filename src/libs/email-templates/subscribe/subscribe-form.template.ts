export interface SubscribeFormTemplateData {
  title?: string;
  subtitle?: string;
  description?: string;
  emailPlaceholder?: string;
  submitButtonText?: string;
  privacyText?: string;
  heroImageMain?: string;
  heroImageSecondary?: string;
  logoText?: string;
  apiUrl?: string;
}

export const subscribeFormTemplate = (data: SubscribeFormTemplateData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'Subscribe to Newsletter'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 500px;
            width: 100%;
            position: relative;
        }
        
        .hero-section {
            background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('${data.heroImageMain || ''}') center/cover;
            opacity: 0.2;
            border-radius: 20px 20px 0 0;
        }
        
        .hero-content {
            position: relative;
            z-index: 1;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            opacity: 0.9;
        }
        
        .hero-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .hero-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 0;
        }
        
        .form-section {
            padding: 40px 30px;
        }
        
        .description {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
            text-align: center;
            line-height: 1.5;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-control {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e1e5e9;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
            color: #333;
        }
        
        .form-control:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background-color: #ffffff;
        }
        
        .form-control::placeholder {
            color: #999;
            opacity: 1;
        }
        
        .btn-subscribe {
            width: 100%;
            padding: 16px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }
        
        .btn-subscribe:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        .btn-subscribe:active {
            transform: translateY(0);
        }
        
        .btn-subscribe:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .privacy-text {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
            line-height: 1.4;
        }
        
        .privacy-text a {
            color: #667eea;
            text-decoration: none;
        }
        
        .privacy-text a:hover {
            text-decoration: underline;
        }
        
        .status-message {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            text-align: center;
            display: none;
        }
        
        .status-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e1e5e9;
        }
        
        .feature {
            text-align: center;
            padding: 10px;
        }
        
        .feature-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .feature-text {
            font-size: 12px;
            color: #666;
            font-weight: 500;
        }
        
        @media (max-width: 480px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .hero-section {
                padding: 30px 20px;
            }
            
            .hero-title {
                font-size: 24px;
            }
            
            .form-section {
                padding: 30px 20px;
            }
            
            .form-control {
                padding: 14px 16px;
                font-size: 16px;
            }
            
            .btn-subscribe {
                padding: 14px 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero-section">
            <div class="hero-content">
                <div class="logo">${data.logoText || '📧'}</div>
                <h1 class="hero-title">${data.title || 'Stay Updated'}</h1>
                <p class="hero-subtitle">${data.subtitle || 'Get the latest updates delivered to your inbox'}</p>
            </div>
        </div>
        
        <div class="form-section">
            <p class="description">${data.description || 'Join our community and never miss important updates, news, and exclusive content.'}</p>
            
            <div id="statusMessage" class="status-message"></div>
            
            <form id="subscribeForm" action="/newsletters/subscribe" method="POST">
                <div class="form-group">
                    <input 
                        type="email" 
                        name="email" 
                        class="form-control" 
                        placeholder="${data.emailPlaceholder || 'Enter your email address'}" 
                        required
                        autocomplete="email"
                    >
                </div>
                
                <button type="submit" class="btn-subscribe" id="submitBtn">
                    <span id="buttonText">${data.submitButtonText || 'Subscribe Now'}</span>
                </button>
            </form>
            
            <div class="privacy-text">
                ${data.privacyText || 'We respect your privacy. No spam, just valuable content. You can unsubscribe at any time.'}
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🚀</div>
                    <div class="feature-text">Latest Updates</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📝</div>
                    <div class="feature-text">Quality Content</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-text">Privacy First</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        document.getElementById('subscribeForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = document.getElementById('submitBtn');
            const buttonText = document.getElementById('buttonText');
            const statusMessage = document.getElementById('statusMessage');
            const emailInput = form.querySelector('input[name="email"]');
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            buttonText.innerHTML = '<span class="loading-spinner"></span>Subscribing...';
            statusMessage.style.display = 'none';
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.get('email')
                    })
                });
                
                if (response.ok) {
                    statusMessage.className = 'status-message success';
                    statusMessage.textContent = 'Successfully subscribed! Please check your email to confirm.';
                    statusMessage.style.display = 'block';
                    emailInput.value = '';
                    buttonText.textContent = '✓ Subscribed!';
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (error) {
                statusMessage.className = 'status-message error';
                statusMessage.textContent = 'Something went wrong. Please try again.';
                statusMessage.style.display = 'block';
                buttonText.textContent = '${data.submitButtonText || 'Subscribe Now'}';
            }
            
            // Re-enable button
            setTimeout(() => {
                submitBtn.disabled = false;
                if (!statusMessage.classList.contains('success')) {
                    buttonText.textContent = '${data.submitButtonText || 'Subscribe Now'}';
                }
            }, 2000);
        });
        
        // Auto-hide status messages after 5 seconds
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.style.display === 'block') {
                        setTimeout(() => {
                            target.style.display = 'none';
                        }, 5000);
                    }
                }
            });
        });
        
        observer.observe(document.getElementById('statusMessage'), {
            attributes: true,
            attributeFilter: ['style']
        });
    </script>
</body>
</html>
  `;
};
