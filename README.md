# ShuttleQ - A management application for Badminton lovers.

## Overview

ShuttleQ is a web application designed to manage the game of badminton. Badminton is a popular racket sport played by either two opposing players (singles) or two opposing pairs (doubles) on a rectangular court divided by a net. The objective is to score points by hitting a shuttlecock over the net into the opponent's court. This project aims to simplify the organization and management of badminton games, including scoring, player pairing, and queue management.

## Scoring System

- All singles and doubles matches follow a best-of-three games format.
- A game is won by the side that reaches 21 points first.
- A point is awarded on every serve and goes to the winning side of a rally.
- If the score reaches 20-20, a side must win by two clear points to secure the game.
- If the score reaches 29-29, the first side to get their 30th point wins.

## Technologies Used

### Backend

- Node.js
- Express.js
- Sequelize

### Database

- PostgreSQL

## Game Types

ShuttleQ supports game types, including:

- Singles: 2 players competing against each other.
- Doubles: 2 pairs competing against each other.
- Mixed games: Combinations of male vs. male, female vs. female, male/male vs. male/male, female/female vs. female/female, and female/male vs. female/male.

## Managing Player Queues

ShuttleQ addresses the common issue of managing player queues at badminton courts. The application ensures that everyone gets a fair opportunity to play. Here are the key conditions for managing queues:

- Effective queue management as the number of pairs/players grows.
- Pairs play 2 consecutive games only if they win the first game.
- Top pairs on the queue are selected when the game starts.
- A losing pair is pushed to the bottom of the queue.
- New pairs can be added to the queue.
- A pair that wins 2 consecutive games is pushed off the top of the queue.
- In the event where all 4 players are out, the winning pair plays before the losing pair.

ShuttleQ provides a comprehensive solution for organizing and managing badminton games, making it easier for players to enjoy the sport and maintain a fair playing environment. The application leverages a modern tech stack to offer a seamless experience for both players and administrators.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ubongedem78/ShuttleQ.git

   cd ShuttleQ/src
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables using the .env.example

4. Start the server:

   ```bash
   npm start
   ```

## Usage

## API Documentation

## Contributing

Pull requests are very welcome. For major changes, please open an issue first to discuss what you would like to change.
