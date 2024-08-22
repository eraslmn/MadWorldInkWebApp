
# MadWorldInk Web Application

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Compiling and Running the Project](#compiling-and-running-the-project)
- [Usage Guidelines](#usage-guidelines)
- [Technologies Used](#technologies-used)
- [Testing](#testing)
- [Contributing](#contributing)

## Introduction
MadWorldInk is a web application designed for showcasing and selling artwork by a single artist, MadWorldInk. This platform allows users to browse through the artist's portfolio, purchase artworks, and provides the artist with a sufficient dashboard for managing products, orders, and users.

## Project Structure
The project is organized into several key folders and files, each serving a specific purpose:

- **Controllers**: This folder contains the controllers that handle HTTP requests and responses.
  - **AuthController.cs**: Manages authentication-related operations.
  - **CartController.cs**: Handles cart-related functionalities.
  - **OrderController.cs**: Manages order-related operations.
  - **ProductController.cs**: Handles product management and displays.

- **Data**: Contains the database context and seeding files.

- **DTOs**: Data Transfer Objects (DTOs) that define the structure of data exchanged between the client and server.

- **Mapping**: This folder includes configurations for AutoMapper, which is used for object-to-object mapping.

- **Migrations**: Contains the database migration files for setting up the database schema.

- **Models**: Defines the data models that represent the entities in the system (e.g., Users, Products, Orders).

- **Repositories**: Handles data access logic.
  - **Implementations**: Contains the concrete implementations of the repository interfaces.
  - **Interfaces**: Defines the interfaces for the repositories.

- **SchemaFilters**: Includes schema filters for customizing API documentation.

- **Services**: Contains business logic and service layer implementations.
  - **Authentications**: Manages user authentication and role-based access.
  - **Implementations**: Concrete implementations of service interfaces.

- **wwwroot**: This folder contains static files such as images and CSS used in the application.

- **README.md**: The file you're currently reading, which provides documentation for the project.

## Setup Instructions

### Prerequisites
- **.NET Core 7 SDK**: Ensure you have .NET Core 7 installed on your machine.
- **Node.js**: Required for running the React frontend.
- **PostgreSQL**: The application uses PostgreSQL as the database. Ensure it is installed and configured.

### Installation

#### Frontend
1. Navigate to the `madworldink` folder:
   ```bash
   cd madworldink
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

#### Backend
1. Navigate to the `MadWorldInkWebAPI` folder:
   ```bash
   cd MadWorldInkWebAPI
   ```
2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

### Running the Project

#### Frontend
1. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

#### Backend
1. Run the Web API:
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:7213`.

## Usage Guidelines

### Admin Dashboard
- **Login**: Admin can log in using the credentials set up during the initial seeding.
- **Manage Products**: Add, edit, or delete products (artworks) from the catalog.
- **Manage Orders**: View and update the status of customer orders.
- **Manage Users**: Monitor customer data and interactions.

### Customer Usage
- **Browse Products**: Customers can view the available artworks, filter by category, and see detailed descriptions.
- **Purchase**: Add items to the cart and proceed to checkout using a secure payment process.
- **Order History**: After purchase, customers can log in to view their order history.

### Testing the Application
- If users want to test the application by creating a product, they can navigate to the `madworldink/src` folder where they can find pictures. These images can be used when creating a product.

## Technologies Used

- **Backend**: .NET Core 7, ASP.NET Core, Entity Framework Core, AutoMapper
- **Frontend**: React, CSS, HTML
- **Database**: PostgreSQL
- **Testing**: xUnit

## Testing
The project uses xUnit for unit testing. To run the tests, navigate to the test project and use the following command:

```bash
dotnet test
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

