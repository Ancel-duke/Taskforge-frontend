# TaskForge Frontend

A modern, responsive task and project management application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, intuitive interface with responsive design
- **Real-time Collaboration**: Live updates using Socket.io
- **Project Management**: Create, organize, and track projects
- **Kanban Board**: Drag-and-drop task management
- **User Authentication**: Secure login and registration
- **Analytics Dashboard**: Project progress and performance insights
- **Team Collaboration**: Invite team members and manage permissions
- **Search & Filter**: Advanced search and filtering capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **UI Components**: Custom components with Tailwind
- **Authentication**: JWT-based auth
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ancel-duke/Taskforge-frontend.git
   cd Taskforge-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=your render url
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   NEXT_PUBLIC_ENABLE_DEBUG=false
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics features | `false` |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Enable debug mode | `false` |

### Backend Configuration

**Important**: Update your backend callback URLs in the backend environment variables:

```env
# In your backend .env file
CORS_ORIGIN=https://your-frontend-domain.netlify.app
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── analytics/         # Analytics dashboard
│   ├── dashboard/         # Main dashboard
│   ├── projects/          # Project management
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── common/           # Shared components
│   ├── kanban/           # Kanban board components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🚀 Deployment

### Netlify Deployment

1. **Connect your GitHub repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
   - `NEXT_PUBLIC_ENABLE_ANALYTICS`: `false`
   - `NEXT_PUBLIC_ENABLE_DEBUG`: `false`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔗 API Integration

The frontend connects to the TaskForge backend API. Make sure your backend is running and accessible at the URL specified in `NEXT_PUBLIC_API_URL`.

### API Endpoints

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Projects**: `/api/projects/*`
- **Invitations**: `/api/invitations/*`
- **Health Check**: `/api/health`

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Component-specific styles are in their respective files

### Components
- All components are in the `components/` directory
- Follow the existing component structure for consistency
- Use TypeScript interfaces for type safety

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Clear `.next` cache and reinstall dependencies
   ```bash
   rm -rf .next
   npm install
   npm run build
   ```

2. **API Connection Issues**: Verify backend URL in environment variables

3. **Socket Connection**: Check CORS settings in backend

### Development Tips

- Use `npm run dev` for development
- Check browser console for errors
- Verify environment variables are loaded correctly

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Backend Repository**: [TaskForge Backend](https://github.com/Ancel-duke/Taskforge-backend)
- **Live Demo**: [TaskForge App](https://your-frontend-domain.netlify.app)
- **Backend API**: [https://taskforge-5wdo.onrender.com](https://taskforge-5wdo.onrender.com)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
