
from django.db import models
from django.contrib.auth.models import User

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField()
    movie_title = models.CharField(max_length=255)
    showtime = models.DateTimeField()
    seats = models.JSONField()  # Store as a JSON array
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.movie_title} - {self.showtime}"
    
    class Meta:
        ordering = ['-created_at']
