
# 🚀 Build Your Standalone Android App

Your **Laundry Stock Manager** app is ready to be built as a standalone Android application! Follow these simple steps to create an APK or AAB file that you can install on any Android device or publish to the Google Play Store.

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ Node.js installed on your computer
- ✅ An Expo account (create one free at [expo.dev](https://expo.dev))
- ✅ Android device for testing (or Android emulator)

---

## 🎯 Quick Start - Build Your First APK

### Step 1: Install EAS CLI

Open your terminal and run:

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials.

### Step 3: Configure Your Project

Run this command **only once** to set up your project:

```bash
eas build:configure
```

This will automatically create/update your `eas.json` file and assign a project ID.

### Step 4: Build Your APK

To create an APK file you can install directly on Android devices:

```bash
eas build -p android --profile preview
```

**What happens next:**
- EAS will upload your code to Expo's build servers
- The build process takes 10-20 minutes
- You'll get a link to download your APK when it's done
- You can also view the build progress at [expo.dev](https://expo.dev)

### Step 5: Install on Your Device

1. Download the APK from the link provided
2. Transfer it to your Android device
3. Enable "Install from Unknown Sources" in your device settings
4. Tap the APK file to install
5. Open your app and enjoy! 🎉

---

## 📱 Build Profiles Explained

Your app has three build profiles configured in `eas.json`:

### 1. **Development** (for testing with debugging)
```bash
eas build -p android --profile development
```
- Creates a development build with debugging tools
- Larger file size
- Best for active development

### 2. **Preview** (for testing without debugging)
```bash
eas build -p android --profile preview
```
- Creates an APK file
- Smaller than development build
- **Perfect for sharing with testers**
- Can be installed directly on devices

### 3. **Production** (for Google Play Store)
```bash
eas build -p android --profile production
```
- Creates an AAB (Android App Bundle) file
- Optimized for Play Store distribution
- Required format for Google Play Store

---

## 🏪 Publishing to Google Play Store

### Prerequisites

- Google Play Developer account ($25 one-time fee)
- App screenshots and promotional materials
- Privacy policy URL

### Step-by-Step Guide

#### 1. Build Production AAB

```bash
eas build -p android --profile production
```

#### 2. Create Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay the $25 registration fee
3. Complete your developer profile

#### 3. Create Your App

1. Click "Create app" in Play Console
2. Fill in basic information:
   - App name: **Laundry Stock Manager**
   - Default language
   - App type: Application
   - Free or paid: Free

#### 4. Complete Store Listing

You'll need to provide:

- **Short description** (80 characters max)
  ```
  Track laundry chemicals & linens with automatic stock updates and PDF reports
  ```

- **Full description** (4000 characters max)
  ```
  Laundry Stock Manager helps you efficiently manage your laundry business inventory.

  CHEMICAL MANAGEMENT:
  • Add and track all your laundry chemicals
  • Record usage by date
  • Automatic stock calculation
  • Low stock alerts when reaching minimum level
  • Edit chemical details anytime

  LINEN MANAGEMENT:
  • Track towels, bed sheets, and other linens
  • Manage status: New, Dirty, Thrown
  • Monitor opening balance and current stock
  • Easy status updates

  PDF REPORTS:
  • Generate professional PDF reports
  • Save reports to device storage
  • Share reports easily
  • Print-ready format

  FEATURES:
  • Modern, user-friendly interface
  • Dark mode support
  • Local data storage (no internet required)
  • Fast and responsive
  • Clean, breathable design

  Perfect for hotels, laundromats, hospitals, and any business managing laundry inventory!
  ```

- **App screenshots** (at least 2)
  - Take screenshots of your app on an Android device
  - Minimum resolution: 320px
  - Maximum resolution: 3840px

- **App icon** (512x512 PNG)
  - High-quality icon without transparency

- **Feature graphic** (1024x500 PNG)
  - Promotional banner for your app

#### 5. Content Rating

1. Complete the content rating questionnaire
2. Your app will likely be rated "Everyone"

#### 6. Target Audience

1. Select target age groups
2. Complete any required declarations

#### 7. Privacy Policy

You'll need a privacy policy URL. Here's a template:

```
Privacy Policy for Laundry Stock Manager

Data Storage:
All data is stored locally on your device using AsyncStorage. We do not collect, transmit, or store any personal information on external servers.

Permissions:
- Storage: Used to save PDF reports to your device

Contact:
[Your email address]

Last updated: [Current date]
```

Host this on a simple website or use services like [Privacy Policy Generator](https://www.privacypolicygenerator.info/).

#### 8. Upload Your App

1. Go to "Production" → "Create new release"
2. Upload the AAB file you built
3. Add release notes:
   ```
   Initial release of Laundry Stock Manager
   
   Features:
   - Chemical inventory management
   - Linen tracking
   - PDF report generation
   - Low stock alerts
   ```
4. Review and roll out to production

#### 9. Submit for Review

1. Complete all required sections (marked with red exclamation marks)
2. Click "Submit for review"
3. Wait for approval (typically 1-7 days)

---

## 🔄 Updating Your App

When you want to release an update:

### 1. Update Version Numbers

Edit `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

**Important:**
- `version`: Human-readable version (1.0.1, 1.1.0, etc.)
- `versionCode`: Must increase by 1 for each release (1, 2, 3, etc.)

### 2. Build New Version

```bash
eas build -p android --profile production
```

### 3. Upload to Play Store

1. Go to Play Console → Production → Create new release
2. Upload the new AAB file
3. Add release notes describing what's new
4. Submit for review

---

## 🛠️ Troubleshooting

### Build Fails

**Check your configuration:**
```bash
eas build:configure
```

**View detailed logs:**
- Go to [expo.dev](https://expo.dev)
- Click on your project
- View build logs for error details

**Common issues:**
- Syntax errors in `app.json`
- Missing dependencies
- Invalid package name

### App Crashes on Device

1. **Test with development build first:**
   ```bash
   eas build -p android --profile development
   ```

2. **Check logs:**
   - Use `adb logcat` if device is connected
   - Look for error messages in the console

3. **Verify permissions:**
   - Ensure all required permissions are in `app.json`

### Play Store Rejection

**Common reasons:**
- Missing privacy policy
- Incomplete store listing
- Content rating not completed
- Target audience not specified

**Solution:**
- Review all sections in Play Console
- Ensure all required fields are filled
- Read rejection email carefully for specific issues

---

## 📊 App Features Summary

Your Laundry Stock Manager includes:

### Chemical Management
- ✅ Add new chemicals with opening balance
- ✅ Record usage by date
- ✅ Automatic stock calculation
- ✅ Low stock alerts (notifies at balance = 1)
- ✅ Edit chemical details
- ✅ Delete chemicals with confirmation

### Linen Management
- ✅ Add new linens (towels, bed sheets, etc.)
- ✅ Track status: New, Dirty, Thrown
- ✅ Opening balance tracking
- ✅ Current balance calculation
- ✅ Edit linen details
- ✅ Delete linens with confirmation

### PDF Reports
- ✅ Generate formatted PDF reports
- ✅ Save to device storage
- ✅ Share via any app
- ✅ Professional table layout
- ✅ Separate reports for chemicals and linens

### User Interface
- ✅ Modern, clean design
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Intuitive navigation
- ✅ Floating tab bar
- ✅ Color-coded status indicators

---

## 🎨 Customization

### Change App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name"
  }
}
```

### Change Package Name

Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

**Note:** Package name must be unique and cannot be changed after publishing to Play Store.

### Change App Icon

1. Replace `./assets/images/natively-dark.png` with your icon
2. Icon should be 1024x1024 PNG
3. Rebuild your app

---

## 📞 Support & Resources

### Expo Documentation
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [App Store Deployment](https://docs.expo.dev/submit/introduction/)
- [Expo Forums](https://forums.expo.dev/)

### Google Play
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [Launch Checklist](https://developer.android.com/distribute/best-practices/launch/launch-checklist)

### Your App
- All data is stored locally using AsyncStorage
- No backend server required
- Works offline
- No user accounts needed

---

## ✅ Pre-Launch Checklist

Before publishing to Play Store:

- [ ] Test app thoroughly on multiple devices
- [ ] Verify all features work correctly
- [ ] Test PDF generation and saving
- [ ] Check low stock alerts
- [ ] Test in both light and dark mode
- [ ] Prepare screenshots (at least 2)
- [ ] Create app icon (512x512)
- [ ] Create feature graphic (1024x500)
- [ ] Write app description
- [ ] Create privacy policy
- [ ] Set up Google Play Console account
- [ ] Build production AAB
- [ ] Complete store listing
- [ ] Submit for review

---

## 🎉 You're Ready!

Your app is fully configured and ready to build. Start with a preview build to test on your device, then move to production when you're ready to publish to the Play Store.

**Quick command to get started:**
```bash
eas build -p android --profile preview
```

Good luck with your app! 🚀
