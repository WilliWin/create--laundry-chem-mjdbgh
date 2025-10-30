
# Building Your Laundry Stock Manager App for Android

This guide will help you build and deploy your laundry chemical and linen stock management app to Android devices.

## Prerequisites

- Node.js installed
- Expo account (free at expo.dev)
- Android device or emulator for testing
- Google Play Developer account ($25 one-time fee) for Play Store submission

## Quick Start - Testing on Your Device

### Method 1: Using Expo Go (Fastest)

1. Install Expo Go from Google Play Store on your Android device
2. Run the development server:
   ```bash
   npm run android
   ```
   or
   ```bash
   npx expo start
   ```
3. Scan the QR code with Expo Go

### Method 2: Build Standalone APK

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure the project (first time only):
   ```bash
   eas build:configure
   ```

4. Build an APK for testing:
   ```bash
   eas build -p android --profile preview
   ```

5. Download the APK from the link provided and install it on your device

## Building for Google Play Store

### Step 1: Prepare Your App

1. Update app.json with your app details:
   - Change the app name
   - Update the package name (must be unique)
   - Add a proper app icon (1024x1024 PNG)
   - Update version and versionCode

2. Create app screenshots and promotional materials:
   - At least 2 screenshots (phone)
   - Feature graphic (1024x500)
   - App icon (512x512)

### Step 2: Build Production AAB

1. Build the Android App Bundle:
   ```bash
   eas build -p android --profile production
   ```

2. Wait for the build to complete (usually 10-20 minutes)

3. Download the .aab file from the Expo dashboard

### Step 3: Create Google Play Console Account

1. Go to https://play.google.com/console
2. Pay the $25 one-time registration fee
3. Complete your developer profile

### Step 4: Create Your App Listing

1. Click "Create app" in Play Console
2. Fill in app details:
   - App name
   - Default language
   - App or game
   - Free or paid

3. Complete the store listing:
   - Short description (80 characters)
   - Full description (4000 characters)
   - Screenshots
   - Feature graphic
   - App icon

4. Fill out content rating questionnaire

5. Select target audience and content

6. Complete privacy policy (required)

### Step 5: Upload Your App

1. Go to "Production" → "Create new release"
2. Upload the .aab file
3. Add release notes
4. Review and roll out

### Step 6: Submit for Review

1. Complete all required sections
2. Submit for review
3. Wait for approval (usually 1-7 days)

## Automated Submission with EAS

After setting up your Google Play Console:

1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Save it as `google-service-account.json` in your project root
4. Run:
   ```bash
   eas submit -p android
   ```

## Updating Your App

1. Increment version in app.json:
   ```json
   "version": "1.0.1",
   "android": {
     "versionCode": 2
   }
   ```

2. Build new version:
   ```bash
   eas build -p android --profile production
   ```

3. Submit update:
   ```bash
   eas submit -p android
   ```

## Troubleshooting

### Build Fails
- Check your app.json for syntax errors
- Ensure all dependencies are properly installed
- Review build logs in Expo dashboard

### App Crashes on Device
- Test with development build first
- Check console logs
- Ensure all permissions are properly configured

### Play Store Rejection
- Review Google Play policies
- Ensure privacy policy is accessible
- Complete all required metadata
- Test app thoroughly before submission

## App Features

Your Laundry Stock Manager includes:

- **Chemical Management**: Track chemicals, record usage, automatic stock calculation, low stock alerts
- **Linen Management**: Track linens (towels, bed sheets), manage status (new, dirty, thrown)
- **PDF Reports**: Generate and save PDF reports for chemicals and linens
- **Modern UI**: Clean, user-friendly interface with dark mode support
- **Local Storage**: All data stored locally on device using AsyncStorage

## Support

For issues with:
- Expo/EAS: https://docs.expo.dev
- Google Play: https://support.google.com/googleplay/android-developer

## Important Notes

- Keep your signing keys secure
- Test thoroughly before production release
- Monitor crash reports in Play Console
- Respond to user reviews
- Keep app updated with latest security patches
