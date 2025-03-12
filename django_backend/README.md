
# MovieTime Django Backend

This is the Django backend for the MovieTime cinema booking application. It provides API endpoints for authentication, movie bookings, seat management, and email confirmations.

## Setup Instructions

1. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Create a `.env` file in the project root
   - Add required variables (see sample below)

4. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register a new user
- POST `/api/auth/login/` - Login and get token
- POST `/api/auth/logout/` - Logout (invalidate token)
- GET `/api/auth/user/` - Get current user info

### Bookings
- GET `/api/bookings/` - List user's bookings
- POST `/api/bookings/` - Create a new booking
- GET `/api/bookings/<id>/` - Get booking details
- DELETE `/api/bookings/<id>/` - Cancel booking

### Seats
- GET `/api/seats/taken/` - Get taken seats for a movie showtime

### Tickets
- GET `/api/tickets/` - List user's tickets (same as bookings)

### Emails
- POST `/api/emails/booking-confirmation/` - Send booking confirmation email

## Sample .env file
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
```
