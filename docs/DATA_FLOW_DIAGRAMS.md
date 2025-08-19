# Vivecruit - Data Flow Diagrams (DFD)
## Comprehensive System Data Flow Analysis

---

## Table of Contents
1. [DFD Level 0 - Context Diagram](#dfd-level-0---context-diagram)
2. [DFD Level 1 - System Overview](#dfd-level-1---system-overview)
3. [DFD Level 2 - Interview Creation Process](#dfd-level-2---interview-creation-process)
4. [DFD Level 2 - Interview Execution Process](#dfd-level-2---interview-execution-process)
5. [DFD Level 2 - Authentication Process](#dfd-level-2---authentication-process)
6. [DFD Level 2 - Feedback Generation Process](#dfd-level-2---feedback-generation-process)
7. [Data Dictionary](#data-dictionary)
8. [Process Specifications](#process-specifications)

---

## DFD Level 0 - Context Diagram

### Overview
The Context Diagram shows Vivecruit as a single process interacting with external entities.

```
                    ┌─────────────────┐
                    │   Recruiter     │
                    │   (User)        │
                    └─────────┬───────┘
                              │
                              │ Interview Requests
                              │ User Data
                              │
                    ┌─────────▼───────┐
                    │                 │
                    │   VIVECRUIT     │
                    │   SYSTEM        │
                    │                 │
                    └─────────┬───────┘
                              │
                              │ Interview Links
                              │ Results
                              │
                    ┌─────────▼───────┐
                    │   Candidate     │
                    │   (User)        │
                    └─────────────────┘
                              │
                              │
                    ┌─────────▼───────┐
                    │   External      │
                    │   Services      │
                    │                 │
                    │ • Supabase      │
                    │ • VAPI.ai       │
                    │ • OpenAI        │
                    │ • ElevenLabs    │
                    └─────────────────┘
```

### Data Flows
- **From Recruiter**: Interview creation requests, user authentication data
- **To Recruiter**: Interview links, candidate results, feedback reports
- **From Candidate**: Personal information, interview responses
- **To Candidate**: Interview questions, feedback, confirmation
- **From External Services**: AI responses, voice processing, database operations
- **To External Services**: User data, interview requests, voice data

---

## DFD Level 1 - System Overview

### Overview
Level 1 DFD breaks down the main system into major processes and data stores.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Recruiter     │───►│   1.0           │───►│   Candidate     │
│   Input         │    │   Authentication│    │   Output        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Data     │◄───│   2.0           │───►│   Interview     │
│   Store         │    │   Interview     │    │   Creation      │
└─────────────────┘    │   Management    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │◄───│   3.0           │───►│   Voice         │
│   Data Store    │    │   AI Question   │    │   Processing    │
└─────────────────┘    │   Generation    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Conversation  │◄───│   4.0           │───►│   Feedback      │
│   Data Store    │    │   Voice         │    │   Generation    │
└─────────────────┘    │   Interview     │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Results       │◄───│   5.0           │───►│   External      │
│   Data Store    │    │   Feedback      │    │   Services      │
└─────────────────┘    │   Processing    │    └─────────────────┘
```

### Major Processes
1. **1.0 Authentication**: Handles user login and session management
2. **2.0 Interview Management**: Manages interview creation and configuration
3. **3.0 AI Question Generation**: Generates interview questions using AI
4. **4.0 Voice Interview**: Conducts real-time voice interviews
5. **5.0 Feedback Processing**: Generates and processes candidate feedback

### Data Stores
- **User Data Store**: User profiles and authentication data
- **Interview Data Store**: Interview configurations and questions
- **Conversation Data Store**: Interview conversation logs
- **Results Data Store**: Candidate feedback and evaluation results

---

## DFD Level 2 - Interview Creation Process

### Overview
Detailed breakdown of the interview creation workflow.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Recruiter     │───►│   2.1           │───►│   Form          │
│   Input         │    │   Form          │    │   Validation    │
└─────────────────┘    │   Processing    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Validated     │◄───│   2.2           │───►│   AI Service    │
│   Form Data     │    │   Data          │    │   Request       │
└─────────────────┘    │   Validation    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Response   │◄───│   2.3           │───►│   Question      │
│   Data          │    │   AI Question   │    │   Formatting    │
└─────────────────┘    │   Generation    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Formatted     │◄───│   2.4           │───►│   Database      │
│   Questions     │    │   Question      │    │   Storage       │
└─────────────────┘    │   Processing    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │◄───│   2.5           │───►│   Link          │
│   Data Store    │    │   Interview     │    │   Generation    │
└─────────────────┘    │   Storage       │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │◄───│   2.6           │───►│   Recruiter     │
│   Link          │    │   Link          │    │   Output        │
└─────────────────┘    │   Creation      │    └─────────────────┘
```

### Process Details
- **2.1 Form Processing**: Collects job position, description, duration, type
- **2.2 Data Validation**: Validates form inputs and formats data
- **2.3 AI Question Generation**: Sends request to OpenAI via OpenRouter
- **2.4 Question Processing**: Parses AI response and formats questions
- **2.5 Interview Storage**: Saves interview data to Supabase database
- **2.6 Link Creation**: Generates unique interview URL for sharing

---

## DFD Level 2 - Interview Execution Process

### Overview
Detailed breakdown of the interview execution workflow.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │───►│   4.1           │───►│   Link          │
│   Link          │    │   Link          │    │   Validation    │
└─────────────────┘    │   Processing    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Validated     │◄───│   4.2           │───►│   Candidate     │
│   Link Data     │    │   Link          │    │   Information   │
└─────────────────┘    │   Validation    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Candidate     │◄───│   4.3           │───►│   Interview     │
│   Data          │    │   Candidate     │    │   Setup         │
└─────────────────┘    │   Data          │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │◄───│   4.4           │───►│   VAPI          │
│   Configuration │    │   Interview     │    │   Initialization│
└─────────────────┘    │   Setup         │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   VAPI          │◄───│   4.5           │───►│   Voice         │
│   Instance      │    │   VAPI          │    │   Connection    │
└─────────────────┘    │   Setup         │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Voice         │◄───│   4.6           │───►│   Conversation  │
│   Stream        │    │   Voice         │    │   Processing    │
└─────────────────┘    │   Interview     │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Conversation  │◄───│   4.7           │───►│   Interview     │
│   Data          │    │   Conversation  │    │   Completion    │
└─────────────────┘    │   Tracking      │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Completion    │◄───│   4.8           │───►│   Feedback      │
│   Signal        │    │   Interview     │    │   Generation    │
└─────────────────┘    │   Completion    │    └─────────────────┘
```

### Process Details
- **4.1 Link Processing**: Validates interview link and retrieves interview data
- **4.2 Link Validation**: Checks if interview exists and is valid
- **4.3 Candidate Data Collection**: Collects candidate name and email
- **4.4 Interview Setup**: Loads interview configuration and questions
- **4.5 VAPI Setup**: Initializes VAPI.ai voice assistant
- **4.6 Voice Connection**: Establishes voice connection with candidate
- **4.7 Conversation Tracking**: Monitors and records conversation
- **4.8 Interview Completion**: Handles interview termination and cleanup

---

## DFD Level 2 - Authentication Process

### Overview
Detailed breakdown of the authentication workflow.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User          │───►│   1.1           │───►│   Google        │
│   Login         │    │   Login         │    │   OAuth         │
│   Request       │    │   Processing    │    │   Request       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Google        │◄───│   1.2           │───►│   OAuth         │
│   OAuth         │    │   OAuth         │    │   Response      │
│   Response      │    │   Processing    │    └─────────────────┘
└─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User          │◄───│   1.3           │───►│   Database      │
│   Profile       │    │   User          │    │   Check         │
└─────────────────┘    │   Validation    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User          │◄───│   1.4           │───►│   Session       │
│   Data Store    │    │   User          │    │   Management    │
└─────────────────┘    │   Storage       │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Session       │◄───│   1.5           │───►│   Dashboard     │
│   Token         │    │   Session       │    │   Access        │
└─────────────────┘    │   Creation      │    └─────────────────┘
```

### Process Details
- **1.1 Login Processing**: Handles user login request
- **1.2 OAuth Processing**: Manages Google OAuth flow
- **1.3 User Validation**: Validates user credentials and profile
- **1.4 User Storage**: Creates or updates user in database
- **1.5 Session Creation**: Creates JWT session token

---

## DFD Level 2 - Feedback Generation Process

### Overview
Detailed breakdown of the feedback generation workflow.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Conversation  │───►│   5.1           │───►│   Conversation  │
│   Data          │    │   Conversation  │    │   Validation    │
└─────────────────┘    │   Processing    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Validated     │◄───│   5.2           │───►│   AI Service    │
│   Conversation  │    │   Conversation  │    │   Request       │
└─────────────────┘    │   Validation    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Response   │◄───│   5.3           │───►│   Feedback      │
│   Data          │    │   AI Feedback   │    │   Formatting    │
└─────────────────┘    │   Generation    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Formatted     │◄───│   5.4           │───►│   Database      │
│   Feedback      │    │   Feedback      │    │   Storage       │
└─────────────────┘    │   Processing    │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Results       │◄───│   5.5           │───►│   Notification  │
│   Data Store    │    │   Results       │    │   System        │
└─────────────────┘    │   Storage       │    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Notification  │◄───│   5.6           │───►│   Recruiter     │
│   Data          │    │   Notification  │    │   Dashboard     │
└─────────────────┘    │   Processing    │    └─────────────────┘
```

### Process Details
- **5.1 Conversation Processing**: Processes raw conversation data
- **5.2 Conversation Validation**: Validates conversation completeness
- **5.3 AI Feedback Generation**: Sends conversation to OpenAI for analysis
- **5.4 Feedback Processing**: Parses and formats AI feedback response
- **5.5 Results Storage**: Saves feedback results to database
- **5.6 Notification Processing**: Sends notification to recruiter

---

## Data Dictionary

### External Entities
- **Recruiter**: HR professional creating and managing interviews
- **Candidate**: Job applicant participating in interviews
- **External Services**: Third-party services (Supabase, VAPI.ai, OpenAI)

### Data Stores
- **User Data Store**: User profiles, authentication data
- **Interview Data Store**: Interview configurations, questions, metadata
- **Conversation Data Store**: Interview conversation logs, voice data
- **Results Data Store**: Candidate feedback, ratings, recommendations

### Data Flows
- **Interview Requests**: Job details, requirements, duration
- **User Data**: Name, email, profile information
- **AI Responses**: Generated questions, feedback analysis
- **Voice Data**: Real-time audio streams, conversation logs
- **Interview Links**: Unique URLs for candidate access
- **Feedback Data**: Candidate evaluations, ratings, recommendations

---

## Process Specifications

### Process 1.0 - Authentication
**Purpose**: Handle user authentication and session management
**Inputs**: Login credentials, OAuth tokens
**Outputs**: Session tokens, user profiles
**Logic**: Validate credentials, create/update user profile, generate session

### Process 2.0 - Interview Management
**Purpose**: Manage interview creation and configuration
**Inputs**: Job details, interview parameters
**Outputs**: Interview configurations, question sets
**Logic**: Validate inputs, generate questions, store configuration

### Process 3.0 - AI Question Generation
**Purpose**: Generate interview questions using AI
**Inputs**: Job description, requirements, interview type
**Outputs**: Structured question sets
**Logic**: Format prompts, call AI service, parse responses

### Process 4.0 - Voice Interview
**Purpose**: Conduct real-time voice interviews
**Inputs**: Interview configuration, candidate data
**Outputs**: Conversation logs, completion status
**Logic**: Initialize voice connection, manage conversation, track progress

### Process 5.0 - Feedback Processing
**Purpose**: Generate and process candidate feedback
**Inputs**: Conversation data, interview context
**Outputs**: Structured feedback, ratings, recommendations
**Logic**: Analyze conversation, generate feedback, store results

---

*This DFD documentation provides a comprehensive view of data flows within the Vivecruit system and should be updated as the system evolves.*
