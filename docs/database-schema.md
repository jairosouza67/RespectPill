# Appwrite Database Schema for Respect Pill

## Collections

### users (managed by Appwrite Auth)
- userId (string, from auth)
- name (string)
- email (string)
- emailVerified (boolean)
- createdAt (datetime)
- updatedAt (datetime)

### profiles
- userId (string, relation to users)
- age (integer)
- weight (float)
- height (float)
- activityLevel (string: sedentary, light, moderate, active, very_active)
- goals (string[])
- restrictions (string[])
- experienceLevel (string: beginner, intermediate, advanced)
- dailyTimePreference (integer, minutes)
- workSchedule (string: morning, afternoon, evening, night, flexible)
- sleepHours (float)
- allergies (text)
- injuries (text)
- consentFlags (object)
- priorityGoals (string[])
- createdAt (datetime)
- updatedAt (datetime)

### plans
- userId (string, relation to users)
- title (string)
- description (text)
- duration (integer, days)
- pillars (string[])
- objectives (string[])
- dailyTasks (object[])
- status (string: active, completed, paused)
- startDate (datetime)
- endDate (datetime)
- progress (float, 0-100)
- createdAt (datetime)
- updatedAt (datetime)

### trackers
- userId (string, relation to users)
- type (string: workout, sleep, reading, sexuality, posture, habits, diet)
- date (date)
- value (object)
- metadata (object)
- createdAt (datetime)
- updatedAt (datetime)

### content
- title (string)
- description (text)
- type (string: video, audio, text, pdf, quiz)
- contentUrl (string)
- thumbnailUrl (string)
- duration (integer, minutes)
- level (string: beginner, intermediate, advanced)
- pillar (string)
- tags (string[])
- isActive (boolean)
- createdAt (datetime)
- updatedAt (datetime)

### posts (community)
- userId (string, relation to users)
- title (string)
- content (text)
- images (string[])
- tags (string[])
- likes (integer)
- comments (integer)
- isActive (boolean)
- createdAt (datetime)
- updatedAt (datetime)

### comments
- postId (string, relation to posts)
- userId (string, relation to users)
- content (text)
- likes (integer)
- isActive (boolean)
- createdAt (datetime)
- updatedAt (datetime)

### payments
- userId (string, relation to users)
- stripeId (string)
- amount (float)
- currency (string)
- status (string: pending, completed, failed, refunded)
- type (string: subscription, one_time)
- planId (string)
- metadata (object)
- createdAt (datetime)
- updatedAt (datetime)

### reports (moderation)
- reporterId (string, relation to users)
- targetId (string)
- targetType (string: post, comment, user)
- reason (string)
- description (text)
- status (string: pending, reviewed, resolved, dismissed)
- moderatorId (string, relation to users)
- createdAt (datetime)
- updatedAt (datetime)

## Indexes

### profiles
- userId (unique)
- age
- experienceLevel

### plans
- userId + status
- startDate
- endDate

### trackers
- userId + date
- userId + type + date
- type + date

### content
- type + level
- pillar + level
- isActive + createdAt

### posts
- userId + createdAt
- isActive + createdAt
- tags

### comments
- postId + createdAt
- userId + createdAt

### payments
- userId + createdAt
- status + createdAt
- stripeId (unique)

### reports
- targetId + targetType
- status + createdAt
- reporterId + createdAt