# Time-Based Interview Access Testing Guide

## 🎯 **How the System Works**

The interview links now have time-based access control:

### **Time Windows:**
- **15 minutes before** scheduled time: Shows countdown
- **During scheduled time** (15 min before to 30 min after): Allows access
- **30 minutes after** scheduled time: Shows "interview expired"

## 🧪 **Testing Scenarios**

### **1. Test Early Access (Countdown)**
1. Schedule an interview for 10 minutes from now
2. Click the interview link immediately
3. **Expected Result:** Yellow countdown screen with time remaining

### **2. Test On-Time Access**
1. Wait until the scheduled time (or within the 15-minute window)
2. Click the interview link
3. **Expected Result:** Green "Interview Time" indicator and normal form

### **3. Test Late Access**
1. Wait 30+ minutes after the scheduled time
2. Click the interview link
3. **Expected Result:** Red "Interview Time Expired" message

### **4. Test Non-Scheduled Interview**
1. Use a direct interview link (not from email)
2. **Expected Result:** Normal access (no time restrictions)

## 📋 **Test Steps**

### **Step 1: Schedule an Interview**
1. Go to `/schedule-interview`
2. Select a date and time (e.g., 5 minutes from now)
3. Fill in candidate details
4. Send invitation

### **Step 2: Test Different Time Scenarios**
1. **Immediate access:** Click link right after scheduling
2. **On-time access:** Wait until scheduled time
3. **Late access:** Wait 30+ minutes after scheduled time

### **Step 3: Verify Email Link**
1. Check the email sent to the candidate
2. Click the interview link in the email
3. Verify time-based behavior

## 🔧 **Customizing Time Windows**

To modify the time windows, edit these values in the interview page:

```javascript
// Allow 15 minutes before and 30 minutes after the scheduled time
const fifteenMinutesBefore = 15 * 60 * 1000; // 15 minutes in milliseconds
const thirtyMinutesAfter = 30 * 60 * 1000; // 30 minutes in milliseconds
```

## 📱 **Features Implemented**

✅ **Real-time countdown** with hours, minutes, seconds
✅ **Visual status indicators** (yellow for early, green for on-time, red for late)
✅ **Automatic time checking** when page loads
✅ **Responsive design** for all screen sizes
✅ **Professional UI** with clear messaging

## 🎨 **UI States**

- **🟡 Early:** Yellow countdown with timer
- **🟢 On-time:** Green indicator with normal form
- **🔴 Late:** Red expired message
- **⚪ Loading:** Spinner while checking schedule
