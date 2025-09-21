# 🏥 NPHIES-AI Healthcare Platform

Advanced AI-powered healthcare middleware with comprehensive AWS services integration for the Saudi Arabian National Platform for Health Information Exchange (NPHIES).

## 🚀 Features

### Core Healthcare Services
- **NPHIES Integration**: Real-time connection to Saudi health insurance system
- **Claims Processing**: Automated claim submission and tracking
- **Eligibility Verification**: Instant patient insurance coverage checks
- **Pre-Authorization**: Streamlined procedure approval requests
- **AI Assistant**: Intelligent healthcare support with real-time chat

### Advanced AI & AWS Integration
- **Amazon Bedrock**: Foundation models for medical analysis
- **SageMaker**: ML predictions for claim approval and treatment outcomes
- **Textract**: Medical document processing and OCR
- **Comprehend Medical**: NLP for medical entity extraction
- **HealthLake**: FHIR-compliant healthcare data management
- **Personalize**: Treatment and provider recommendations

### Enhanced User Experience
- **Glass Morphism UI**: Modern, accessible design with Inter and JetBrains Mono fonts
- **Enhanced Routing**: Client-side routing with lazy loading and code splitting
- **PWA Support**: Progressive Web App with offline capabilities
- **Real-time Updates**: WebSocket connections for live data
- **Mobile Responsive**: Optimized for all device sizes

## 🛠 Technology Stack

- **Backend**: FastAPI (Python 3.11)
- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Styling**: CSS3 with Glass Morphism design
- **Infrastructure**: AWS ECS Fargate, ECR, CloudWatch
- **AI/ML**: AWS Bedrock, SageMaker, Textract, Comprehend Medical
- **Database**: AWS HealthLake (FHIR R4)
- **Containerization**: Docker
- **Fonts**: Inter, JetBrains Mono

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Load Balancer │────│   ECS Fargate    │────│   AWS Services  │
│   (ALB)         │    │   Container      │    │   (AI/ML/Health)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                       ┌──────────────────┐
                       │   FastAPI App    │
                       │   Enhanced UI    │
                       └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker
- AWS CLI configured
- Python 3.11+

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/nphies-ai-healthcare-platform.git
cd nphies-ai-healthcare-platform

# Install dependencies
pip install -r requirements.txt

# Configure auth secrets and run the application
export JWT_SECRET=dev-secret
export SERVICE_ACCOUNT_USERNAME=nphies_service
export SERVICE_ACCOUNT_PASSWORD=nphies-dev-password
python main.py
```

### Docker Deployment
```bash
# Build the image
docker build -t nphies-ai:latest .

# Run the container
docker run -p 8000:8000 nphies-ai:latest
```

### Obtain a Demo Access Token

```bash
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=nphies_service&password=nphies-dev-password'
```

Use the returned `access_token` as a `Bearer` token when calling protected endpoints such as `/system/status`, `/chat`, and `/nphies/claim`.

### AWS ECS Deployment
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag nphies-ai:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/brainsait-nphies-ai:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/brainsait-nphies-ai:latest

# Update ECS service
aws ecs update-service --cluster brainsait-nphies-cluster --service brainsait-nphies-service --force-new-deployment
```

## 🤝 Contributor Guide

- Review `AGENTS.md` for repository guidelines covering structure, commands, coding conventions, testing, and security expectations before opening pull requests.

## 🔐 Authentication & Environment

- Configure JWT settings before running the API: set `JWT_SECRET`, optional `JWT_ALGORITHM`, and `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`.
- Provision a service account credential via `SERVICE_ACCOUNT_USERNAME` and either `SERVICE_ACCOUNT_PASSWORD_HASH` (bcrypt) or `SERVICE_ACCOUNT_PASSWORD` for local development.
- Rate limiting defaults to `60` requests per minute; override with `API_RATE_LIMIT` and `API_RATE_LIMIT_WINDOW` as needed.
- Front-end clients (static site, Next.js dashboard, Expo mobile) request tokens from `/auth/token` and store them in `localStorage`/`AsyncStorage` under `nphies_ai_access_token`.
- Default demo credentials (`nphies_service` / `nphies-dev-password`) remain active until you override them; update or reset secrets before deploying beyond local environments.

## 📁 Project Structure

```
nphies-ai-healthcare-platform/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── static/                # Frontend assets
│   ├── css/              # Stylesheets with Glass Morphism design
│   ├── js/               # Enhanced JavaScript modules
│   │   ├── router.js     # Client-side routing system
│   │   ├── navigation.js # Navigation components
│   │   ├── aws-services.js # AWS services integration
│   │   └── lazy-loader.js # Code splitting and lazy loading
│   ├── *.html           # Application pages
│   ├── 404.html         # Enhanced 404 error page
│   └── 500.html         # Enhanced 500 error page
├── dashboard/            # Dashboard components
├── mobile/              # Mobile app components
└── docs/                # Documentation
```

## 🔧 Configuration

### Environment Variables
```bash
AWS_DEFAULT_REGION=us-east-1
ENVIRONMENT=production
ROUTING_VERSION=enhanced
HEALTHLAKE_DATASTORE_ID=your-datastore-id
```

### AWS Services Setup
1. **ECS Cluster**: `brainsait-nphies-cluster`
2. **ECR Repository**: `brainsait-nphies-ai`
3. **IAM Role**: `ecsTaskExecutionRole` with ECR and CloudWatch permissions
4. **CloudWatch Log Group**: `/ecs/brainsait-nphies-task`

## 🎯 API Endpoints

### Core Healthcare APIs
- `GET /` - Homepage
- `GET /dashboard` - Main dashboard
- `GET /nphies` - NPHIES integration
- `GET /claims` - Claims processing
- `GET /eligibility` - Eligibility verification
- `GET /pre-authorization` - Pre-authorization requests
- `GET /ai-assistant` - AI assistant interface

### Navigation APIs
- `GET /api/navigation/routes` - Available routes
- `GET /api/navigation/breadcrumbs/{path}` - Breadcrumb generation
- `POST /api/navigation/track` - Navigation analytics

### AI & AWS APIs
- `POST /ai/bedrock-analyze` - Bedrock AI analysis
- `POST /ai/sagemaker-predict` - ML predictions
- `POST /ai/textract-analyze` - Document processing
- `POST /health-services/analyze-text` - Medical NLP
- `GET /system/status` - Comprehensive system status

## 🔒 Security

- **Authentication Guards**: Route-based access control
- **CORS**: Configured for secure cross-origin requests
- **HTTPS**: SSL/TLS encryption in production
- **IAM Roles**: Least privilege access for AWS services
- **Input Validation**: Comprehensive request validation

## 📊 Monitoring & Analytics

- **CloudWatch Logs**: Centralized logging
- **Performance Metrics**: Real-time monitoring
- **Error Tracking**: Comprehensive error handling
- **Navigation Analytics**: User journey tracking
- **AI Performance**: ML model accuracy monitoring

## 🚀 Deployment Status

- **Current Version**: Enhanced Routing v3.0.0
- **Task Definition**: Revision 11
- **Container Image**: `enhanced-routing`
- **Status**: ✅ Active and Healthy
- **URL**: https://nphies-ai.brainsait.com/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check the `/docs` directory
- **AI Assistant**: Use the built-in AI assistant at `/ai-assistant`
- **Issues**: Create a GitHub issue
- **Healthcare Support**: Contact the NPHIES integration team

## 🏆 Acknowledgments

- **Saudi NPHIES**: National Platform for Health Information Exchange
- **AWS Healthcare**: Advanced AI and ML services
- **BrainSAIT**: Healthcare AI innovation
- **Open Source Community**: Various libraries and tools

---

**Built with ❤️ for Healthcare Innovation**
