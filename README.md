# NextUp – Ticket-Based Queue Management System
A multi-platform queue management system that aims to solve the hassle of queueing up by utilizing arduino as a ticket management system.

## Problem
Currently in my school, the line for requesting of documents would take atleast an hour and that's not counting the occasional people cutting in line, disputes about the wrong credentials, etc.

## Solution
A ticket based queue system that allows students and parents to:
- request a ticket, for authentication purposes
- register the ticket through the app
- see the current distance from the queue and allow them to come back later

Less hassle, no cutting in lines and allow student to move around while waiting for documents.

## Demo
https://github.com/user-attachments/assets/8b7ac37c-4508-412c-bdae-86dfe58eda1a

## Tech Stack
- Native: React Native (Expo)
- Backend: Node.js + Express
- Database: sqlite3
- Real-time: Socket.IO
- Hardware: Arduino UNO / TinkerCAD (simulated)

## Features
- Real-time queue updates
- Ticket generation system
- Admin queue control (call next, manage flow)
- Cross-device state synchronization
- Hardware display integration (simulated)

## System Architecture
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/6535ae15-07ba-4464-b0cc-8df7dd40a36b" />

## System Design Highlights
- Designed to handle multiple clients with consistent queue state and socket.io rooms
- Uses real-time communication to eliminate polling delays
- Separates client, server, and hardware layers for scalability
- Built with extensibility in mind (can expand into full service management system)

## Project Structure
```
- arduino/
  - ticketDispenser.ino // main arduino code
- backend/
  - database/
    - database.js // sql commands that handles interaction with the db
    - init.js // handles initializing the table schema
    - nextUp.db // sqlite db
  - server.js // main server code
- native/
  - assets/images // image folder
  - app/
    - admin/
      - Home.tsx // admin dashboard
    - user/
      - Home.tsx // user form menu
      - WaitingList.tsx // user waiting menu after form submission
    - components/
      - QueueDisplay.tsx // display component that shows length of queue and position of user
    - config/
      - config.js // temporary measure for setting backend route in case of ip change
    - index.js // login route for user and admin
```

## Running the System
