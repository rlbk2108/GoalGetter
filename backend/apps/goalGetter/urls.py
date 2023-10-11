from django.urls import path
from .views import GoalCreatAPIView, PriorityAPIView, StatusAPIView, CategoryAPIView, TagAPIView, WeekdaysAPIView

urlpatterns = [
    path('goal_create/', GoalCreatAPIView.as_view(), name='goal_create'),
    path('priority/', PriorityAPIView.as_view(), name='priority'),
    path('status/', StatusAPIView.as_view(), name='status'),
    path('category/', CategoryAPIView.as_view(), name='category'),
    path('tag/', TagAPIView.as_view(), name='tag'),
    path('week_days/', WeekdaysAPIView.as_view(), name='week_days')
]
