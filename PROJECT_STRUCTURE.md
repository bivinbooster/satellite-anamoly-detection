# Satellite Anomaly Studio - Project Structure

## Overview
Satellite Anomaly Studio is a full-stack web application for detecting and visualizing changes in satellite imagery using AI-powered analysis. The system provides an interactive interface for uploading before/after satellite images and visualizing anomaly detection results.

## Architecture
- **Frontend**: Next.js 16.1.1 with TypeScript, TailwindCSS, and Framer Motion
- **Backend**: FastAPI with Python, PIL for image generation
- **Communication**: RESTful API with CORS enabled
- **Image Processing**: Dynamic realistic satellite imagery generation
- **UI Components**: Interactive image comparison slider

---

## 📁 Complete Project Structure

```
satellite-anomaly-studio/
├── 📄 README.md                          # Project documentation
├── 📄 package.json                       # Root dependencies (recharts)
├── 📄 package-lock.json                  # Lock file for root dependencies
├── 📄 .env.local                         # Environment variables
├── 
├── 📁 backend/                           # Python FastAPI backend
│   ├── 📄 main.py                        # Main FastAPI application
│   ├── 📄 requirements.txt               # Python dependencies
│   ├── 📁 .venv/                         # Python virtual environment
│   ├── 📁 __pycache__/                   # Python cache files
│   ├── 📁 api/                           # API route modules
│   ├── 📁 app/                           # Application modules
│   ├── 📁 models/                        # Data models
│   ├── 📁 static/                        # Static files
│   ├── 📁 utils/                         # Utility functions
│   └── 📁 uploads/                       # Uploaded file storage
│
├── 📁 frontend/                          # Next.js React frontend
│   ├── 📄 package.json                   # Frontend dependencies
│   ├── 📄 package-lock.json              # Frontend lock file
│   ├── 📄 next.config.ts                # Next.js configuration
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   ├── 📄 tsconfig.tsbuildinfo           # TypeScript build info
│   ├── 📄 tailwind.config.ts             # TailwindCSS configuration
│   ├── 📄 postcss.config.mjs             # PostCSS configuration
│   ├── 📄 eslint.config.mjs             # ESLint configuration
│   ├── 📄 next-env.d.ts                  # Next.js TypeScript types
│   ├── 📄 .gitignore                     # Git ignore file
│   ├── 📄 README.md                      # Frontend documentation
│   ├── 
│   ├── 📁 .next/                         # Next.js build output
│   ├── 📁 node_modules/                  # Frontend dependencies
│   ├── 📁 public/                        # Static public assets
│   │   ├── 🖼️ favicon.ico               # Application favicon
│   │   └── 📄 ...                        # Other public files
│   │
│   └── 📁 src/                           # Source code
│       └── 📁 app/                       # App router structure
│           ├── 📄 layout.tsx             # Root layout component
│           ├── 📄 page.tsx               # Home page (simple version)
│           ├── 📄 page-fancy.tsx         # Home page (fancy version)
│           ├── 📄 globals.css            # Global styles
│           ├── 📄 favicon.ico            # Favicon
│           ├── 
│           ├── 📁 lib/                   # Utility libraries
│           │   └── 📄 api.ts              # API client functions
│           │
│           ├── 📁 components/            # Reusable components
│           │   └── 🖼️ ImageCompareSlider.tsx  # Interactive image comparison
│           │
│           └── 📁 runs/                  # Dynamic route for results
│               └── 📁 [runId]/           # Dynamic run ID parameter
│                   └── 📄 page.tsx      # Results page component
│
├── 📁 datasets/                          # Dataset storage
├── 📁 models/                            # ML model storage
├── 📁 node_modules/                      # Root node modules
│
├── 📄 create_mock_dataset.py            # Dataset creation script
├── 📄 download_dataset.py               # Dataset download script
├── 📄 setup_kaggle.py                    # Kaggle setup script
└── 📄 ...                                # Other project files
```

---

## 🚀 Key Components

### Backend (`backend/main.py`)
- **FastAPI Application**: RESTful API server
- **Image Generation**: Dynamic realistic satellite imagery creation
- **Endpoints**:
  - `GET /` - Root endpoint
  - `GET /health` - Health check
  - `POST /api/runs` - Create detection run
  - `POST /api/runs/{run_id}/detect` - Start anomaly detection
  - `GET /api/runs/{run_id}` - Get run results
  - `GET /api/assets/{run_id}/{asset_type}` - Get generated images

### Frontend (`frontend/src/`)
- **Home Page** (`app/page.tsx`): Image upload interface
- **Results Page** (`app/runs/[runId]/page.tsx`): Interactive visualization
- **API Client** (`app/lib/api.ts`): Backend communication
- **Image Slider** (`components/ImageCompareSlider.tsx`): Interactive comparison

---

## 🎨 Features

### Interactive Image Comparison
- **Drag Slider**: Manual comparison between before/after images
- **Hover to Compare**: Automatic comparison on hover
- **Smooth Animations**: Framer Motion transitions
- **Responsive Design**: Works on all screen sizes

### Realistic Satellite Imagery
- **Dynamic Generation**: Mathematical terrain patterns
- **Natural Features**: Water bodies, vegetation, urban areas
- **Change Visualization**: Urbanization, deforestation effects
- **Heatmap Analysis**: Multi-colored anomaly detection
- **Overlay Views**: Red-highlighted change areas

### Metrics Dashboard
- **Global Statistics**: Anomaly percentages, scores
- **Progress Bars**: Visual representation of metrics
- **Category Breakdown**: Water, vegetation, urban, bare areas
- **Interactive Elements**: Hover states and animations

---

## 🔧 Technical Stack

### Frontend Dependencies
```json
{
  "next": "16.1.1",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "react-compare-slider": "^3.1.0",
  "framer-motion": "^12.23.26",
  "react-icons": "^5.5.0",
  "recharts": "^3.6.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

### Backend Dependencies
```txt
fastapi==0.128.0
uvicorn==0.40.0
pillow==12.1.0
numpy==2.2.6
```

---

## 📊 Data Flow

1. **Image Upload**: User uploads before/after satellite images
2. **Run Creation**: Backend creates unique run ID and stores files
3. **Image Generation**: Dynamic realistic satellite imagery created
4. **Detection Process**: Mock anomaly detection with realistic metrics
5. **Results Display**: Interactive slider and visualizations
6. **Asset Loading**: On-demand image generation for all visualizations

---

## 🌐 API Endpoints

### Create Run
```
POST /api/runs
Content-Type: multipart/form-data
Body: t0 (File), t1 (File)
Response: {"run_id": "uuid"}
```

### Start Detection
```
POST /api/runs/{run_id}/detect
Response: DetectResult with assets and metrics
```

### Get Results
```
GET /api/runs/{run_id}
Response: Complete run data with analysis results
```

### Get Assets
```
GET /api/assets/{run_id}/{asset_type}
Response: PNG image (t0_rgb, t1_rgb, heatmap, overlay, etc.)
```

---

## 🎯 Usage Instructions

### Development Setup
```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Health Check**: http://localhost:8001/health

### User Workflow
1. Visit http://localhost:3000
2. Upload "Before" (t0) satellite image
3. Upload "After" (t1) satellite image
4. Click "Start Detection"
5. View interactive results with:
   - Image comparison slider
   - Anomaly heatmap
   - Change overlay
   - Detailed metrics

---

## 🔍 Image Generation Details

### Realistic Terrain Algorithm
- **Base Layer**: Mathematical noise functions (sin/cos)
- **Water Bodies**: Blue areas with natural patterns
- **Vegetation**: Darker green patches
- **Urban Areas**: Gray/brown development zones
- **Deforestation**: Lighter brown cleared areas

### Change Detection Visualization
- **Before Image**: Natural terrain with water and vegetation
- **After Image**: Same terrain with visible changes
- **Heatmap**: Multi-colored gradient (blue→green→yellow→red)
- **Overlay**: Base image with red anomaly highlights

---

## 📝 Configuration Files

### Next.js Configuration (`frontend/next.config.ts`)
- Turbopack settings
- Build optimizations
- Development server settings

### TailwindCSS Configuration (`frontend/tailwind.config.ts`)
- Custom color schemes
- Responsive breakpoints
- Animation utilities

### TypeScript Configuration (`frontend/tsconfig.json`)
- Strict type checking
- Path aliases
- Build targets

---

## 🚀 Deployment Notes

### Environment Variables
- `NEXT_PUBLIC_API_BASE`: Backend API URL (default: http://localhost:8001)
- Database connections (future enhancement)
- API keys (future enhancement)

### Production Considerations
- Image caching strategies
- Database persistence for runs
- Real image processing pipeline
- Scalability optimizations

---

## 🔄 Future Enhancements

### Planned Features
- [ ] Real satellite image processing
- [ ] Database persistence
- [ ] User authentication
- [ ] Advanced ML models
- [ ] Export functionality
- [ ] Batch processing
- [ ] Real-time collaboration
- [ ] Mobile app

### Technical Improvements
- [ ] Redis caching for images
- [ ] PostgreSQL for data storage
- [ ] Docker containerization
- [ ] Cloud deployment
- [ ] CDN for static assets
- [ ] WebSocket for real-time updates

---

## 📞 Support

For questions or issues:
1. Check the API documentation: http://localhost:8001/docs
2. Verify both servers are running
3. Check browser console for errors
4. Review this documentation for configuration details

---

**Generated**: February 22, 2026  
**Version**: 1.0.0  
**Framework**: Next.js 16.1.1 + FastAPI 0.128.0
