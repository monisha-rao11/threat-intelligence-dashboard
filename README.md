# ConSecure Threat Intelligence Dashboard

A comprehensive full-stack web application for cybersecurity threat monitoring, analysis, and classification. Built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

### Core Functionality (Part 1)
- **Dashboard View**: Real-time threat statistics and visualizations
- **Threat Browser**: Paginated list with search and filtering capabilities
- **RESTful API**: Complete backend with proper HTTP status codes
- **Responsive Design**: Mobile-friendly interface using shadcn/ui components
- **Kaggle Dataset Integration**: Uses real cybersecurity threat data

### Advanced Features (Part 2)
- **AI-Powered Analysis**: Machine learning threat classification
- **Real-time Updates**: Live threat monitoring capabilities
- **Containerization**: Full Docker support with docker-compose
- **Data Processing**: Automated CSV parsing and normalization
- **Modern UI/UX**: Dark/light theme support with professional design

## 🛠 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **RESTful Architecture**: Standard HTTP methods and status codes
- **JSON Responses**: Consistent API response format

### Data Processing
- **Custom CSV Parser**: Handles Kaggle dataset format
- **Data Normalization**: Cleans and standardizes threat categories
- **Caching**: In-memory caching for performance

## 📊 Dataset Setup

### Step 1: Download the Kaggle Dataset

1. Visit: https://www.kaggle.com/datasets/hussainsheikh03/nlp-based-cyber-security-dataset
2. Download the `nlp_based_cyber_security_dataset.csv` file
3. Create a `data/` directory in your project root
4. Place the CSV file in the `data/` directory

### Step 2: Verify Dataset Structure

The CSV should have these columns:
- `Original Threat Description`
- `Cleaned Threat Description`
- `Threat Category`
- `Severity Score`

### Step 3: Expected Data Format

**Threat Categories** (will be normalized to):
- Phishing
- Malware
- Ransomware
- DDoS
- Data Breach
- Social Engineering
- Insider Threat
- Advanced Persistent Threat

**Severity Scores** (will be normalized to):
- Low
- Medium
- High

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Kaggle dataset (see Dataset Setup above)

### Option 1: Local Development (Recommended)

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd threat-intelligence-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up the dataset**
   \`\`\`bash
   mkdir data
   # Place nlp_based_cyber_security_dataset.csv in the data/ directory
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access the application**
   - Web Interface: http://localhost:3000

### Option 2: Docker Deployment

1. **Prepare the dataset**
   \`\`\`bash
   mkdir data
   # Place nlp_based_cyber_security_dataset.csv in the data/ directory
   \`\`\`

2. **Start with Docker**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

## 📡 API Endpoints

### Threats API
- `GET /api/threats` - List threats with pagination, search, and filtering
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `search`: Search in threat descriptions
    - `category`: Filter by threat category
- `GET /api/threats/:id` - Get specific threat details
- `GET /api/threats/stats` - Get threat statistics

### Analysis API
- `POST /api/analyze` - Analyze threat description using ML

### Example API Usage

\`\`\`bash
# Get paginated threats
curl "http://localhost:3000/api/threats?page=1&limit=10&category=Phishing"

# Search threats
curl "http://localhost:3000/api/threats?search=malware&limit=5"

# Get threat statistics
curl "http://localhost:3000/api/threats/stats"

# Analyze new threat
curl -X POST "http://localhost:3000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"description": "Suspicious email with malicious attachment"}'
\`\`\`

## 🏗 Project Structure

\`\`\`
threat-intelligence-dashboard/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── threats/           # Threats page
│   ├── analyze/           # Analysis page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard-view.tsx
│   ├── threats-view.tsx
│   └── analyze-view.tsx
├── lib/                   # Utility functions and types
│   ├── threat-data.ts    # Data loading logic
│   ├── csv-parser.ts     # CSV parsing utilities
│   └── types.ts          # TypeScript definitions
├── data/                  # Dataset directory
│   └── nlp_based_cyber_security_dataset.csv
├── docker-compose.yml     # Multi-service configuration
├── Dockerfile            # Container configuration
└── README.md             # This file
\`\`\`

## 🔧 Data Processing

The application includes robust data processing capabilities:

### CSV Parsing
- **Custom Parser**: Handles quoted fields and commas within data
- **Error Handling**: Graceful fallback to mock data if CSV is unavailable
- **Data Validation**: Ensures data integrity and consistency

### Data Normalization
- **Category Mapping**: Standardizes threat category names
- **Severity Mapping**: Normalizes severity scores to Low/Medium/High
- **Text Cleaning**: Removes extra whitespace and formatting issues

### Performance Optimization
- **Caching**: In-memory caching of parsed CSV data
- **Lazy Loading**: Data is only parsed when first requested
- **Error Recovery**: Automatic fallback to sample data

## 🧪 Testing with Real Data

Once you've placed the Kaggle dataset in the `data/` directory:

1. **Verify Data Loading**
   \`\`\`bash
   npm run dev
   # Check console for "Loading data from Kaggle CSV file..." message
   \`\`\`

2. **Test API Endpoints**
   \`\`\`bash
   # Should return real data count
   curl "http://localhost:3000/api/threats/stats"
   \`\`\`

3. **Browse Real Threats**
   - Visit http://localhost:3000/threats
   - Use search and filtering with real threat data

## 🚀 Deployment

### Environment Variables

\`\`\`bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### Docker Deployment

\`\`\`bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f web
\`\`\`

## 📝 Data Source

This application uses the "NLP Based Cyber Security Dataset" from Kaggle:
- **Source**: https://www.kaggle.com/datasets/hussainsheikh03/nlp-based-cyber-security-dataset
- **License**: Please check Kaggle for dataset licensing terms
- **Citation**: Please cite the original dataset authors when using this application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ConSecure**: For providing this challenging and educational assignment
- **Kaggle Community**: For the cybersecurity dataset
- **Dataset Authors**: For creating and sharing the NLP-based cybersecurity dataset
- **shadcn/ui**: For the beautiful component library
- **Next.js Team**: For the excellent React framework

## 📞 Support

For questions or support regarding this assignment:
- Email: arpithac@connectsecure.com
- Assignment Form: https://forms.gle/cPNKLMC3FE67c6uU9

---

**Built with ❤️ for ConSecure Engineering Team**
\`\`\`

Update the Docker configuration to include the data directory:
