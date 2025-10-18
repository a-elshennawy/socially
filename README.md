# Socially

A minimal, anonymous social media platform for sharing thoughts and engaging in conversations. Post anonymously or with a username, like posts and comments, and share content with others.

## Features

- **Anonymous Posting**: Share thoughts with or without a username
- **Real-time Updates**: All posts and comments sync instantly using Firestore
- **Like System**: Like posts and comments with persistent state
- **Threaded Comments**: Add and view comments on any post
- **URL Link Detection**: Automatically converts URLs in posts to clickable links
- **Share Posts**: Copy post links to share with others
- **Post Filtering**: Sort posts by newest or oldest first
- **Dark/Light Theme**: Toggle between themes with preference persistence
- **Verified Badges**: Special icons for verified users and anonymous posters
- **Smooth Animations**: Engaging UI with Motion (Framer Motion) animations
- **Scroll to Top**: Quick navigation button after scrolling

## Tech Stack

- **Frontend**: React 19 with Vite
- **Routing**: React Router DOM v7
- **Database**: Firebase Firestore
- **Styling**: Bootstrap 5 + Custom CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: React Icons
- **ID Generation**: Nanoid
- **Loading States**: React Spinners

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd socially
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Contexts/
│   │   └── ThemeProvider.jsx        # Light/dark theme management
│   ├── Layout/
│   │   ├── Layout.jsx               # Main layout wrapper
│   │   ├── NavBar.jsx               # Top navigation with post input
│   │   └── UpBtn.jsx                # Scroll to top button
│   ├── Pages/
│   │   ├── Home.jsx                 # Main feed with all posts
│   │   └── PostComments.jsx         # Individual post with comments
│   └── ReusableComponents/
│       ├── CommentsInput.jsx        # Comment form component
│       ├── FilterPannel.jsx         # Post sorting filter
│       ├── PostInput.jsx            # New post form
│       └── SpinnerLoader.jsx        # Loading spinner
├── utils/
│   └── linkify.jsx                  # URL detection and conversion
├── App.jsx                          # Main app with routing
├── App.css                          # Global styles
├── firebase.js                      # Firebase configuration
├── fonts.css                        # Custom fonts
└── main.jsx                         # App entry point
```

## Firebase Configuration

### Firestore Collections

The app uses a `posts` collection with documents structured as:

```javascript
{
  text: string,              // Post content
  senderName: string,        // Username or "anonymous"
  timestamp: Timestamp,      // Creation time
  likes: number,            // Like count
  comments: [{
    id: string,            // Unique comment ID (nanoid)
    text: string,          // Comment content
    timestamp: Date,       // Comment time
    likes: number          // Comment like count
  }]
}
```

### Firestore Rules

Since this is a public anonymous platform, set up permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      // Anyone can read posts
      allow read: if true;
      
      // Anyone can create posts
      allow create: if true;
      
      // Anyone can update posts (for likes and comments)
      allow update: if true;
      
      // Optionally restrict deletion
      allow delete: if false;
    }
  }
}
```

**Note**: These rules allow public access. Consider adding authentication if needed.

## Key Features Explained

### Anonymous Posting

Users can post with or without a username:
- Empty username defaults to "anonymous"
- Special badges for certain usernames (verified, anonymous)

```javascript
// Username badge logic
if (name.includes("shennawy") || name.includes("ghall")) {
  return <MdVerified />; // Verified badge
}
if (name.includes("anonymous")) {
  return <FaQuestion />; // Anonymous badge
}
return <FaUser />; // Default user icon
```

### Like System with LocalStorage

Likes are tracked both in Firestore and localStorage:
- **Firestore**: Stores actual like counts
- **LocalStorage**: Tracks which posts/comments user has liked
- Persists across page refreshes without authentication

```javascript
// Like state persists in localStorage
const [localLikeStatus, setLocalLikeStatus] = useState(() => {
  const savedLikes = localStorage.getItem("likedPosts");
  return savedLikes ? JSON.parse(savedLikes) : {};
});
```

### URL Link Detection

The `linkify` utility automatically detects URLs in text:
- Supports `http://`, `https://`, and `www.` formats
- Converts URLs to clickable links
- Opens links in new tabs

```javascript
// Example usage
{linkify(post.text)}
// Input: "Check out www.example.com"
// Output: "Check out <a href="http://www.example.com">...</a>"
```

### Real-time Updates

All data uses Firestore's `onSnapshot` for live updates:

```javascript
const unsubscribe = onSnapshot(query, (snapshot) => {
  // Updates happen automatically when data changes
});
```

### Post Sharing

Copy post URLs to clipboard with visual feedback:
- Generates shareable URL with post ID
- Shows success notification for 3 seconds
- Uses Motion for smooth animation

### Comment Threading

Comments are stored as an array within each post:
- Displayed in reverse chronological order (newest first)
- Each comment has its own like system
- Real-time updates when new comments added

## Usage

### Creating a Post

1. Enter your message in the textarea at the top
2. Optionally add a username
3. Press "Post" or hit Enter
4. Post appears instantly in the feed

### Liking Content

- Click the heart icon on any post or comment
- Icon fills with color when liked
- Click again to unlike

### Adding Comments

1. Click on a post to view details
2. Enter your comment in the textarea
3. Press "Add Comment" or hit Enter
4. Comment appears at the bottom

### Sharing Posts

1. Click the share icon on any post
2. Post URL is copied to clipboard
3. Share the link with others

### Filtering Posts

- Use the dropdown in the feed
- Options: "Most Recent" or "Oldest"
- Feed updates instantly

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Theme Colors

Modify CSS variables in `App.css`:

```css
:root {
  --background: #000;
  --color: #fff;
  --postBackG: rgba(255, 255, 255, 0.1);
  --navbarColor: rgba(255, 255, 255, 0.1);
}

body.light {
  --background: #fff;
  --color: #000;
  /* ... */
}
```

### Verified Usernames

Add custom badges in `getUsernameIcon` function:

```javascript
const getUsernameIcon = (name) => {
  const lowerName = name.trim().toLowerCase();
  if (lowerName.includes("yourname")) {
    return <YourCustomIcon />;
  }
  // ...
};
```

### Share URL Domain

Update the domain in share functionality:

```javascript
// In Home.jsx and PostComments.jsx
const postUrl = `https://your-domain.com/PostComments/${postId}`;
```

## Animation System

The app uses Motion (Framer Motion) for smooth animations:

- **Post entrance**: Fade and slide up on scroll
- **Notifications**: Slide up from bottom
- **Smooth transitions**: Theme changes, page navigation

Example animation:

```javascript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 50 }}
>
  {/* Content */}
</motion.div>
```

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Known Limitations

- No user authentication (fully anonymous)
- No post deletion by users
- No edit functionality for posts/comments
- No image/media uploads
- No direct messaging
- No user profiles
- LocalStorage-based likes (not shared across devices)

## Security Considerations

Since this is a public anonymous platform:
- No authentication required
- Anyone can post, like, and comment
- Consider adding content moderation
- Monitor for spam and abuse
- Add rate limiting for production use

## Future Enhancements

- [ ] User authentication (optional)
- [ ] Post and comment editing
- [ ] Post deletion functionality
- [ ] Image/GIF support
- [ ] Hashtag system
- [ ] Search functionality
- [ ] User profiles
- [ ] Notification system
- [ ] Report/flag content
- [ ] Admin moderation panel
- [ ] Rate limiting
- [ ] Pagination for large feeds
- [ ] Trending posts
- [ ] Save/bookmark posts

## Deployment

The app is designed for static hosting (e.g., Cloudflare Pages):

```bash
npm run build
# Deploy the 'dist' folder
```

Update the share URL in code to match your deployment domain.

## Troubleshooting

### Posts Not Showing
- Check Firebase console for data
- Verify Firestore rules allow read access
- Check browser console for errors

### Likes Not Persisting
- Check localStorage in browser DevTools
- Clear localStorage and try again
- Verify Firestore rules allow updates

### Theme Not Saving
- Check localStorage permissions
- Try different browser
- Clear cache and reload

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request


## Acknowledgments

- Firebase for real-time database
- Motion (Framer Motion) for animations
- Bootstrap for responsive layout
- React Icons for icon library
- Nanoid for unique ID generation
- React team for the framework

## Privacy Note

This is an anonymous platform with no user authentication. All posts and comments are public. Users should:
- Not share personal information
- Be aware posts are visible to everyone
- Understand likes are tracked via browser localStorage
- Know that data persists in Firebase
