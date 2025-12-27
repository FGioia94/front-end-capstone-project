# Admin Access Guide

## Testing Admin Features

To test admin-only features, you need to manually set the role in localStorage:

### Quick Admin Setup

1. **Open Browser Console** (F12)
2. **Run this command:**
```javascript
localStorage.setItem('user', JSON.stringify({username: 'admin', role: 'admin', loginTime: new Date().toISOString()}))
```
3. **Refresh the page**

You should now see:
- ⚡ Admin Mode badge (top right)
- Dark mode theme
- Background color palette selector (bottom right, in game mode)
- Speed slider control
- Username "admin" in navbar with logout button

### Regular User Setup

For testing regular user features:
```javascript
localStorage.setItem('user', JSON.stringify({username: 'testuser', role: 'user', loginTime: new Date().toISOString()}))
```

### Clear Session

To log out:
```javascript
localStorage.removeItem('user')
```

## Admin Features

- **Speed Control**: Adjust game speed (1x - 3x)
- **Background Customization**: Choose from 5 color palettes
  - Vibrant (purple/red/yellow)
  - Cool (blue/cyan/purple)
  - Warm (orange/red/yellow)
  - Sunset (pink/orange/yellow)
  - Forest (green tones)
- **Opacity Control**: Adjust background opacity (0-100%)
- **Dark Mode UI**: Automatic dark theme
- **Highscore Recording**: Saved to localStorage

## Regular User Features

- **Highscore Recording**: Saved to localStorage
- **No Speed Control**: Locked at 1x
- **No Background Control**: Uses default random palette

## Anonymous Features

- **Play Game**: Full gameplay access
- **No Speed Control**: Locked at 1x
- **No Highscore Recording**: Scores not saved
- **Prompt to Register**: Messages encourage sign-up
